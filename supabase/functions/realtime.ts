import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

export const supabaseRealtime = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)

// Configure Broadcast channel
export const broadcastChannel = supabaseRealtime.channel('broadcast')
  .on('broadcast', { event: 'database-changes' }, (payload) => {
    console.log('Received database change:', payload)
  })
  .subscribe()

// Configure Presence for online users
export const presenceChannel = supabaseRealtime.channel('online-users')
  .on('presence', { event: 'sync' }, () => {
    const newState = presenceChannel.presenceState()
    console.log('Online users:', newState)
  })
  .subscribe() 