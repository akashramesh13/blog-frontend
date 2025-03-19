import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import axios from '../helpers/axios';  // Use our custom axios instance
import { LOGOUT, LOGIN_SUCCESS } from '../redux/constants/authConstants';

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Handle storage events for cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      console.log('Storage event:', e.key, e.newValue);
      if (e.key === 'userInfo') {
        if (!e.newValue) {
          console.log('Logging out due to storage event');
          dispatch({ type: LOGOUT });
        } else {
          console.log('Logging in due to storage event');
          dispatch({ 
            type: LOGIN_SUCCESS, 
            payload: JSON.parse(e.newValue)
          });
        }
      }
    };

    const checkAuth = async () => {
      if (userInfo) {
        console.log('Checking auth status...');
        try {
          const response = await axios.get('/profile/check');
          console.log('Auth check successful:', response.status);
        } catch (error: any) {
          console.log('Auth check failed:', error.response?.status);
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.log('Session expired, logging out');
            localStorage.removeItem("userInfo");
            dispatch({ type: LOGOUT });
          }
        }
      } else {
        console.log('No user info, skipping auth check');
      }
    };

    // Add storage event listener
    window.addEventListener('storage', handleStorageChange);
    
    // Initial check
    checkAuth();
    
    // Periodic check
    const interval = setInterval(() => {
      console.log('Running periodic auth check');
      checkAuth();
    }, 1 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userInfo, dispatch]);
}; 