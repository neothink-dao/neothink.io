import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Assuming framer-motion is available
import { cn } from '../utils';
import { platformColors } from './QuestCard'; // Reuse color definitions

interface StreakVortexProps {
  streak: number;
  platform: keyof typeof platformColors;
  className?: string;
}

const StreakVortex: React.FC<StreakVortexProps> = ({
  streak,
  platform,
  className,
}) => {
  const [boostPercentage, setBoostPercentage] = useState(0);
  const maxStreakForFullBoost = 34; // Example: Max streak for 161.8%
  const baseColor = '#71717a'; // Zinc neutral base
  const fillColor = platformColors[platform] || platformColors.default;

  useEffect(() => {
    // Calculate boost: 61.8% at streak 1 up to 161.8% at max streak
    const boost = Math.min(
      61.8 + (streak > 0 ? ((streak - 1) / (maxStreakForFullBoost - 1)) * 100 : 0),
      161.8
    );
    setBoostPercentage(streak > 0 ? boost : 0);
  }, [streak, maxStreakForFullBoost]);

  return (
    <div className={cn('relative w-16 h-16', className)}>
      {/* Base Circle */}
      <div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: baseColor }}
      />

      {/* Animated Fill Vortex */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{ transform: 'rotate(-90deg)' }} // Start from top
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-full rounded-full"
          style={{
             background: `conic-gradient(${fillColor} 0%, ${fillColor} ${boostPercentage * 3.6}deg, transparent ${boostPercentage * 3.6}deg, transparent 360deg)`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
         {/* Optional inner spinning element for more "vortex" feel */}
         <motion.div
            className="absolute inset-1 rounded-full border-t-2 border-b-2"
            style={{ borderColor: `${fillColor}80`, borderWidth: '1px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
         />
      </motion.div>


      {/* Streak Number */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold" style={{ color: baseColor }}>
          {streak}
        </span>
      </div>

       {/* Boost Percentage Text (Optional) */}
       {/* <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs" style={{ color: fillColor }}>
         +{boostPercentage.toFixed(1)}%
       </div> */}
    </div>
  );
};

export { StreakVortex }; 