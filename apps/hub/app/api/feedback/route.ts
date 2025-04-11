import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { type, message } = await request.json();

    if (!type || !message) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Store feedback in Supabase
    const { error } = await supabase.from('feedback').insert({
      user_id: session.user.id,
      type,
      message,
      status: 'new',
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 