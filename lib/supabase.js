import { createClient } from '@supabase/supabase-js';

// Pour l'instant, utilise ces valeurs temporaires
// Tu les remplaceras plus tard avec tes vraies clés Supabase
const SUPABASE_URL = 'https://rjhrekrqywueijuvokos.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqaHJla3JxeXd1ZWlqdXZva29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MDMyNDYsImV4cCI6MjA4MTA3OTI0Nn0.Er7t365RgzKWOe4hLvX7Z6BdplaYiKQBSmZ6nwT1HlQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mock functions pour tester sans Supabase (temporaire)
export const createUserProfile = async (userId, profileData) => {
  console.log('Creating profile:', { userId, profileData });
  return { data: profileData, error: null };
};

export const getUserProfile = async (userId) => {
  console.log('Getting profile for:', userId);
  return { data: null, error: null };
};

export const updateUserProfile = async (userId, updates) => {
  console.log('Updating profile:', { userId, updates });
  return { data: updates, error: null };
};

export const signUpUser = async (email, password, metadata = {}) => {
  console.log('Mock signup:', { email, metadata });
  // Mock response
  return {
    data: {
      user: {
        id: 'mock-user-id-' + Date.now(),
        email: email,
      }
    },
    error: null
  };
};

export const signInUser = async (email, password) => {
  console.log('Mock signin:', { email });
  // Mock response
  return {
    data: {
      user: {
        id: 'mock-user-id',
        email: email,
      }
    },
    error: null
  };
};

export const signOutUser = async () => {
  console.log('Mock signout');
  return { error: null };
};

export const getCurrentUser = async () => {
  console.log('Getting current user');
  return null;
};