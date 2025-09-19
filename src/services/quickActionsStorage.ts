import { storageService } from './localStorageService';
import {
  QuickAction,
  QuickActionsData,
  STORAGE_KEYS,
  STORAGE_EXPIRY,
  UserType
} from '@/types/dashboard';

class QuickActionsStorageService {
  private static instance: QuickActionsStorageService;

  private constructor() {}

  public static getInstance(): QuickActionsStorageService {
    if (!QuickActionsStorageService.instance) {
      QuickActionsStorageService.instance = new QuickActionsStorageService();
    }
    return QuickActionsStorageService.instance;
  }

  /**
   * Save quick actions data to local storage
   * @param userType The type of user (farmer/seller/admin)
   * @param actions Array of quick actions to store
   * @param preferences User preferences for actions
   */
  public saveActions(
    userType: UserType,
    actions: QuickAction[],
    preferences?: { favorites: string[]; hidden: string[] }
  ): void {
    const actionsData: QuickActionsData = {
      userType,
      actions,
      preferences: preferences || { favorites: [], hidden: [] },
      lastUpdated: Date.now()
    };

    try {
      storageService.setItem(
        `${STORAGE_KEYS.ACTIONS}_${userType}`,
        actionsData,
        STORAGE_EXPIRY.ACTIONS
      );
    } catch (error) {
      console.error('Error saving actions:', error);
    }
  }

  /**
   * Retrieve quick actions data from local storage
   * @param userType The type of user (farmer/seller/admin)
   * @returns Quick actions data if found and not expired, null otherwise
   */
  public getActions(userType: UserType): QuickActionsData | null {
    try {
      return storageService.getItem<QuickActionsData>(
        `${STORAGE_KEYS.ACTIONS}_${userType}`
      );
    } catch (error) {
      console.error('Error retrieving actions:', error);
      return null;
    }
  }

  /**
   * Update user preferences for quick actions
   * @param userType The type of user (farmer/seller/admin)
   * @param preferences Updated preferences object
   * @returns boolean indicating if the update was successful
   */
  public updatePreferences(
    userType: UserType,
    preferences: { favorites: string[]; hidden: string[] }
  ): boolean {
    const currentData = this.getActions(userType);
    if (!currentData) return false;

    this.saveActions(userType, currentData.actions, preferences);
    return true;
  }

  /**
   * Toggle an action as favorite
   * @param userType The type of user (farmer/seller/admin)
   * @param actionId ID of the action to toggle
   * @returns boolean indicating if the operation was successful
   */
  public toggleFavorite(userType: UserType, actionId: string): boolean {
    const currentData = this.getActions(userType);
    if (!currentData) return false;

    const favorites = currentData.preferences.favorites;
    const isFavorite = favorites.includes(actionId);
    const updatedFavorites = isFavorite
      ? favorites.filter(id => id !== actionId)
      : [...favorites, actionId];

    return this.updatePreferences(userType, {
      ...currentData.preferences,
      favorites: updatedFavorites
    });
  }

  /**
   * Toggle visibility of an action
   * @param userType The type of user (farmer/seller/admin)
   * @param actionId ID of the action to toggle
   * @returns boolean indicating if the operation was successful
   */
  public toggleVisibility(userType: UserType, actionId: string): boolean {
    const currentData = this.getActions(userType);
    if (!currentData) return false;

    const hidden = currentData.preferences.hidden;
    const isHidden = hidden.includes(actionId);
    const updatedHidden = isHidden
      ? hidden.filter(id => id !== actionId)
      : [...hidden, actionId];

    return this.updatePreferences(userType, {
      ...currentData.preferences,
      hidden: updatedHidden
    });
  }

  /**
   * Clear quick actions data for a specific user type
   * @param userType The type of user (farmer/seller/admin)
   */
  public clearActions(userType: UserType): void {
    try {
      storageService.removeItem(`${STORAGE_KEYS.ACTIONS}_${userType}`);
    } catch (error) {
      console.error('Error clearing actions:', error);
    }
  }

  /**
   * Check if quick actions data needs to be refreshed
   * @param userType The type of user (farmer/seller/admin)
   * @returns boolean indicating if data should be refreshed
   */
  public shouldRefreshActions(userType: UserType): boolean {
    const timeToExpiry = storageService.getTimeToExpiry(
      `${STORAGE_KEYS.ACTIONS}_${userType}`
    );
    // Return true if no expiry time or less than 30 minutes remaining
    return !timeToExpiry || timeToExpiry < 30 * 60 * 1000;
  }
}

export const quickActionsStorage = QuickActionsStorageService.getInstance();