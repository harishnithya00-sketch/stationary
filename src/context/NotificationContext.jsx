import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      type: "warning",
      title: "Low Stock Alert: Lab Records",
      message: "Hardbound Laboratory Records have dropped below minimum safety threshold (85 remaining).",
      time: "10 mins ago",
      read: false,
      forRole: "admin"
    },
    {
      id: "notif-2",
      type: "info",
      title: "AI Forecast Generated",
      message: "Semester 6 student demand projections are now updated with 94.2% model confidence.",
      time: "1 hour ago",
      read: false,
      forRole: "both"
    },
    {
      id: "notif-3",
      type: "success",
      title: "New Semester Catalog Available",
      message: "Engineering graphics kits and Casio calculators are back in full stock at subsidized student rates.",
      time: "3 hours ago",
      read: true,
      forRole: "student"
    },
    {
      id: "notif-4",
      type: "warning",
      title: "⚠ Unusual Consumption Pattern",
      message: "AI detected an above-average A4 sheet purchase spike for student 22CS116 (Devansh Kulkarni).",
      time: "Yesterday",
      read: false,
      forRole: "admin"
    }
  ]);

  const addToast = (type, title, message, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      time: "Just now",
      read: false,
      forRole: notif.forRole || "both",
      ...notif
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        notifications,
        addToast,
        removeToast,
        addNotification,
        markAllAsRead,
        markAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
