"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuthForm: () => AuthForm,
  ErrorPage: () => ErrorPage,
  ForgotPasswordForm: () => ForgotPasswordForm,
  SecurityDashboard: () => SecurityDashboard,
  SecurityEventTypes: () => SecurityEventTypes,
  SecurityProvider: () => SecurityProvider,
  SignInForm: () => SignInForm,
  SignUpForm: () => SignUpForm,
  UpdatePasswordForm: () => UpdatePasswordForm,
  applyRateLimit: () => applyRateLimit,
  cleanupRateLimits: () => cleanupRateLimits,
  clearTestSecurityLogs: () => clearTestSecurityLogs,
  createClient: () => import_database6.createClient,
  createPlatformClient: () => createPlatformClient6,
  generateTestSecurityLogs: () => generateTestSecurityLogs,
  getPlatformFromHost: () => getPlatformFromHost,
  getRateLimitRecords: () => getRateLimitRecords,
  getRecentSecurityLogs: () => getRecentSecurityLogs,
  logSecurityEvent: () => logSecurityEvent2,
  middleware: () => middleware,
  useSecurityProvider: () => useSecurityProvider,
  withCsrfProtection: () => withCsrfProtection
});
module.exports = __toCommonJS(index_exports);

// src/utils/middleware.ts
var import_database2 = require("@neothink/database");
var import_crypto = __toESM(require("crypto"));

// src/utils/security-logger.ts
var logSecurityEvent = async (supabaseAdmin, event) => {
  try {
    const { error } = await supabaseAdmin.from("security_events").insert(event);
    if (error) {
      console.error("Error logging security event:", error);
    }
  } catch (error) {
    console.error("Error logging security event:", error);
  }
};

// src/utils/securityLogging.ts
var SecurityEventTypes = {
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAILURE: "login_failure",
  RATE_LIMIT_EXCEEDED: "rate_limit_exceeded",
  SUSPICIOUS_ACTIVITY: "suspicious_activity",
  ACCESS_DENIED: "access_denied",
  CSRF_VALIDATION_FAILURE: "csrf_validation_failure",
  SQL_INJECTION_ATTEMPT: "sql_injection_attempt",
  XSS_ATTEMPT: "xss_attempt",
  PATH_TRAVERSAL_ATTEMPT: "path_traversal_attempt",
  ADMIN_ACTION: "admin_action",
  PASSWORD_CHANGE: "password_change",
  ACCOUNT_LOCKOUT: "account_lockout",
  ACCOUNT_RECOVERY: "account_recovery",
  SESSION_HIJACKING_ATTEMPT: "session_hijacking_attempt",
  INVALID_AUTH_ATTEMPT: "invalid_auth_attempt",
  CSRF_TOKEN_INVALID: "csrf_token_invalid",
  SUSPICIOUS_IP_DETECTED: "suspicious_ip_detected",
  CSRF_TOKEN_MISMATCH: "csrf_token_mismatch",
  CSRF_TOKEN_EXPIRED: "csrf_token_expired",
  CSRF_TOKEN_USER_AGENT_MISMATCH: "csrf_token_user_agent_mismatch"
};
async function logSecurityEvent2(supabase, event) {
  try {
    const { error } = await supabase.from("security_events").insert({
      ...event,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (error) {
      console.error("Failed to log security event:", error);
      return false;
    }
    if (event.severity === "critical") {
      console.error("CRITICAL SECURITY EVENT:", event);
    }
    return true;
  } catch (error) {
    console.error("Error logging security event:", error);
    return false;
  }
}

// src/utils/csrf.ts
var import_database = require("@neothink/database");
var DEFAULT_CONFIG = {
  tokenTtlHours: 24,
  headerName: "X-CSRF-Token",
  cookieName: "csrf-token",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    domain: process.env.COOKIE_DOMAIN
  }
};
async function validateCsrfToken(request) {
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    return true;
  }
  const token = request.headers.get("x-csrf-token");
  if (!token) {
    return false;
  }
  const supabase = (0, import_database.createPlatformClient)("hub");
  const now = Math.floor(Date.now() / 1e3);
  await supabase.from("csrf_tokens").delete().lt("expires_at", now);
  const { data: tokenData } = await supabase.from("csrf_tokens").select("token").eq("token", token).gte("expires_at", now).single();
  return !!tokenData;
}

// src/utils/middleware.ts
var rateLimitConfig = {
  default: { limit: 100, window: 60 },
  // 100 requests per minute
  auth: { limit: 10, window: 60 },
  // 10 auth requests per minute
  api: { limit: 50, window: 60 },
  // 50 API requests per minute
  admin: { limit: 30, window: 60 }
  // 30 admin requests per minute
};
function getPlatformFromHost(host) {
  if (!host) return null;
  const subdomain = host.split(".")[0];
  if (["hub", "ascenders", "immortals", "neothinkers"].includes(subdomain)) {
    return subdomain;
  }
  return null;
}
function isSuspiciousRequest(req) {
  const path = req.nextUrl.pathname;
  const query = req.nextUrl.search;
  const sqlInjectionPatterns = [
    /union\s+select/i,
    /or\s+1=1/i,
    /';\s*--/i,
    /'\s*or\s*'1'='1/i
  ];
  const xssPatterns = [
    /<script\b[^>]*>/i,
    /javascript:/i,
    /on\w+\s*=/i
  ];
  const pathTraversalPatterns = [
    /\.\.\//,
    /\.\.\\/,
    /%2e%2e\//i
  ];
  const testString = `${path}${query}`;
  return [
    ...sqlInjectionPatterns,
    ...xssPatterns,
    ...pathTraversalPatterns
  ].some((pattern) => pattern.test(testString));
}
async function checkRateLimit(req, platformSlug) {
  const supabase = (0, import_database2.createPlatformClient)(platformSlug);
  const path = req.nextUrl.pathname;
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  let config = rateLimitConfig.default;
  if (path.startsWith("/api/auth")) {
    config = rateLimitConfig.auth;
  } else if (path.startsWith("/api/admin")) {
    config = rateLimitConfig.admin;
  } else if (path.startsWith("/api/")) {
    config = rateLimitConfig.api;
  }
  const identifier = `${platformSlug}:${clientIp}:${path}`;
  const windowStart = new Date(Date.now() - config.window * 1e3).toISOString();
  const { data: requests } = await supabase.from("rate_limits").select("count").eq("identifier", identifier).gte("window_start", windowStart).single();
  return requests ? requests.count >= config.limit : false;
}
function setSecurityHeaders(req, res) {
  const nonce = import_crypto.default.randomBytes(16).toString("base64");
  const headers = new Headers(res.headers);
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; object-src 'none';`
  );
  headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers
  });
}
async function middleware(req) {
  try {
    const platformSlug = getPlatformFromHost(req.headers.get("host"));
    if (!platformSlug) {
      return new Response("Not Found", { status: 404 });
    }
    const supabase = (0, import_database2.createPlatformClient)(platformSlug);
    const isRateLimited = await checkRateLimit(req, platformSlug);
    if (isRateLimited) {
      await logSecurityEvent(supabase, {
        event: "RATE_LIMIT_EXCEEDED",
        severity: "medium",
        platform_slug: platformSlug,
        user_id: void 0,
        ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
        request_path: req.nextUrl.pathname,
        request_method: req.method,
        request_headers: Object.fromEntries(req.headers),
        context: {},
        details: {},
        suspicious_activity: true
      });
      return new Response("Too Many Requests", { status: 429 });
    }
    if (isSuspiciousRequest(req)) {
      await logSecurityEvent(supabase, {
        event: "SUSPICIOUS_ACTIVITY",
        severity: "high",
        platform_slug: platformSlug,
        user_id: void 0,
        ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
        request_path: req.nextUrl.pathname,
        request_method: req.method,
        request_headers: Object.fromEntries(req.headers),
        context: {},
        details: { path: req.nextUrl.pathname, headers: Object.fromEntries(req.headers) },
        suspicious_activity: true
      });
      return new Response("Bad Request", { status: 400 });
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      const csrfResult = await validateCsrfToken(req);
      if (!csrfResult) {
        await logSecurityEvent(supabase, {
          event: "CSRF_FAILURE",
          severity: "high",
          platform_slug: platformSlug,
          user_id: void 0,
          ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
          request_path: req.nextUrl.pathname,
          request_method: req.method,
          request_headers: Object.fromEntries(req.headers),
          context: {},
          details: { message: "Invalid CSRF Token" },
          suspicious_activity: true
        });
        return new Response("Invalid CSRF Token", { status: 403 });
      }
    }
    const response = await fetch(req);
    return setSecurityHeaders(req, response);
  } catch (error) {
    console.error("Middleware error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// src/utils/rateLimit.ts
var DEFAULT_RATE_LIMIT = {
  windowMs: 60 * 1e3,
  // 1 minute
  maxRequests: 60
  // 60 requests per minute
};
var AUTH_RATE_LIMIT = {
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  maxRequests: 5
  // 5 attempts per 15 minutes
};
async function logRateLimitViolation(supabase, req, details) {
  const securityEvent = {
    event: "rate_limit_exceeded",
    severity: "medium",
    platform_slug: req.headers.get("host") || "unknown",
    ip_address: req.headers.get("x-forwarded-for") || "unknown",
    request_path: req.nextUrl.pathname,
    request_method: req.method,
    request_headers: Object.fromEntries(req.headers),
    context: {
      path: req.nextUrl.pathname,
      method: req.method,
      ip: req.headers.get("x-forwarded-for") || "unknown"
    },
    details,
    suspicious_activity: true
  };
  await supabase.from("security_events").insert(securityEvent);
}
async function applyRateLimit(req, supabase, config) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const key = `rate_limit:${ip}:${req.nextUrl.pathname}`;
  const { data: rateData } = await supabase.from("rate_limits").select("count, last_request").eq("key", key).single();
  const now = /* @__PURE__ */ new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);
  if (rateData) {
    const lastRequest = new Date(rateData.last_request);
    if (lastRequest < windowStart) {
      await supabase.from("rate_limits").update({ count: 1, last_request: now.toISOString() }).eq("key", key);
      return null;
    }
    if (rateData.count >= config.maxRequests) {
      await logRateLimitViolation(supabase, req, {
        ip,
        count: rateData.count,
        window_ms: config.windowMs,
        max_requests: config.maxRequests
      });
      return new Response(
        JSON.stringify({
          error: config.message || "Too many requests"
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil((config.windowMs - (now.getTime() - lastRequest.getTime())) / 1e3).toString()
          }
        }
      );
    }
    await supabase.from("rate_limits").update({
      count: rateData.count + 1,
      last_request: now.toISOString()
    }).eq("key", key);
  } else {
    await supabase.from("rate_limits").insert({
      key,
      count: 1,
      last_request: now.toISOString()
    });
  }
  return null;
}
async function cleanupRateLimits(supabase) {
  const now = /* @__PURE__ */ new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
  const { error } = await supabase.from("rate_limits").delete().lt("window_start", oneDayAgo.toISOString());
  if (error) {
    console.error("Failed to clean up rate limit records:", error);
  }
}

// src/utils/securityTestingHelpers.ts
var import_database3 = require("@neothink/database");
async function getRecentSecurityLogs(platformSlug = "hub", limit = 100) {
  const supabase = (0, import_database3.createPlatformClient)(platformSlug);
  const { data, error } = await supabase.from("security_logs").select("*").order("created_at", { ascending: false }).limit(limit);
  if (error) {
    console.error("Failed to get security logs:", error);
    return [];
  }
  return data;
}
async function getRateLimitRecords(identifier, platformSlug = "hub") {
  const supabase = (0, import_database3.createPlatformClient)(platformSlug);
  const { data, error } = await supabase.from("rate_limits").select("*").eq("identifier", identifier).order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to get rate limit records:", error);
    return [];
  }
  return data;
}
async function generateTestSecurityLogs(count = 10, platformSlug = "hub") {
  if (process.env.NODE_ENV === "production") {
    console.error("Cannot generate test logs in production");
    return;
  }
  const supabase = (0, import_database3.createPlatformClient)(platformSlug);
  const severities = ["low", "medium", "high", "critical"];
  const events = [
    "login_attempt",
    "login_success",
    "login_failure",
    "password_reset",
    "suspicious_activity",
    "rate_limit_exceeded",
    "access_denied"
  ];
  const ips = [
    "192.168.1.1",
    "10.0.0.1",
    "172.16.0.1",
    "127.0.0.1"
  ];
  const logs = Array.from({ length: count }, () => ({
    event: events[Math.floor(Math.random() * events.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    platform_slug: platformSlug,
    ip_address: ips[Math.floor(Math.random() * ips.length)],
    user_agent: "Testing Agent",
    request_path: "/test/path",
    context: { test: true },
    details: { test: true }
  }));
  const { error } = await supabase.from("security_logs").insert(logs);
  if (error) {
    console.error("Failed to insert test logs:", error);
    return;
  }
  console.log(`Successfully inserted ${count} test security logs`);
}
async function clearTestSecurityLogs(platformSlug = "hub") {
  if (process.env.NODE_ENV === "production") {
    console.error("Cannot clear logs in production");
    return;
  }
  const supabase = (0, import_database3.createPlatformClient)(platformSlug);
  const { error } = await supabase.from("security_logs").delete().eq("context->test", "true");
  if (error) {
    console.error("Failed to clear test logs:", error);
    return;
  }
  console.log("Successfully cleared test security logs");
}

// src/components/SecurityDashboard.tsx
var import_react = require("react");
var import_database4 = require("@neothink/database");
var import_jsx_runtime = require("react/jsx-runtime");
function SecurityDashboard({ platformSlug, limit = 100 }) {
  const [logs, setLogs] = (0, import_react.useState)([]);
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [error, setError] = (0, import_react.useState)(null);
  const [filter, setFilter] = (0, import_react.useState)({});
  (0, import_react.useEffect)(() => {
    async function fetchLogs() {
      setLoading(true);
      setError(null);
      try {
        const supabase = (0, import_database4.createPlatformClient)(platformSlug);
        let query = supabase.from("security_logs").select("*").order("created_at", { ascending: false }).limit(limit);
        if (filter.severity) {
          query = query.eq("severity", filter.severity);
        }
        if (filter.event) {
          query = query.eq("event", filter.event);
        }
        if (filter.ip) {
          query = query.eq("ip_address", filter.ip);
        }
        const { data, error: error2 } = await query;
        if (error2) {
          throw error2;
        }
        setLogs(data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch security logs");
        console.error("Error fetching security logs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [platformSlug, limit, filter]);
  const eventTypes = [...new Set(logs.map((log) => log.event))];
  const ipAddresses = [...new Set(logs.map((log) => log.ip_address).filter(Boolean))];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-full p-4 bg-white rounded-lg shadow", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "text-2xl font-bold mb-4", children: "Security Dashboard" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mb-6 grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Severity" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "select",
          {
            className: "w-full p-2 border border-gray-300 rounded",
            value: filter.severity || "",
            onChange: (e) => setFilter((prev) => ({
              ...prev,
              severity: e.target.value || void 0
            })),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "All Severities" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "low", children: "Low" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "medium", children: "Medium" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "high", children: "High" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "critical", children: "Critical" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Event Type" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "select",
          {
            className: "w-full p-2 border border-gray-300 rounded",
            value: filter.event || "",
            onChange: (e) => setFilter((prev) => ({
              ...prev,
              event: e.target.value || void 0
            })),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "All Events" }),
              eventTypes.map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: type, children: type }, type))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "IP Address" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "select",
          {
            className: "w-full p-2 border border-gray-300 rounded",
            value: filter.ip || "",
            onChange: (e) => setFilter((prev) => ({
              ...prev,
              ip: e.target.value || void 0
            })),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "All IP Addresses" }),
              ipAddresses.map((ip) => ip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: ip, children: ip }, ip))
            ]
          }
        )
      ] })
    ] }),
    loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-center py-4", children: "Loading security logs..." }),
    error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-red-100 text-red-700 p-4 rounded mb-4", children: error }),
    !loading && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { className: "bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Time" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Event" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Severity" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "IP Address" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Path" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Details" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { colSpan: 6, className: "px-6 py-4 text-center text-sm text-gray-500", children: "No security logs found matching the current filters." }) }) : logs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(log.created_at).toLocaleString() }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: log.event }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${log.severity === "critical" ? "bg-red-100 text-red-800" : log.severity === "high" ? "bg-orange-100 text-orange-800" : log.severity === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`, children: log.severity }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: log.ip_address }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs", children: log.request_path }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              onClick: () => alert(JSON.stringify({ context: log.context, details: log.details }, null, 2)),
              className: "text-indigo-600 hover:text-indigo-900",
              children: "View Details"
            }
          ) })
        ] }, log.id)) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-4 text-sm text-gray-500", children: [
        "Showing ",
        logs.length,
        " of ",
        logs.length,
        " results"
      ] })
    ] })
  ] });
}

// src/hooks/useSecurityProvider.tsx
var import_react2 = require("react");
var import_database5 = require("@neothink/database");
var import_jsx_runtime2 = require("react/jsx-runtime");
var SecurityContext = (0, import_react2.createContext)(null);
function useSecurityProvider() {
  const context = (0, import_react2.useContext)(SecurityContext);
  if (!context) {
    throw new Error("useSecurityProvider must be used within a SecurityProvider");
  }
  return context;
}
function SecurityProvider({ platformSlug, children }) {
  const [csrfToken, setCsrfToken] = (0, import_react2.useState)("");
  const [isLoading, setIsLoading] = (0, import_react2.useState)(true);
  const [error, setError] = (0, import_react2.useState)(null);
  (0, import_react2.useEffect)(() => {
    async function initialize() {
      try {
        await refreshCsrfToken();
        setIsLoading(false);
      } catch (err) {
        setError(err.message || "Failed to initialize security provider");
        setIsLoading(false);
      }
    }
    initialize();
    const refreshTimer = setInterval(() => {
      refreshCsrfToken();
    }, 15 * 60 * 1e3);
    return () => clearInterval(refreshTimer);
  }, [platformSlug]);
  async function refreshCsrfToken() {
    try {
      const randomBytes = new Uint8Array(32);
      window.crypto.getRandomValues(randomBytes);
      const token = Array.from(randomBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
      setCsrfToken(token);
      sessionStorage.setItem("csrf-token", token);
      return token;
    } catch (err) {
      setError("Failed to generate CSRF token");
      throw err;
    }
  }
  async function logClientSideSecurityEvent(event, severity, details) {
    try {
      const supabase = (0, import_database5.createPlatformClient)(platformSlug);
      await logSecurityEvent2(supabase, {
        type: event,
        severity,
        userId: void 0,
        // Optionally set if available
        context: {
          url: window.location.href,
          referrer: document.referrer
        },
        details: details || {}
      });
    } catch (err) {
      console.error("Failed to log security event:", err);
    }
  }
  const value = {
    csrfToken,
    refreshCsrfToken,
    logSecurityEvent: logClientSideSecurityEvent,
    isLoading,
    error
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SecurityContext.Provider, { value, children });
}
function withCsrfProtection(Component) {
  const WithCsrfProtection = (props) => {
    const { csrfToken } = useSecurityProvider();
    (0, import_react2.useEffect)(() => {
      const originalFetch = window.fetch;
      window.fetch = async function(input, init) {
        if (init && ["POST", "PUT", "DELETE", "PATCH"].includes(init.method || "")) {
          const url = typeof input === "string" ? new URL(input, window.location.origin) : input instanceof Request ? new URL(input.url) : input;
          if (typeof input === "string" && input.startsWith("/") || url instanceof URL && url.origin === window.location.origin) {
            init = {
              ...init,
              headers: {
                ...init.headers,
                "X-CSRF-Token": csrfToken
              }
            };
          }
        }
        return originalFetch.call(window, input, init);
      };
      return () => {
        window.fetch = originalFetch;
      };
    }, [csrfToken]);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Component, { ...props });
  };
  return WithCsrfProtection;
}

// src/components/AuthForm.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function AuthForm({ onSubmit, loading, error, submitted, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("form", { onSubmit, className: "space-y-4", children: [
    error && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "text-red-600", children: error }),
    submitted && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "text-green-600", children: "Check your email for instructions." }),
    children
  ] });
}

// src/components/SignInForm.tsx
var import_react3 = require("react");

// src/lib/supabase/client.ts
var import_database6 = require("@neothink/database");
function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return { url, key };
}
function createPlatformClient6() {
  const { url, key } = getSupabaseEnv();
  return (0, import_database6.createClient)(url, key);
}

// src/components/SignInForm.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function SignInForm() {
  const [email, setEmail] = (0, import_react3.useState)("");
  const [password, setPassword] = (0, import_react3.useState)("");
  const [error, setError] = (0, import_react3.useState)(void 0);
  const [loading, setLoading] = (0, import_react3.useState)(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setError(void 0);
    setLoading(true);
    try {
      const supabase = createPlatformClient6();
      const { error: error2 } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error2) {
        setError(error2.message);
        return;
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(AuthForm, { onSubmit: handleSubmit, error, loading, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "input",
        {
          id: "email",
          type: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true,
          className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "input",
        {
          id: "password",
          type: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true,
          className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "button",
      {
        type: "submit",
        disabled: loading,
        className: "w-full bg-black text-white rounded-md py-2 px-4 hover:bg-gray-800 disabled:opacity-50",
        children: "Sign In"
      }
    )
  ] });
}

// src/components/SignUpForm.tsx
var import_react4 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
function SignUpForm() {
  const [email, setEmail] = (0, import_react4.useState)("");
  const [password, setPassword] = (0, import_react4.useState)("");
  const [error, setError] = (0, import_react4.useState)(void 0);
  const [loading, setLoading] = (0, import_react4.useState)(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setError(void 0);
    setLoading(true);
    try {
      const supabase = createPlatformClient6();
      const { error: error2 } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });
      if (error2) {
        setError(error2.message);
        return;
      }
      window.location.href = "/auth/signupconfirm";
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(AuthForm, { onSubmit: handleSubmit, error, loading, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "input",
        {
          id: "email",
          type: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true,
          className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "input",
        {
          id: "password",
          type: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true,
          minLength: 8,
          className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "button",
      {
        type: "submit",
        disabled: loading,
        className: "w-full bg-black text-white rounded-md py-2 px-4 hover:bg-gray-800 disabled:opacity-50",
        children: "Create Account"
      }
    )
  ] });
}

// src/components/ForgotPasswordForm.tsx
var import_react5 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
function ForgotPasswordForm() {
  const [email, setEmail] = (0, import_react5.useState)("");
  const [error, setError] = (0, import_react5.useState)(void 0);
  const [loading, setLoading] = (0, import_react5.useState)(false);
  const [submitted, setSubmitted] = (0, import_react5.useState)(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setError(void 0);
    setLoading(true);
    try {
      const supabase = createPlatformClient6();
      const { error: error2 } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update`
      });
      if (error2) {
        setError(error2.message);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }
  if (submitted) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Check your email" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "mt-2 text-sm text-gray-600", children: "We've sent you a password reset link. Please check your email." }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "mt-6", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("a", { href: "/auth/login", className: "text-black hover:text-gray-800", children: "Return to login" }) })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(AuthForm, { onSubmit: handleSubmit, error, loading, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email address" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "input",
        {
          id: "email",
          type: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true,
          className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "button",
      {
        type: "submit",
        disabled: loading,
        className: "w-full bg-black text-white rounded-md py-2 px-4 hover:bg-gray-800 disabled:opacity-50",
        children: "Reset Password"
      }
    )
  ] });
}

// src/components/UpdatePasswordForm.tsx
var import_react6 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
function UpdatePasswordForm() {
  const [password, setPassword] = (0, import_react6.useState)("");
  const [confirmPassword, setConfirmPassword] = (0, import_react6.useState)("");
  const [error, setError] = (0, import_react6.useState)(void 0);
  const [loading, setLoading] = (0, import_react6.useState)(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setError(void 0);
    setLoading(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const supabase = createPlatformClient6();
      const { error: error2 } = await supabase.auth.updateUser({
        password
      });
      if (error2) {
        setError(error2.message);
        return;
      }
      window.location.href = "/";
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(AuthForm, { onSubmit: handleSubmit, error, loading, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "New Password" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "input",
        {
          id: "password",
          type: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true,
          minLength: 8,
          className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700", children: "Confirm Password" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "input",
        {
          id: "confirmPassword",
          type: "password",
          value: confirmPassword,
          onChange: (e) => setConfirmPassword(e.target.value),
          required: true,
          minLength: 8,
          className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "button",
      {
        type: "submit",
        disabled: loading,
        className: "w-full bg-black text-white rounded-md py-2 px-4 hover:bg-gray-800 disabled:opacity-50",
        children: "Update Password"
      }
    )
  ] });
}

// src/components/ErrorPage.tsx
var import_navigation = require("next/navigation");
var import_jsx_runtime8 = require("react/jsx-runtime");
function ErrorPage() {
  const searchParams = (0, import_navigation.useSearchParams)();
  const error = searchParams.get("error") || "An error occurred";
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "max-w-md w-full space-y-8", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Authentication Error" }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "mt-2 text-center text-sm text-gray-600", children: error }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "mt-6 text-center", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "a",
      {
        href: "/auth/login",
        className: "text-black hover:text-gray-800",
        children: "Return to login"
      }
    ) })
  ] }) }) });
}

// src/index.ts
if (process.env.NODE_ENV !== "production") {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthForm,
  ErrorPage,
  ForgotPasswordForm,
  SecurityDashboard,
  SecurityEventTypes,
  SecurityProvider,
  SignInForm,
  SignUpForm,
  UpdatePasswordForm,
  applyRateLimit,
  cleanupRateLimits,
  clearTestSecurityLogs,
  createClient,
  createPlatformClient,
  generateTestSecurityLogs,
  getPlatformFromHost,
  getRateLimitRecords,
  getRecentSecurityLogs,
  logSecurityEvent,
  middleware,
  useSecurityProvider,
  withCsrfProtection
});
//# sourceMappingURL=index.js.map