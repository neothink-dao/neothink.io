"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  NavigationService: () => navigation_default,
  NotificationService: () => notifications_default,
  PLATFORM_COLORS: () => PLATFORM_COLORS,
  PLATFORM_ICONS: () => PLATFORM_ICONS,
  PLATFORM_NAMES: () => PLATFORM_NAMES,
  PLATFORM_URLS: () => PLATFORM_URLS,
  PlatformBridgeProvider: () => PlatformBridgeProvider,
  PlatformSwitcher: () => PlatformSwitcher,
  PreferencesService: () => preferences_default,
  StateSyncService: () => state_sync_default,
  usePlatformBridge: () => usePlatformBridge
});
module.exports = __toCommonJS(index_exports);

// src/types.ts
var PLATFORM_URLS = {
  hub: "https://go.neothink.io",
  immortals: "https://www.joinimmortals.org",
  ascenders: "https://www.joinascenders.org",
  neothinkers: "https://www.joinneothinkers.org"
};
var PLATFORM_ICONS = {
  hub: "hub",
  immortals: "immortals",
  ascenders: "ascenders",
  neothinkers: "neothinkers"
};
var PLATFORM_NAMES = {
  hub: "Hub",
  immortals: "Immortals",
  ascenders: "Ascenders",
  neothinkers: "Neothinkers"
};
var PLATFORM_COLORS = {
  hub: "var(--hub-primary)",
  immortals: "var(--immortals-primary)",
  ascenders: "var(--ascenders-primary)",
  neothinkers: "var(--neothinkers-primary)"
};

// src/constants.ts
var DEFAULT_PREFERENCES = {
  theme: "system",
  notifications: true,
  emailDigest: "weekly",
  language: "en",
  timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    largeText: false
  }
};
var PLATFORM_URLS2 = {
  hub: "https://go.neothink.io",
  immortals: "https://www.joinimmortals.org",
  ascenders: "https://www.joinascenders.org",
  neothinkers: "https://www.joinneothinkers.org"
};
var STORAGE_KEYS = {
  PREFERENCES: "neothink_preferences_",
  STATE: "neothink_state_",
  LAST_LOCATIONS: "neothink_last_locations"
};
var DB_TABLES = {
  PREFERENCES: "user_platform_preferences",
  STATE: "user_platform_state",
  NOTIFICATIONS: "cross_platform_notifications"
};
var TIME_CONFIG = {
  PREFERENCE_CACHE_TTL: 60 * 60 * 1e3,
  // 1 hour
  STATE_CACHE_TTL: 5 * 60 * 1e3,
  // 5 minutes
  NOTIFICATION_CHECK_INTERVAL: 30 * 1e3
  // 30 seconds
};

// src/navigation/index.ts
var NavigationService = class {
  /**
   * Navigate to another platform with context
   * @param platform Target platform
   * @param path Optional path within the platform
   * @param context Optional context to pass to the target platform
   */
  static navigateToPlatform(platform, path, context) {
    const baseUrl = PLATFORM_URLS2[platform];
    let url = baseUrl;
    if (path) {
      url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    }
    if (context && Object.keys(context).length > 0) {
      const params = new URLSearchParams();
      Object.entries(context).forEach(([key, value]) => {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          params.append(key, String(value));
        }
      });
      url = `${url}${url.includes("?") ? "&" : "?"}${params.toString()}`;
    }
    return url;
  }
  /**
   * Generate common navigation items for all platforms
   * @param currentPlatform Current platform
   * @returns Array of navigation items
   */
  static getCommonNavigation(currentPlatform) {
    return [
      {
        id: "switch-platform",
        title: "Switch Platform",
        url: "#",
        platform: currentPlatform,
        icon: "swap",
        children: [
          {
            id: "hub",
            title: "Hub",
            url: PLATFORM_URLS2.hub,
            platform: "hub",
            icon: "hub",
            isExternal: currentPlatform !== "hub"
          },
          {
            id: "immortals",
            title: "Immortals",
            url: PLATFORM_URLS2.immortals,
            platform: "immortals",
            icon: "immortals",
            isExternal: currentPlatform !== "immortals"
          },
          {
            id: "ascenders",
            title: "Ascenders",
            url: PLATFORM_URLS2.ascenders,
            platform: "ascenders",
            icon: "ascenders",
            isExternal: currentPlatform !== "ascenders"
          },
          {
            id: "neothinkers",
            title: "Neothinkers",
            url: PLATFORM_URLS2.neothinkers,
            platform: "neothinkers",
            icon: "neothinkers",
            isExternal: currentPlatform !== "neothinkers"
          }
        ]
      }
    ];
  }
  /**
   * Store the last visited location before leaving the platform
   * @param platform Current platform
   * @param path Current path
   */
  static storeLastLocation(platform, path) {
    try {
      const lastLocations = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.LAST_LOCATIONS) || "{}"
      );
      lastLocations[platform] = path;
      localStorage.setItem(STORAGE_KEYS.LAST_LOCATIONS, JSON.stringify(lastLocations));
    } catch (error) {
      console.error("Failed to store last location:", error);
    }
  }
  /**
   * Get the last visited location for a platform
   * @param platform Target platform
   * @returns Last visited path or null
   */
  static getLastLocation(platform) {
    try {
      const lastLocations = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.LAST_LOCATIONS) || "{}"
      );
      return lastLocations[platform] || null;
    } catch (error) {
      console.error("Failed to get last location:", error);
      return null;
    }
  }
  /**
   * Detect the current platform based on the hostname
   * @returns Current platform slug
   */
  static detectCurrentPlatform() {
    if (typeof window === "undefined") return "hub";
    const hostname = window.location.hostname;
    if (hostname.includes("immortals")) return "immortals";
    if (hostname.includes("ascenders")) return "ascenders";
    if (hostname.includes("neothinkers")) return "neothinkers";
    return "hub";
  }
  /**
   * Navigate to another platform and preserve the current user state
   * @param platform Target platform
   * @param path Optional path within the platform
   * @param preserveState Whether to preserve the current state
   */
  static navigateWithStatePreservation(platform, path, preserveState = true) {
    if (preserveState) {
      const currentPlatform = this.detectCurrentPlatform();
      this.storeLastLocation(currentPlatform, window.location.pathname);
    }
    const url = this.navigateToPlatform(platform, path, {
      sourcePlatform: this.detectCurrentPlatform(),
      preserveState
    });
    return url;
  }
};
var navigation_default = NavigationService;

// src/preferences/index.ts
var import_supabase_js = require("@supabase/supabase-js");
var PreferencesService = class {
  /**
   * Get user preferences for a specific platform
   * @param userId User ID
   * @param platform Platform slug
   * @returns Platform preferences or default preferences
   */
  static async getUserPreferences(userId, platform) {
    try {
      const cachedPreferences = this.getPreferencesFromCache(userId, platform);
      if (cachedPreferences) return cachedPreferences;
      const { data, error } = await this.supabase.from(DB_TABLES.PREFERENCES).select("preferences").eq("user_id", userId).eq("platform_slug", platform).single();
      if (error) throw error;
      const preferences = (data == null ? void 0 : data.preferences) || DEFAULT_PREFERENCES;
      this.updateLocalPreferencesCache(userId, platform, preferences);
      return preferences;
    } catch (error) {
      console.error(`Failed to get user preferences for ${platform}:`, error);
      return DEFAULT_PREFERENCES;
    }
  }
  /**
   * Save user preferences for a specific platform
   * @param userId User ID
   * @param platform Platform slug
   * @param preferences Platform preferences
   * @returns Success status
   */
  static async saveUserPreferences(userId, platform, preferences) {
    try {
      const existingPreferences = await this.getUserPreferences(userId, platform);
      const mergedPreferences = __spreadValues(__spreadValues({}, existingPreferences), preferences);
      const { error } = await this.supabase.from(DB_TABLES.PREFERENCES).upsert({
        user_id: userId,
        platform_slug: platform,
        preferences: mergedPreferences,
        last_accessed: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (error) throw error;
      this.updateLocalPreferencesCache(userId, platform, mergedPreferences);
      return true;
    } catch (error) {
      console.error(`Failed to save user preferences for ${platform}:`, error);
      return false;
    }
  }
  /**
   * Update local preferences cache
   * @param userId User ID
   * @param platform Platform slug
   * @param preferences Platform preferences
   */
  static updateLocalPreferencesCache(userId, platform, preferences) {
    try {
      const cacheKey = `${STORAGE_KEYS.PREFERENCES}${userId}`;
      const preferenceCache = JSON.parse(localStorage.getItem(cacheKey) || "{}");
      preferenceCache[platform] = __spreadProps(__spreadValues({}, preferences), {
        cachedAt: Date.now()
      });
      localStorage.setItem(cacheKey, JSON.stringify(preferenceCache));
    } catch (error) {
      console.error("Failed to update local preferences cache:", error);
    }
  }
  /**
   * Get preferences from local cache
   * @param userId User ID
   * @param platform Platform slug
   * @returns Cached preferences or null
   */
  static getPreferencesFromCache(userId, platform) {
    try {
      const cacheKey = `${STORAGE_KEYS.PREFERENCES}${userId}`;
      const preferenceCache = JSON.parse(localStorage.getItem(cacheKey) || "{}");
      const cachedData = preferenceCache[platform];
      if (!cachedData || !cachedData.cachedAt) return null;
      const cacheAge = Date.now() - cachedData.cachedAt;
      if (cacheAge > 60 * 60 * 1e3) return null;
      const _a = cachedData, { cachedAt } = _a, preferences = __objRest(_a, ["cachedAt"]);
      return preferences;
    } catch (error) {
      console.error("Failed to get preferences from cache:", error);
      return null;
    }
  }
  /**
   * Sync preferences across platforms
   * @param userId User ID
   * @param preferences Preferences to sync
   * @param platforms Platforms to sync to (default: all platforms)
   * @returns Success status
   */
  static async syncPreferencesAcrossPlatforms(userId, preferences, platforms = ["hub", "immortals", "ascenders", "neothinkers"]) {
    try {
      const results = await Promise.all(
        platforms.map(
          (platform) => this.saveUserPreferences(userId, platform, preferences)
        )
      );
      return results.every((result) => result === true);
    } catch (error) {
      console.error("Failed to sync preferences across platforms:", error);
      return false;
    }
  }
  /**
   * Reset preferences to default for a specific platform
   * @param userId User ID
   * @param platform Platform to reset
   * @returns Success status
   */
  static async resetPreferences(userId, platform) {
    return this.saveUserPreferences(userId, platform, DEFAULT_PREFERENCES);
  }
};
PreferencesService.supabase = (0, import_supabase_js.createClient)(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);
var preferences_default = PreferencesService;

// src/notifications/index.ts
var import_supabase_js2 = require("@supabase/supabase-js");
var NotificationService = class {
  /**
   * Send a notification to one or more platforms
   * @param userId User ID
   * @param sourcePlatform Source platform
   * @param targetPlatforms Target platforms
   * @param title Notification title
   * @param content Notification content
   * @param priority Notification priority
   * @param actionUrl Optional action URL
   * @returns Success status
   */
  static async sendNotification(userId, sourcePlatform, targetPlatforms, title, content, priority = "medium", actionUrl) {
    try {
      const { error } = await this.supabase.from(DB_TABLES.NOTIFICATIONS).insert({
        user_id: userId,
        source_platform: sourcePlatform,
        target_platforms: targetPlatforms,
        title,
        content,
        priority,
        action_url: actionUrl,
        read: false,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Failed to send notification:", error);
      return false;
    }
  }
  /**
   * Get notifications for a user on specific platforms
   * @param userId User ID
   * @param platforms Platforms to get notifications for
   * @param limit Maximum number of notifications to get
   * @param offset Offset for pagination
   * @returns Array of notifications
   */
  static async getNotifications(userId, platforms, limit = 20, offset = 0) {
    try {
      const { data, error } = await this.supabase.from(DB_TABLES.NOTIFICATIONS).select("*").eq("user_id", userId).contains("target_platforms", platforms).order("created_at", { ascending: false }).range(offset, offset + limit - 1);
      if (error) throw error;
      return (data || []).map(this.mapNotificationFromEntity);
    } catch (error) {
      console.error("Failed to get notifications:", error);
      return [];
    }
  }
  /**
   * Map database entity to our type
   * @param entity Database entity
   * @returns CrossPlatformNotification
   */
  static mapNotificationFromEntity(entity) {
    return {
      id: entity.id,
      userId: entity.user_id,
      sourcePlatform: entity.source_platform,
      targetPlatforms: entity.target_platforms,
      title: entity.title,
      content: entity.content,
      actionUrl: entity.action_url,
      priority: entity.priority,
      read: entity.read,
      createdAt: entity.created_at
    };
  }
  /**
   * Mark notifications as read
   * @param userId User ID
   * @param notificationIds Notification IDs to mark as read
   * @returns Success status
   */
  static async markAsRead(userId, notificationIds) {
    try {
      if (notificationIds.length === 0) return true;
      const { error } = await this.supabase.from(DB_TABLES.NOTIFICATIONS).update({ read: true }).eq("user_id", userId).in("id", notificationIds);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
      return false;
    }
  }
  /**
   * Subscribe to real-time notifications
   * @param userId User ID
   * @param platforms Platforms to subscribe to
   * @param callback Callback function for new notifications
   * @returns Subscription ID
   */
  static subscribeToNotifications(userId, platforms, callback) {
    const subscriptionId = `${userId}-${Date.now()}`;
    const channel = this.supabase.channel(`notifications-${subscriptionId}`).on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: DB_TABLES.NOTIFICATIONS,
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        const notification = payload.new;
        if (notification.target_platforms && notification.target_platforms.some((p) => platforms.includes(p))) {
          callback(this.mapNotificationFromEntity(notification));
        }
      }
    ).subscribe();
    this.subscriptions.set(subscriptionId, channel);
    return subscriptionId;
  }
  /**
   * Unsubscribe from real-time notifications
   * @param subscriptionId Subscription ID
   */
  static unsubscribeFromNotifications(subscriptionId) {
    const channel = this.subscriptions.get(subscriptionId);
    if (channel) {
      this.supabase.removeChannel(channel);
      this.subscriptions.delete(subscriptionId);
    }
  }
  /**
   * Get unread notification count
   * @param userId User ID
   * @param platforms Platforms to count notifications for
   * @returns Number of unread notifications
   */
  static async getUnreadCount(userId, platforms) {
    try {
      const { count, error } = await this.supabase.from(DB_TABLES.NOTIFICATIONS).select("*", { count: "exact", head: true }).eq("user_id", userId).eq("read", false).contains("target_platforms", platforms);
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error("Failed to get unread notification count:", error);
      return 0;
    }
  }
  /**
   * Get notifications with auto-refresh
   * @param userId User ID
   * @param platforms Platforms to get notifications for
   * @param limit Maximum number of notifications to get
   * @param callback Callback function for notifications
   * @returns Cleanup function
   */
  static subscribeToNotificationsWithPolling(userId, platforms, limit = 20, callback) {
    this.getNotifications(userId, platforms, limit).then(callback);
    const subscriptionId = this.subscribeToNotifications(
      userId,
      platforms,
      () => {
        this.getNotifications(userId, platforms, limit).then(callback);
      }
    );
    const interval = setInterval(() => {
      this.getNotifications(userId, platforms, limit).then(callback);
    }, TIME_CONFIG.NOTIFICATION_CHECK_INTERVAL);
    return () => {
      this.unsubscribeFromNotifications(subscriptionId);
      clearInterval(interval);
    };
  }
};
NotificationService.supabase = (0, import_supabase_js2.createClient)(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);
NotificationService.subscriptions = /* @__PURE__ */ new Map();
var notifications_default = NotificationService;

// src/state-sync/index.ts
var import_supabase_js3 = require("@supabase/supabase-js");
var StateSyncService = class {
  /**
   * Save platform state for a user
   * @param userId User ID
   * @param platform Current platform
   * @param state State to save
   * @returns Success status
   */
  static async savePlatformState(userId, platform, state) {
    try {
      const currentState = await this.getPlatformState(userId);
      const updatedState = __spreadProps(__spreadValues({}, currentState), {
        currentPlatform: platform,
        lastVisited: __spreadProps(__spreadValues({}, currentState.lastVisited), {
          [platform]: (/* @__PURE__ */ new Date()).toISOString()
        }),
        // Update platform-specific state
        [platform]: __spreadValues(__spreadValues({}, currentState[platform]), state)
      });
      const { error } = await this.supabase.from(DB_TABLES.STATE).upsert({
        user_id: userId,
        state: updatedState,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (error) throw error;
      this.updateLocalStateCache(userId, updatedState);
      return true;
    } catch (error) {
      console.error("Failed to save platform state:", error);
      return false;
    }
  }
  /**
   * Get platform state for a user
   * @param userId User ID
   * @returns Platform state
   */
  static async getPlatformState(userId) {
    try {
      const cachedState = this.getStateFromCache(userId);
      if (cachedState) return cachedState;
      const { data, error } = await this.supabase.from(DB_TABLES.STATE).select("state").eq("user_id", userId).single();
      if (error) throw error;
      if (data == null ? void 0 : data.state) {
        this.updateLocalStateCache(userId, data.state);
        return data.state;
      }
      return this.getDefaultState();
    } catch (error) {
      console.error("Failed to get platform state:", error);
      return this.getDefaultState();
    }
  }
  /**
   * Get initial state for a specific platform
   * @param userId User ID
   * @param platform Platform slug
   * @returns Platform-specific state
   */
  static async getInitialPlatformState(userId, platform) {
    try {
      const state = await this.getPlatformState(userId);
      await this.savePlatformState(userId, platform, {});
      return state[platform] || {};
    } catch (error) {
      console.error(`Failed to get initial state for ${platform}:`, error);
      return {};
    }
  }
  /**
   * Transfer state from one platform to another
   * @param userId User ID
   * @param fromPlatform Source platform
   * @param toPlatform Target platform
   * @param stateKeys Keys to transfer (default: all keys)
   * @returns Success status
   */
  static async transferState(userId, fromPlatform, toPlatform, stateKeys) {
    try {
      const state = await this.getPlatformState(userId);
      const sourceState = state[fromPlatform] || {};
      const targetState = state[toPlatform] || {};
      const newState = __spreadValues({}, targetState);
      if (stateKeys) {
        stateKeys.forEach((key) => {
          if (sourceState[key] !== void 0) {
            newState[key] = sourceState[key];
          }
        });
      } else {
        Object.assign(newState, sourceState);
      }
      return this.savePlatformState(userId, toPlatform, newState);
    } catch (error) {
      console.error("Failed to transfer state:", error);
      return false;
    }
  }
  /**
   * Get default platform state
   * @returns Default platform state
   */
  static getDefaultState() {
    return {
      hub: {},
      immortals: {},
      ascenders: {},
      neothinkers: {},
      currentPlatform: "hub",
      lastVisited: {
        hub: null,
        immortals: null,
        ascenders: null,
        neothinkers: null
      },
      preferences: {
        hub: DEFAULT_PREFERENCES,
        immortals: DEFAULT_PREFERENCES,
        ascenders: DEFAULT_PREFERENCES,
        neothinkers: DEFAULT_PREFERENCES
      },
      recentItems: {
        hub: [],
        immortals: [],
        ascenders: [],
        neothinkers: []
      },
      userProfile: {
        hub: {},
        immortals: {},
        ascenders: {},
        neothinkers: {}
      }
    };
  }
  /**
   * Update local state cache
   * @param userId User ID
   * @param state Platform state
   */
  static updateLocalStateCache(userId, state) {
    try {
      const stateWithMeta = __spreadProps(__spreadValues({}, state), {
        cachedAt: Date.now()
      });
      localStorage.setItem(`${STORAGE_KEYS.STATE}${userId}`, JSON.stringify(stateWithMeta));
    } catch (error) {
      console.error("Failed to update local state cache:", error);
    }
  }
  /**
   * Get state from local cache
   * @param userId User ID
   * @returns Cached state or null
   */
  static getStateFromCache(userId) {
    try {
      const cachedData = localStorage.getItem(`${STORAGE_KEYS.STATE}${userId}`);
      if (!cachedData) return null;
      const parsedData = JSON.parse(cachedData);
      if (!parsedData.cachedAt) return null;
      const cacheAge = Date.now() - parsedData.cachedAt;
      if (cacheAge > TIME_CONFIG.STATE_CACHE_TTL) return null;
      const _a = parsedData, { cachedAt } = _a, state = __objRest(_a, ["cachedAt"]);
      return state;
    } catch (error) {
      console.error("Failed to get state from cache:", error);
      return null;
    }
  }
  /**
   * Clear state for a user
   * @param userId User ID
   * @returns Success status
   */
  static async clearState(userId) {
    try {
      const { error } = await this.supabase.from(DB_TABLES.STATE).delete().eq("user_id", userId);
      if (error) throw error;
      localStorage.removeItem(`${STORAGE_KEYS.STATE}${userId}`);
      return true;
    } catch (error) {
      console.error("Failed to clear state:", error);
      return false;
    }
  }
  /**
   * Add item to recent items
   * @param userId User ID
   * @param platform Current platform
   * @param itemId Item ID to add
   * @param maxItems Maximum number of items to keep (default: 10)
   * @returns Success status
   */
  static async addRecentItem(userId, platform, itemId, maxItems = 10) {
    try {
      const state = await this.getPlatformState(userId);
      const recentItems = [...state.recentItems[platform] || []];
      const existingIndex = recentItems.indexOf(itemId);
      if (existingIndex > -1) {
        recentItems.splice(existingIndex, 1);
      }
      recentItems.unshift(itemId);
      const limitedItems = recentItems.slice(0, maxItems);
      return this.savePlatformState(userId, platform, {
        recentItems: limitedItems
      });
    } catch (error) {
      console.error("Failed to add recent item:", error);
      return false;
    }
  }
};
StateSyncService.supabase = (0, import_supabase_js3.createClient)(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);
var state_sync_default = StateSyncService;

// src/index.tsx
var import_react = __toESM(require("react"));
var PlatformBridgeContext = (0, import_react.createContext)(
  void 0
);
var detectCurrentPlatform = () => {
  if (typeof window === "undefined") return "hub";
  const hostname = window.location.hostname;
  if (hostname.includes("immortals")) return "immortals";
  if (hostname.includes("ascenders")) return "ascenders";
  if (hostname.includes("neothinkers")) return "neothinkers";
  return "hub";
};
var PlatformBridgeProvider = ({
  children,
  userId,
  initialPlatform
}) => {
  const detectedPlatform = initialPlatform || detectCurrentPlatform();
  const [currentPlatform, setCurrentPlatform] = (0, import_react.useState)(detectedPlatform);
  const [preferences, setPreferences] = (0, import_react.useState)({});
  const [platformState, setPlatformState] = (0, import_react.useState)({});
  const [unreadNotificationCount, setUnreadNotificationCount] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    if (!userId) return;
    const loadPreferences = async () => {
      const prefs = await preferences_default.getUserPreferences(userId, currentPlatform);
      setPreferences(prefs);
    };
    const loadState = async () => {
      const state = await state_sync_default.getInitialPlatformState(userId, currentPlatform);
      setPlatformState(state);
    };
    const loadNotificationCount = async () => {
      const count = await notifications_default.getUnreadCount(userId, [currentPlatform]);
      setUnreadNotificationCount(count);
    };
    loadPreferences();
    loadState();
    loadNotificationCount();
    let notificationSubscriptionId = null;
    if (userId) {
      notificationSubscriptionId = notifications_default.subscribeToNotifications(
        userId,
        [currentPlatform],
        (_notification) => {
          loadNotificationCount();
        }
      );
    }
    return () => {
      if (notificationSubscriptionId) {
        notifications_default.unsubscribeFromNotifications(notificationSubscriptionId);
      }
    };
  }, [userId, currentPlatform]);
  const navigateToPlatform = (platform, path) => {
    if (platform === currentPlatform) return;
    if (userId) {
      state_sync_default.savePlatformState(userId, currentPlatform, platformState);
    }
    const url = navigation_default.navigateWithStatePreservation(platform, path);
    window.location.href = url;
  };
  const savePreferences = async (newPreferences) => {
    if (!userId) return false;
    const mergedPreferences = __spreadValues(__spreadValues({}, preferences), newPreferences);
    setPreferences(mergedPreferences);
    return preferences_default.saveUserPreferences(
      userId,
      currentPlatform,
      mergedPreferences
    );
  };
  const saveState = async (newState) => {
    if (!userId) return false;
    const mergedState = __spreadValues(__spreadValues({}, platformState), newState);
    setPlatformState(mergedState);
    return state_sync_default.savePlatformState(
      userId,
      currentPlatform,
      mergedState
    );
  };
  const transferStateToOtherPlatform = async (targetPlatform) => {
    if (!userId) return false;
    await saveState(platformState);
    return state_sync_default.transferState(
      userId,
      currentPlatform,
      targetPlatform
    );
  };
  const value = {
    currentPlatform,
    navigateToPlatform,
    preferences,
    savePreferences,
    unreadNotificationCount,
    state: platformState,
    saveState,
    transferStateToOtherPlatform
  };
  return /* @__PURE__ */ import_react.default.createElement(PlatformBridgeContext.Provider, { value }, children);
};
var usePlatformBridge = () => {
  const context = (0, import_react.useContext)(PlatformBridgeContext);
  if (context === void 0) {
    throw new Error("usePlatformBridge must be used within a PlatformBridgeProvider");
  }
  return context;
};
var PlatformSwitcher = () => {
  const { currentPlatform, navigateToPlatform } = usePlatformBridge();
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "platform-switcher" }, /* @__PURE__ */ import_react.default.createElement(
    "select",
    {
      value: currentPlatform,
      onChange: (e) => navigateToPlatform(e.target.value),
      className: "platform-selector"
    },
    /* @__PURE__ */ import_react.default.createElement("option", { value: "hub" }, "Hub"),
    /* @__PURE__ */ import_react.default.createElement("option", { value: "immortals" }, "Immortals"),
    /* @__PURE__ */ import_react.default.createElement("option", { value: "ascenders" }, "Ascenders"),
    /* @__PURE__ */ import_react.default.createElement("option", { value: "neothinkers" }, "Neothinkers")
  ));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NavigationService,
  NotificationService,
  PLATFORM_COLORS,
  PLATFORM_ICONS,
  PLATFORM_NAMES,
  PLATFORM_URLS,
  PlatformBridgeProvider,
  PlatformSwitcher,
  PreferencesService,
  StateSyncService,
  usePlatformBridge
});
