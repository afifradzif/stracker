import { supabase } from '../supabase';
import { Task } from './types';
import { getCurrentUserId } from '../store/session';

export const getTasks = async (): Promise<Task[]> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('User not logged in');

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('due', { ascending: true });

  if (error) throw error;
  return data;
};

export const addTask = async (task: Omit<Task, 'user_id' | 'created_at'>): Promise<Task> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('User not logged in');

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...task, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTaskStatus = async (id: string, completed: boolean): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', id);

  if (error) throw error;
};

export const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const updateTaskProgress = async (id: string, progress: number): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({ progress })
    .eq('id', id);

  if (error) throw error;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
};
