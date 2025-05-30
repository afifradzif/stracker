import { supabase } from '../supabase';
import { AuthResponse } from './types';
import { setCurrentUserId } from '../store/session';

export const registerUser = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    // First check if username exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      throw new Error('Username already taken');
    }

    // Insert new user and let Supabase generate the UUID
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password }])
      .select()
      .single();

    if (error) throw error;

    // Store user ID in session immediately after registration
    setCurrentUserId(data.id);

    return {
      user: {
        id: data.id,
        username: data.username,
        created_at: data.created_at
      },
      error: null
    };
  } catch (error: any) {
    return {
      user: null,
      error: error.message
    };
  }
};

export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error) throw new Error('Invalid username or password');

    // Store user ID in session
    setCurrentUserId(data.id);

    return {
      user: {
        id: data.id,
        username: data.username,
        created_at: data.created_at
      },
      error: null
    };
  } catch (error: any) {
    return {
      user: null,
      error: error.message
    };
  }
};
