import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Define a schema for input validation
const SignupSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  platform: z.string().optional().default('neothink'),
})

export async function POST(request: Request) {
  try {
    // Parse and validate request input
    const body = await request.json()
    const validationResult = SignupSchema.safeParse(body)
    
    if (!validationResult.success) {
      // Return validation errors
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten() 
        },
        { status: 400 }
      )
    }
    
    // Extract validated data
    const { email, password, name, platform } = validationResult.data
    
    // Get cookie store for auth
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle()
      
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Create the user with additional security measures
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          name: name || email.split('@')[0],
          site_name: "Neothink",
          site_url: process.env.NEXT_PUBLIC_SITE_URL,
          platform,
          signup_ip: request.headers.get('x-forwarded-for') || 'unknown',
          signup_timestamp: new Date().toISOString(),
        }
      }
    })

    if (signUpError) {
      console.error('Signup error:', signUpError)
      
      // Enhanced error handling with appropriate status codes
      if (signUpError.message.includes('email already')) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      )
    }

    // Create profile and privacy settings in a transaction with additional security logging
    const { error: profileError } = await supabase.rpc('create_user_profile', {
      user_id: authData.user.id,
      email: email,
      name: name || null,
      platform: platform
    })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Cleanup: Delete the user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      )
    }
    
    // Log successful signup for audit trail
    await supabase.from('auth_logs').insert({
      user_id: authData.user.id,
      action: 'signup_success',
      platform: platform,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      details: {
        method: 'email',
        email_confirmation_sent: true
      }
    }).catch(err => console.error('Failed to log signup:', err))

    return NextResponse.json(
      { 
        message: 'User created successfully. Please check your email to confirm your account.',
        userId: authData.user.id,
        requiresEmailConfirmation: true
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error during signup:', error)
    
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        message: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
} 