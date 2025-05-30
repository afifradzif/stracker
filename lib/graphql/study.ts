import { supabase } from '../supabase';
import { StudyPlan } from './types';
import { getCurrentUserId } from '../store/session';

export const getStudyPlans = async (): Promise<StudyPlan[]> => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('User not logged in');
  }

  const { data, error } = await supabase
    .from('study_plans')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error) throw error;
  return data;
};

export const addStudyPlan = async (plan: Omit<StudyPlan, 'user_id' | 'created_at'>): Promise<StudyPlan> => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('User not logged in');
  }

  // Convert date to ISO string if it's a Date object
  const planData = {
    ...plan,
    user_id: userId,
    date: plan.date instanceof Date ? plan.date.toISOString() : plan.date
  };

  const { data, error } = await supabase
    .from('study_plans')
    .insert([planData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateStudyPlan = async (id: string, completed: boolean): Promise<void> => {
  const { error } = await supabase
    .from('study_plans')
    .update({ completed })
    .eq('id', id);

  if (error) throw error;
};

export const deleteStudyPlan = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('study_plans')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const removeAllStudyPlans = async (): Promise<void> => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('User not logged in');

  const { error } = await supabase
    .from('study_plans')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
};
