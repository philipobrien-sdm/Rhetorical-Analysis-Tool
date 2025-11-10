import type { UserProfile } from '../types';

const STORAGE_KEY = 'rhetoricalAnalysisUserProfile_v2'; // Changed key to avoid conflicts with old structure

/**
 * Retrieves the user profile from local storage.
 * @returns {UserProfile | null} The user profile, or null if not found.
 */
export const getUserProfile = (): UserProfile | null => {
  try {
    const rawProfile = localStorage.getItem(STORAGE_KEY);
    return rawProfile ? JSON.parse(rawProfile) : null;
  } catch (error) {
    console.error("Failed to parse user profile from localStorage", error);
    return null;
  }
};

/**
 * Saves the user profile to local storage.
 * @param {UserProfile} profile The user profile to save.
 */
export const saveUserProfile = (profile: UserProfile): void => {
  try {
    // Don't save if all fields are empty
    if (Object.values(profile).every(value => value.trim() === '')) {
        clearUserProfile();
        return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Failed to save user profile to localStorage", error);
  }
};

/**
 * Clears the user profile from local storage.
 */
export const clearUserProfile = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Failed to clear user profile from localStorage", error);
    }
};