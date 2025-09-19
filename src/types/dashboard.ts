import { ElementType } from "react";

// Common Types
export type UserType = "farmer" | "seller" | "admin";
export type MetricChangeType = "increase" | "decrease" | "neutral";
export type NotificationPriority = "high" | "medium" | "low";
export type NotificationType = "weather" | "market" | "system" | "order" | "alert";

// Metric Interfaces
export interface DashboardMetric {
  title: string;
  value: string | number;
  change: number;
  changeType: MetricChangeType;
  icon: ElementType;
  description: string;
  color?: "primary" | "secondary" | "success" | "warning" | "destructive";
}

export interface DashboardMetricsData {
  userType: UserType;
  metrics: DashboardMetric[];
  lastUpdated: number;
}

// Quick Actions Interfaces
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: ElementType;
  path?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary";
  badge?: string;
  featured?: boolean;
}

export interface QuickActionsData {
  userType: UserType;
  actions: QuickAction[];
  preferences: {
    favorites: string[];
    hidden: string[];
  };
  lastUpdated: number;
}

// Notification Interfaces
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  priority: NotificationPriority;
  read: boolean;
  actionable?: boolean;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  categories: {
    [key in NotificationType]: boolean;
  };
}

export interface NotificationCenterData {
  userType: UserType;
  notifications: Notification[];
  settings: NotificationSettings;
  lastUpdated: number;
}

// Storage Keys
export const STORAGE_KEYS = {
  METRICS: 'dashboard_metrics',
  ACTIONS: 'quick_actions',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'notification_settings'
} as const;

// Storage Expiry Times (in hours)
export const STORAGE_EXPIRY = {
  METRICS: 1, // 1 hour
  ACTIONS: 24, // 24 hours
  NOTIFICATIONS: 12, // 12 hours
  SETTINGS: 168 // 1 week
} as const;