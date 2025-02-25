import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

// Default admin user for development
const ADMIN_EMAIL = 'admin@aievento.com';
const ADMIN_PASSWORD = 'admin123456';

export const ensureAdminUser = async () => {
  try {
    // Try to sign in with admin credentials
    return await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      // If admin doesn't exist, create one
      return await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    }
    throw error;
  }
};
