import { supabase } from '../supabase';
import { AuthResponse } from './types';
import { setCurrentUserId } from '../store/session';
import { setCurrentUserName } from '../store/user';

export const registerUser = async (
  username: string, 
  password: string,
  name: string,
  email: string
): Promise<AuthResponse> => {
  try {
    // Check if username or email exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('username, email')
      .or(`username.eq.${username},email.eq.${email}`)
      .single();

    if (existingUser) {
      if (existingUser.username === username) {
        throw new Error('Username already taken');
      }
      if (existingUser.email === email) {
        throw new Error('Email already registered');
      }
    }

    // Insert new user and let Supabase generate the UUID
    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        username, 
        password,
        name,
        email 
      }])
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
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error) throw new Error('Invalid username or password');

    // Store user ID and name in session
    setCurrentUserId(data.id);
    setCurrentUserName(data.name);

    return {
      user: {
        id: data.id,
        username: data.username,
        name: data.name,
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
