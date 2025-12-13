
import { supabase } from './lib/supabase';

const USER_ID = "17847301-5fdf-4499-8bdb-774a98c37ea0";

// Get all dates with tasks for a user
export async function getAgendaDates(userId ) {
  try {
    const { data, error } = await supabase
      .from('agenda')
      .select('date')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    if (error) throw error;

    const uniqueDates = [...new Set(data.map(item => item.date))];
    return uniqueDates;
  } catch (error) {
    console.error('Error fetching agenda dates:', error);
    return [];
  }
}

// Add a new task
export async function addTask(userId, date, time, title, description = '') {
  console.log('Ajout de tâche avec les données:', { userId, date, time, title });
  
  const { data, error } = await supabase
    .from('agenda')
    .insert([{
      user_id: userId,
      date,
      time,
      title,
      description,
      completed: false
    }])
    .select();

  if (error) {
    console.error('Erreur Supabase:', error);
    return null;
  }

  console.log('Tâche ajoutée avec succès:', data[0]);
  return data[0];
}

// Get all tasks for a specific date
export async function getTasksForDate(userId, date) {
  console.log('Récupération des tâches pour:', { userId, date });
  
  try {
    const { data, error } = await supabase
      .from('agenda')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('time', { ascending: true });

    if (error) {
      console.error('Erreur Supabase:', error);
      throw error;
    }

    console.log('Tâches récupérées:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}


// Update a task
export async function updateTask(taskId, updates) {
  try {
    const { data, error } = await supabase
      .from('agenda')
      .update(updates)
      .eq('id', taskId)
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error('Error updating task:', error);
    return null;
  }
}

// Delete a task
export async function deleteTask(taskId) {
  try {
    const { error } = await supabase
      .from('agenda')
      .delete()
      .eq('id', taskId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
}

// Toggle task completion
export async function toggleTaskCompleted(taskId, completed) {
  try {
    const { data, error } = await supabase
      .from('agenda')
      .update({ completed })
      .eq('id', taskId)
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error('Error toggling task completion:', error);
    return null;
  }
}
