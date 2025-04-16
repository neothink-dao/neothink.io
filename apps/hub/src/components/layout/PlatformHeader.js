import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { PlatformBridgeProvider, usePlatformBridge } from '@neothink/platform-bridge';
import { PLATFORM_NAMES, PLATFORM_COLORS } from '@neothink/platform-bridge';
// Inner component that uses the platform bridge context
const PlatformHeaderInner = () => {
    const { currentPlatform, navigateToPlatform, unreadNotificationCount, preferences } = usePlatformBridge();
    // Theme from preferences
    const theme = (preferences === null || preferences === void 0 ? void 0 : preferences.theme) || 'system';
    // Platform color
    const platformColor = PLATFORM_COLORS[currentPlatform];
    return (<header className="platform-header" style={{ borderColor: platformColor }}>
      <div className="platform-header-left">
        <img src={`/logos/${currentPlatform}-logo.svg`} alt={`${PLATFORM_NAMES[currentPlatform]} Logo`} className="platform-logo"/>
        <h1 className="platform-name">{PLATFORM_NAMES[currentPlatform]}</h1>
      </div>
      
      <div className="platform-header-center">
        {/* Navigation options specific to current platform */}
      </div>
      
      <div className="platform-header-right">
        {/* Platform switcher */}
        <div className="platform-switcher">
          <select value={currentPlatform} onChange={(e) => navigateToPlatform(e.target.value)} className="platform-selector" style={{ borderColor: platformColor }}>
            <option value="hub">Hub</option>
            <option value="immortals">Immortals</option>
            <option value="ascenders">Ascenders</option>
            <option value="neothinkers">Neothinkers</option>
          </select>
        </div>
        
        {/* Notification indicator */}
        <div className="notification-indicator">
          <button className="notification-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {unreadNotificationCount > 0 && (<span className="notification-badge">{unreadNotificationCount}</span>)}
          </button>
        </div>
        
        {/* Theme toggle */}
        <div className="theme-toggle">
          <button className={`theme-button ${theme === 'light' ? 'active' : ''}`} onClick={() => {
            // Theme toggling handled by platform bridge
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>);
};
function useSupabaseUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);
    return user;
}
// Main component that provides the platform bridge context
const PlatformHeader = () => {
    const user = useSupabaseUser();
    const [userId, setUserId] = useState(undefined);
    useEffect(() => {
        if (user) {
            setUserId(user.id);
        }
    }, [user]);
    return (<PlatformBridgeProvider userId={userId} initialPlatform="hub">
      <PlatformHeaderInner />
    </PlatformBridgeProvider>);
};
export default PlatformHeader;
//# sourceMappingURL=PlatformHeader.js.map