import React from 'react';
import { Button } from '../ui/button';
import { cn } from '../utils';
import { platformColors } from './QuestCard'; // For LUCK color
const SparkCircle = ({ onSubmit, isSubmitting = false, className, }) => {
    const formColor = '#27272a'; // Zinc dark
    const submitColor = platformColors.luck; // Yellow #eab308
    const outlineColor = '#71717a'; // Zinc neutral for subtle outline
    return (<div className={cn('relative w-24 h-24 rounded-full flex items-center justify-center p-2', // Adjust size as needed
        className)} style={{
            backgroundColor: formColor,
            border: `1px solid ${outlineColor}`,
        }}>
      {/* Placeholder for potential form elements inside circle if needed */}
      {/* e.g., small input or icon */}

      {/* Submit Button positioned at the bottom */}
      <Button type="button" onClick={onSubmit} disabled={isSubmitting} className="absolute bottom-1 left-1/2 transform -translate-x-1/2 rounded-full w-10 h-10 p-0" // Small circular button
     style={{ backgroundColor: submitColor }} aria-label="Submit Spark">
        {/* Spark Icon or Text */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </Button>
    </div>);
};
export { SparkCircle };
//# sourceMappingURL=SparkCircle.js.map