import { storageService } from './localStorageService';
import {
  Notification,
  NotificationSettings,
  NotificationCenterData,
  STORAGE_KEYS,
  STORAGE_EXPIRY,
  UserType,
  NotificationType
} from '@/types/dashboard';

class NotificationStorageService {
  private static instance: NotificationStorageService;

  private constructor() {}

  public static getInstance(): NotificationStorageService {
    if (!NotificationStorageService.instance) {
      NotificationStorageService.instance = new NotificationStorageService();
    }
    return NotificationStorageService.instance;
  }

  /**
   * Save notification center data to local storage
   * @param userType The type of user (farmer/seller/admin)
   * @param notifications Array of notifications to store
   * @param settings Notification settings
   */
  public saveNotifications(
    userType: UserType,
    notifications: Notification[],
    settings: NotificationSettings
  ): void {
    const notificationData: NotificationCenterData = {
      userType,
      notifications,
      settings,
      lastUpdated: Date.now()
    };

    try {
      storageService.setItem(
        `${STORAGE_KEYS.NOTIFICATIONS}_${userType}`,
        notificationData,
        STORAGE_EXPIRY.NOTIFICATIONS
      );
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  /**
   * Retrieve notification center data from local storage
   * @param userType The type of user (farmer/seller/admin)
   * @returns Notification center data if found and not expired, null otherwise
   */
  public getNotifications(userType: UserType): NotificationCenterData | null {
    try {
      return storageService.getItem<NotificationCenterData>(
        `${STORAGE_KEYS.NOTIFICATIONS}_${userType}`
      );
    } catch (error) {
      console.error('Error retrieving notifications:', error);
      return null;
    }
  }

  /**
   * Add a new notification
   * @param userType The type of user (farmer/seller/admin)
   * @param notification Notification to add
   * @returns boolean indicating if the operation was successful
   */
  public addNotification(userType: UserType, notification: Notification): boolean {
    const currentData = this.getNotifications(userType);
    if (!currentData) return false;

    const updatedNotifications = [notification, ...currentData.notifications];
    this.saveNotifications(userType, updatedNotifications, currentData.settings);
    return true;
  }

  /**
   * Mark a notification as read
   * @param userType The type of user (farmer/seller/admin)
   * @param notificationId ID of the notification to mark as read
   * @returns boolean indicating if the operation was successful
   */
  public markAsRead(userType: UserType, notificationId: string): boolean {
    const currentData = this.getNotifications(userType);
    if (!currentData) return false;

    const updatedNotifications = currentData.notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );

    this.saveNotifications(userType, updatedNotifications, currentData.settings);
    return true;
  }

  /**
   * Mark all notifications as read
   * @param userType The type of user (farmer/seller/admin)
   * @returns boolean indicating if the operation was successful
   */
  public markAllAsRead(userType: UserType): boolean {
    const currentData = this.getNotifications(userType);
    if (!currentData) return false;

    const updatedNotifications = currentData.notifications.map(notification => ({
      ...notification,
      read: true
    }));

    this.saveNotifications(userType, updatedNotifications, currentData.settings);
    return true;
  }

  /**
   * Remove a notification
   * @param userType The type of user (farmer/seller/admin)
   * @param notificationId ID of the notification to remove
   * @returns boolean indicating if the operation was successful
   */
  public removeNotification(userType: UserType, notificationId: string): boolean {
    const currentData = this.getNotifications(userType);
    if (!currentData) return false;

    const updatedNotifications = currentData.notifications.filter(
      notification => notification.id !== notificationId
    );

    this.saveNotifications(userType, updatedNotifications, currentData.settings);
    return true;
  }

  /**
   * Update notification settings
   * @param userType The type of user (farmer/seller/admin)
   * @param settings Updated notification settings
   * @returns boolean indicating if the operation was successful
   */
  public updateSettings(
    userType: UserType,
    settings: NotificationSettings
  ): boolean {
    const currentData = this.getNotifications(userType);
    if (!currentData) return false;

    this.saveNotifications(userType, currentData.notifications, settings);
    return true;
  }

  /**
   * Toggle notification category
   * @param userType The type of user (farmer/seller/admin)
   * @param category Category to toggle
   * @returns boolean indicating if the operation was successful
   */
  public toggleCategory(
    userType: UserType,
    category: NotificationType
  ): boolean {
    const currentData = this.getNotifications(userType);
    if (!currentData) return false;

    const updatedSettings = {
      ...currentData.settings,
      categories: {
        ...currentData.settings.categories,
        [category]: !currentData.settings.categories[category]
      }
    };

    return this.updateSettings(userType, updatedSettings);
  }

  /**
   * Clear notifications for a specific user type
   * @param userType The type of user (farmer/seller/admin)
   */
  public clearNotifications(userType: UserType): void {
    try {
      storageService.removeItem(`${STORAGE_KEYS.NOTIFICATIONS}_${userType}`);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  /**
   * Check if notifications need to be refreshed
   * @param userType The type of user (farmer/seller/admin)
   * @returns boolean indicating if data should be refreshed
   */
  public shouldRefreshNotifications(userType: UserType): boolean {
    const timeToExpiry = storageService.getTimeToExpiry(
      `${STORAGE_KEYS.NOTIFICATIONS}_${userType}`
    );
    // Return true if no expiry time or less than 15 minutes remaining
    return !timeToExpiry || timeToExpiry < 15 * 60 * 1000;
  }
}

export const notificationStorage = NotificationStorageService.getInstance();