export const BASE_URL = "http://localhost:8000";

// utils apiPaths.js
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // (Admin or Member)
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },
  USERS: {
    GET_ALL_USERS: "/api/users", // (Admin Only)
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`,
    CREATE_USER: "/api/users", // (Admin Only)
    UPDATE_USER: (userId) => `/api/users/${userId}`,
    DELETE_USER: (userId) => `/api/users/${userId}`,
  },
  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",
    GET_ALL_TASKS: "/api/tasks", // (Admin: all , User: assigned )
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,
    CREATE_TASK: "/api/tasks", // (Admin Only)
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`,
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // (Admin Only)

    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`,
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`,
  },
  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks",
    EXPORT_USERS: "/api/reports/export/users",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
  MESSAGES: {
    SEND_MESSAGE: "/api/messages",
    GET_TASK_MESSAGES: (taskId) => `/api/messages/${taskId}`,
    GET_UNREAD_COUNT: (taskId) => `/api/messages/${taskId}/unread-count`,
    DELETE_MESSAGE: (messageId) => `/api/messages/${messageId}`,
  },
  NOTIFICATIONS: {
    GET_ALL: "/api/notifications",
    GET_UNREAD_COUNT: "/api/notifications/unread-count",
    MARK_AS_READ: (notificationId) => `/api/notifications/${notificationId}/read`,
    MARK_ALL_READ: "/api/notifications/mark-all-read",
    DELETE: (notificationId) => `/api/notifications/${notificationId}`,
    CLEAR_READ: "/api/notifications/clear-read",
  },
  DISCUSSIONS: {
    CREATE: "/api/discussions",
    GET_ALL: "/api/discussions",
    GET_BY_ID: (discussionId) => `/api/discussions/${discussionId}`,
    DELETE: (discussionId) => `/api/discussions/${discussionId}`,
    ADD_REPLY: (discussionId) => `/api/discussions/${discussionId}/reply`,
    ADD_REACTION: (discussionId, replyId) => `/api/discussions/${discussionId}/reply/${replyId}/reaction`,
    MARK_ANSWER: (discussionId, replyId) => `/api/discussions/${discussionId}/reply/${replyId}/mark-answer`,
    UPDATE_STATUS: (discussionId) => `/api/discussions/${discussionId}/status`,
  },
};
