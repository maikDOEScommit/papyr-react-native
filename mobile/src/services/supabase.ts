// Supabase Client Service
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth helper functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// Database helper functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const getCommitments = async (userId: string) => {
  const { data, error } = await supabase
    .from('commitments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createCommitment = async (commitment: {
  userId: string;
  imageUrl: string;
  goalText: string;
  isDuringWolfHour: boolean;
}) => {
  const { data, error } = await supabase
    .from('commitments')
    .insert({
      user_id: commitment.userId,
      image_url: commitment.imageUrl,
      goal_text: commitment.goalText,
      is_during_wolf_hour: commitment.isDuringWolfHour,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const uploadImage = async (uri: string, userId: string) => {
  try {
    // Convert image to blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create unique filename
    const filename = `${userId}/${Date.now()}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('commitments')
      .upload(filename, blob, {
        contentType: 'image/jpeg',
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('commitments')
      .getPublicUrl(filename);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
