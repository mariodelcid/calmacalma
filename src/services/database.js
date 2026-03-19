import { supabase } from '../supabaseClient';

export async function getUserSettings(userId) {
  const { data, error } = await supabase
    .from('users_settings')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user settings:', error);
    return null;
  }

  return data;
}

export async function saveUserSettings(userId, settings) {
  const { data, error } = await supabase
    .from('users_settings')
    .upsert({
      id: userId,
      theme: settings.theme,
      character_id: settings.character,
      lens_id: settings.lens,
      pin_hash: settings.pin,
      updated_at: new Date().toISOString()
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error saving user settings:', error);
    return null;
  }

  return data;
}

export async function getJournalEntries(userId) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching journal entries:', error);
    return [];
  }

  return data || [];
}

export async function saveJournalEntry(userId, entry) {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: userId,
      date: entry.date || new Date().toISOString().split('T')[0],
      mood: entry.mood,
      lens: entry.lens,
      released: entry.released || false,
      tags: entry.tags || [],
      text: entry.text,
      ai_response: entry.ai_response
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error saving journal entry:', error);
    return null;
  }

  return data;
}

export async function updateJournalEntry(entryId, updates) {
  const { data, error } = await supabase
    .from('journal_entries')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', entryId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating journal entry:', error);
    return null;
  }

  return data;
}

export async function deleteJournalEntry(entryId) {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId);

  if (error) {
    console.error('Error deleting journal entry:', error);
    return false;
  }

  return true;
}
