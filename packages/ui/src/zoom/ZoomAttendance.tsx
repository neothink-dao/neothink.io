import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface ZoomAttendanceProps {
  userId: string;
  meetingId: string;
  supabaseUrl: string;
  supabaseKey: string;
  onJoin?: () => void;
  onLeave?: () => void;
}

export function ZoomAttendance({
  userId,
  meetingId,
  supabaseUrl,
  supabaseKey,
  onJoin,
  onLeave
}: ZoomAttendanceProps) {
  const [attendanceId, setAttendanceId] = useState<string | null>(null);
  const attendanceIdRef = useRef<string | null>(null);
  const [isPresent, setIsPresent] = useState(false);
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Keep ref in sync with state
  useEffect(() => {
    attendanceIdRef.current = attendanceId;
  }, [attendanceId]);

  useEffect(() => {
    // Record join time when component mounts
    const recordJoin = async () => {
      try {
        const { data, error } = await supabase
          .rpc('record_zoom_attendance', {
            p_user_id: userId,
            p_meeting_id: meetingId
          });

        if (error) throw error;

        setAttendanceId(data);
        setIsPresent(true);
        onJoin?.();
      } catch (error) {
        console.error('Error recording join time:', error);
      }
    };

    recordJoin();

    // Record leave time when component unmounts
    return () => {
      const id = attendanceIdRef.current;
      if (id) {
        supabase
          .rpc('update_zoom_attendance', {
            p_attendance_id: id
          })
          .then(() => {
            setIsPresent(false);
            onLeave?.();
          })
          .catch((error) => {
            console.error('Error recording leave time:', error);
          });
      }
    };
  }, [userId, meetingId, supabase, onJoin, onLeave]);

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${isPresent ? 'bg-green-500' : 'bg-gray-300'}`} />
      <span className="text-sm">
        {isPresent ? 'Present' : 'Not Present'}
      </span>
    </div>
  );
}