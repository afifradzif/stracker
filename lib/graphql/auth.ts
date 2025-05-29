import { supabase } from '../supabase';
import { AuthResponse } from './types';
import * as Crypto from 'expo-crypto';

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

    // Insert new user without requiring auth
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          username, 
          password,
          id: Crypto.randomUUID() // Generate a UUID for the user
        }
      ])
      .select()
      .single();

    if (error) throw error;

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
