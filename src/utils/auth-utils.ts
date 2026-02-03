import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const logout = async () => {
  try {
    await signOut(auth);
    // Clear any local storage or session data if needed
    localStorage.clear();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Function to use logout functionality
export const handleLogout = async () => {
  try {
    await logout();
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
  }
};