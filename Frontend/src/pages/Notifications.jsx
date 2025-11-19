import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { notificationAPI } from '../services/api';

const typeLabels = {
  deadline: 'Deadline',
  assignment: 'Assignment',
  status_change: 'Status Update',
  team_invite: 'Team Invite',
  overdue: 'Overdue'
};

const typeBadges = {
  deadline: 'bg-amber-100 text-amber-700',
  assignment: 'bg-blue-100 text-blue-700',
  status_change: 'bg-emerald-100 text-emerald-700',
  team_invite: 'bg-violet-100 text-violet-700',
  overdue: 'bg-rose-100 text-rose-700'
};

const getActorInitial = (actor) => {
  if (!actor?.name) return 'A';
  return actor.name.trim().charAt(0).toUpperCase();
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const navigate = useNavigate();

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await notificationAPI.getAll({ limit: 100 });
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Failed to load notifications', error);
      toast.error('Unable to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read', error);
      toast.error('Could not mark as read');
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markNotificationAsRead(notification._id);
    }

    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read', error);
      toast.error('Unable to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      );
    }

    if (!notifications.length) {
      return (
        <div className="text-center py-20">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
            <Bell size={28} />
          </div>
          <p className="text-lg font-semibold text-gray-900">No notifications yet</p>
          <p className="text-sm text-gray-500 mt-1">You're all caught up! New updates will appear here.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {notifications.map((notification) => (
          <button
            key={notification._id}
            onClick={() => handleNotificationClick(notification)}
            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
              notification.read
                ? 'border-gray-100 bg-white hover:border-gray-200'
                : 'border-primary-100 bg-primary-50/60 hover:border-primary-200'
            }`}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-lg">
                {getActorInitial(notification.actor)}
              </div>
              {!notification.read && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
                <span>
                  {notification.actor?.name || 'System'}
                </span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] ${typeBadges[notification.type] || 'bg-gray-100 text-gray-600'}`}
                >
                  {typeLabels[notification.type] || 'Update'}
                </span>
              </div>
              <p className="text-sm text-gray-900 mt-1 line-clamp-2">{notification.message}</p>
              {notification.task?.title && (
                <p className="text-xs text-gray-500 mt-1">Task: {notification.task.title}</p>
              )}
            </div>
            {!notification.read && (
              <div className="flex items-center">
                <Check className="text-emerald-500" size={18} />
              </div>
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500">Notifications</p>
            <h1 className="text-2xl font-semibold text-gray-900">Stay on top of your work</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-primary-600 mt-1">{unreadCount} unread</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchNotifications}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={markingAll || unreadCount === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60"
            >
              <Check size={16} />
              Mark all as read
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm min-h-[320px]">
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
