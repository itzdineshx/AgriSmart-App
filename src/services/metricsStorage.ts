import { storageService } from './localStorageService';
import {
  DashboardMetric,
  DashboardMetricsData,
  STORAGE_KEYS,
  STORAGE_EXPIRY,
  UserType
} from '@/types/dashboard';

class MetricsStorageService {
  private static instance: MetricsStorageService;

  private constructor() {}

  public static getInstance(): MetricsStorageService {
    if (!MetricsStorageService.instance) {
      MetricsStorageService.instance = new MetricsStorageService();
    }
    return MetricsStorageService.instance;
  }

  /**
   * Save metrics data to local storage
   * @param userType The type of user (farmer/seller/admin)
   * @param metrics Array of metrics to store
   */
  public saveMetrics(userType: UserType, metrics: DashboardMetric[]): void {
    const metricsData: DashboardMetricsData = {
      userType,
      metrics,
      lastUpdated: Date.now()
    };

    try {
      storageService.setItem(
        `${STORAGE_KEYS.METRICS}_${userType}`,
        metricsData,
        STORAGE_EXPIRY.METRICS
      );
    } catch (error) {
      console.error('Error saving metrics:', error);
    }
  }

  /**
   * Retrieve metrics data from local storage
   * @param userType The type of user (farmer/seller/admin)
   * @returns Dashboard metrics data if found and not expired, null otherwise
   */
  public getMetrics(userType: UserType): DashboardMetricsData | null {
    try {
      return storageService.getItem<DashboardMetricsData>(
        `${STORAGE_KEYS.METRICS}_${userType}`
      );
    } catch (error) {
      console.error('Error retrieving metrics:', error);
      return null;
    }
  }

  /**
   * Update a specific metric in the stored data
   * @param userType The type of user (farmer/seller/admin)
   * @param metricTitle The title of the metric to update
   * @param newValue The new value for the metric
   * @returns boolean indicating if the update was successful
   */
  public updateMetric(
    userType: UserType,
    metricTitle: string,
    newValue: Partial<DashboardMetric>
  ): boolean {
    const currentData = this.getMetrics(userType);
    if (!currentData) return false;

    const updatedMetrics = currentData.metrics.map(metric =>
      metric.title === metricTitle ? { ...metric, ...newValue } : metric
    );

    this.saveMetrics(userType, updatedMetrics);
    return true;
  }

  /**
   * Clear metrics data for a specific user type
   * @param userType The type of user (farmer/seller/admin)
   */
  public clearMetrics(userType: UserType): void {
    try {
      storageService.removeItem(`${STORAGE_KEYS.METRICS}_${userType}`);
    } catch (error) {
      console.error('Error clearing metrics:', error);
    }
  }

  /**
   * Check if metrics data needs to be refreshed
   * @param userType The type of user (farmer/seller/admin)
   * @returns boolean indicating if data should be refreshed
   */
  public shouldRefreshMetrics(userType: UserType): boolean {
    const timeToExpiry = storageService.getTimeToExpiry(
      `${STORAGE_KEYS.METRICS}_${userType}`
    );
    // Return true if no expiry time or less than 5 minutes remaining
    return !timeToExpiry || timeToExpiry < 5 * 60 * 1000;
  }
}

export const metricsStorage = MetricsStorageService.getInstance();