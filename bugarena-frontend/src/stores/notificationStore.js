import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (list) =>
    set({
      notifications: list,
      unreadCount: list.filter((n) => !n.isRead).length,
    }),

  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  incrementUnread: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
}))

export default useNotificationStore
