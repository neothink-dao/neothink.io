import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
export function ZoomAttendance({ userId, meetingId, supabaseUrl, supabaseKey, onJoin, onLeave }) {
    const [attendanceId, setAttendanceId] = useState(null);
    const [isPresent, setIsPresent] = useState(false);
    const supabase = createClient(supabaseUrl, supabaseKey);
    useEffect(() => {
        // Record join time when component mounts
        const recordJoin = async () => {
            try {
                const { data, error } = await supabase
                    .rpc('record_zoom_attendance', {
                    p_user_id: userId,
                    p_meeting_id: meetingId
                });
                if (error)
                    throw error;
                setAttendanceId(data);
                setIsPresent(true);
                onJoin === null || onJoin === void 0 ? void 0 : onJoin();
            }
            catch (error) {
                console.error('Error recording join time:', error);
            }
        };
        recordJoin();
        // Record leave time when component unmounts
        return () => {
            if (attendanceId) {
                supabase
                    .rpc('update_zoom_attendance', {
                    p_attendance_id: attendanceId
                })
                    .then(() => {
                    setIsPresent(false);
                    onLeave === null || onLeave === void 0 ? void 0 : onLeave();
                })
                    .catch((error) => {
                    console.error('Error recording leave time:', error);
                });
            }
        };
    }, [userId, meetingId, supabase, onJoin, onLeave]);
    return (<div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${isPresent ? 'bg-green-500' : 'bg-gray-300'}`}/>
      <span className="text-sm">
        {isPresent ? 'Present' : 'Not Present'}
      </span>
    </div>);
}
//# sourceMappingURL=ZoomAttendance.js.map