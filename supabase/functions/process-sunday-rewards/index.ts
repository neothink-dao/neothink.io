import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current date
    const now = new Date()
    const dayOfWeek = now.getUTCDay() // 0 = Sunday

    // Only process on Sundays
    if (dayOfWeek === 0) {
      // Get today's meeting ID (format: YYYY-MM-DD)
      const meetingId = now.toISOString().split('T')[0]

      // Process rewards for today's meeting
      const { data, error } = await supabaseClient
        .rpc('process_sunday_zoom_rewards', {
          p_meeting_id: meetingId,
          p_minimum_duration: 30 // 30 minutes minimum attendance
        })

      if (error) throw error

      return new Response(
        JSON.stringify({
          success: true,
          rewards_given: data
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Not Sunday, no rewards processed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 