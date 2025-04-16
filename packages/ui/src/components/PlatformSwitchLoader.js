import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const platformColors = {
    hub: 'bg-indigo-500',
    ascenders: 'bg-green-500',
    neothinkers: 'bg-amber-500',
    immortals: 'bg-red-500'
};
const platformNames = {
    hub: 'Hub',
    ascenders: 'Ascenders',
    neothinkers: 'Neothinkers',
    immortals: 'Immortals'
};
export function PlatformSwitchLoader({ isLoading, fromPlatform, toPlatform, error }) {
    if (!isLoading && !error)
        return null;
    return (<AnimatePresence>
      {(isLoading || error) && (<motion.div initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -100 }} className="fixed top-0 left-0 right-0 z-50 flex justify-center">
          <div className="bg-white shadow-lg rounded-b-lg px-4 py-3 flex items-center space-x-4">
            {isLoading ? (<>
                {/* Loading spinner */}
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-indigo-600"/>
                
                {/* Platform transition text */}
                <div className="text-sm">
                  <span className="font-medium">
                    {fromPlatform && `${platformNames[fromPlatform]}`}
                  </span>
                  {fromPlatform && toPlatform && (<span className="mx-2">→</span>)}
                  <span className={`font-medium ${toPlatform ? platformColors[toPlatform] : ''} bg-clip-text text-transparent`}>
                    {toPlatform && `${platformNames[toPlatform]}`}
                  </span>
                </div>

                {/* Progress dots */}
                <div className="flex space-x-1">
                  <motion.div animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1]
                }} transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 0.2
                }} className="w-1.5 h-1.5 rounded-full bg-gray-400"/>
                  <motion.div animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1]
                }} transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 0.2,
                    delay: 0.2
                }} className="w-1.5 h-1.5 rounded-full bg-gray-400"/>
                  <motion.div animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1]
                }} transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 0.2,
                    delay: 0.4
                }} className="w-1.5 h-1.5 rounded-full bg-gray-400"/>
                </div>
              </>) : error ? (<>
                {/* Error icon */}
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>

                {/* Error message */}
                <div className="text-sm text-red-600">
                  {error.message}
                </div>

                {error.code === 'ACCESS_DENIED' && (<button className="ml-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium" onClick={() => {
                        // Handle request access
                        if (toPlatform) {
                            window.location.href = `/${toPlatform}/request-access`;
                        }
                    }}>
                    Request Access
                  </button>)}
              </>) : null}
          </div>
        </motion.div>)}
    </AnimatePresence>);
}
//# sourceMappingURL=PlatformSwitchLoader.js.map