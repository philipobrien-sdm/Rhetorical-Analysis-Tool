import type { HistoryEntry } from '../types';

const STORAGE_KEY = 'rhetoricalAnalysisHistory';

/**
 * Retrieves the entire analysis history from local storage.
 * @returns {HistoryEntry[]} An array of history entries, sorted by creation date descending.
 */
export const getHistory = (): HistoryEntry[] => {
  try {
    const rawHistory = localStorage.getItem(STORAGE_KEY);
    if (!rawHistory) return [];
    const history: HistoryEntry[] = JSON.parse(rawHistory);
    // Sort by most recent first
    return history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    return [];
  }
};

/**
 * Saves the entire history array to local storage.
 * @param {HistoryEntry[]} history The history array to save.
 */
const saveHistory = (history: HistoryEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
  }
};

/**
 * Adds a new analysis entry to the history.
 * @param {HistoryEntry} newEntry The new history entry to add.
 * @returns {HistoryEntry[]} The updated history array.
 */
export const addAnalysis = (newEntry: HistoryEntry): HistoryEntry[] => {
  const currentHistory = getHistory();
  // Prepend the new entry to the start of the array
  const updatedHistory = [newEntry, ...currentHistory];
  saveHistory(updatedHistory);
  return updatedHistory;
};

/**
 * Updates the name of a specific history entry.
 * @param {string} id The ID of the entry to update.
 * @param {string} name The new name for the entry.
 * @returns {HistoryEntry[]} The updated history array.
 */
export const updateAnalysisName = (id: string, name: string): HistoryEntry[] => {
  const currentHistory = getHistory();
  const entryIndex = currentHistory.findIndex(entry => entry.id === id);
  if (entryIndex !== -1) {
    currentHistory[entryIndex].name = name;
    saveHistory(currentHistory);
  }
  return currentHistory;
};

/**
 * Deletes an analysis entry from the history.
 * @param {string} id The ID of the entry to delete.
 * @returns {HistoryEntry[]} The updated history array.
 */
export const deleteAnalysis = (id: string): HistoryEntry[] => {
  const currentHistory = getHistory();
  const updatedHistory = currentHistory.filter(entry => entry.id !== id);
  saveHistory(updatedHistory);
  return updatedHistory;
};

/**
 * Finds a history entry by the original input text or URL.
 * @param {string} input The input string to search for.
 * @returns {HistoryEntry | undefined} The found entry, or undefined if not found.
 */
export const findAnalysisByInput = (input: string): HistoryEntry | undefined => {
  const currentHistory = getHistory();
  return currentHistory.find(entry => entry.input.trim() === input.trim());
};
