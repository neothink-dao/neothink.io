import React from 'react';
import { cn } from '../utils';
const PointsCircle = ({ points, platformColor, size = 40, // Default size
className, }) => {
    const outlineColor = '#71717a'; // Zinc neutral
    const textColor = '#ffffff'; // White text for contrast, adjust if needed
    return (<div className={cn('relative rounded-full flex items-center justify-center', className)} style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: platformColor,
            border: `2px solid ${outlineColor}`, // Zinc outline
            boxShadow: `0 0 5px ${platformColor}`, // Subtle glow
        }}>
      <span className="font-bold text-sm" // Adjust font size/weight as needed
     style={{ color: textColor }}>
        {points}
      </span>
    </div>);
};
export { PointsCircle };
//# sourceMappingURL=PointsCircle.js.map