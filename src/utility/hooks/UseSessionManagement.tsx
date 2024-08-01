import { useEffect } from 'react';
import { globalService } from '../../services/GlobalService';

const UseSessionManagement = () => {
  useEffect(() => {
    
    // Generate a unique session ID if it doesn't exist
    if (!localStorage.getItem('sessionId')) {
      const sessionId = globalService.generateSessionId();
      localStorage.setItem('sessionId', sessionId);
    }

    // Set the current session ID in sessionStorage
    sessionStorage.setItem('currentSessionId', localStorage.getItem('sessionId'));

    // Add beforeunload event to clear the session
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('currentSessionId');
      localStorage.removeItem('sessionId');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Listen for storage events to detect changes in other tabs
    const handleStorageChange = (event:any) => {
      
        if (event.key === 'sessionId' && event.oldValue && !event.newValue) {
        // Session has been cleared in another tab, clear the current session
        sessionStorage.removeItem('currentSessionId');
        window.location.reload(); // Or handle session end in a way appropriate for your app
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
};

export default UseSessionManagement;
