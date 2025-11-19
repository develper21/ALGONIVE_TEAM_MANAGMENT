import { useEffect, useMemo, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import {
  CalendarDays,
  Mail,
  Phone,
  MapPin,
  Shield,
  Award,
  Activity,
  Users,
  CheckCircle2,
  Clock3,
  ListChecks
} from 'lucide-react';

const actionCopy = {
  task_created: 'created a new task',
  status_changed: 'updated task status',
  assignment_changed: 'reassigned ownership',
  priority_changed: 'adjusted priority'
};

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0
  });
  const [activityFeed, setActivityFeed] = useState([]);

  const userId = user?._id || user?.id;
  const joinedAt = user?.createdAt ? format(new Date(user.createdAt), 'PPP') : '—';

  useEffect(() => {
    if (!userId) return;
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [tasksRes, activityRes] = await Promise.all([
        taskAPI.getAll({ assignee: userId }),
        taskAPI.getActivityFeed({ limit: 12 })
      ]);

      const myTasks = tasksRes.data.tasks || [];
      const statusCounts = myTasks.reduce(
        (acc, task) => {
          acc.total += 1;
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        },
        { total: 0, pending: 0, in_progress: 0, completed: 0 }
      );
      setTaskStats({
        total: statusCounts.total,
        pending: statusCounts.pending || 0,
        in_progress: statusCounts.in_progress || 0,
        completed: statusCounts.completed || 0
      });

      setActivityFeed(activityRes.data.activities || []);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const completionRate = useMemo(() => {
    if (taskStats.total === 0) return 0;
    return Math.round((taskStats.completed / taskStats.total) * 100);
  }, [taskStats]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl font-semibold">
                {user?.name?.[0] || 'U'}
              </div>
              <div>
                <p className="uppercase tracking-[0.4em] text-xs text-white/70 mb-2">Team Member</p>
                <h1 className="text-4xl font-semibold">{user?.name || 'Your Profile'}</h1>
                <p className="text-white/70">{user?.role === 'admin' ? 'Workspace Admin' : 'Project Contributor'}</p>
                <div className="flex flex-wrap gap-4 text-sm text-white/60 mt-4">
                  <span className="inline-flex items-center gap-2"><Mail size={16} /> {user?.email}</span>
                  <span className="inline-flex items-center gap-2"><CalendarDays size={16} /> Joined {joinedAt}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-white/60">Assigned tasks</p>
                <p className="text-3xl font-semibold mt-2">{taskStats.total}</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-white/60">Completion rate</p>
                <p className="text-3xl font-semibold mt-2">{completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-400">Professional snapshot</p>
                  <h2 className="text-2xl font-semibold mt-1">Role & responsibilities</h2>
                </div>
                <Shield className="text-primary-500" />
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <p className="text-xs uppercase text-gray-400">Role</p>
                  <p className="text-lg font-semibold capitalize">{user?.role}</p>
                  <p className="text-sm text-gray-500">Access to strategic dashboards</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">Teams</p>
                  <div className="space-y-2 mt-1">
                    {(user?.teams || []).length === 0 && <p className="text-sm text-gray-500">No teams assigned</p>}
                    {(user?.teams || []).map((team) => (
                      <div key={team._id} className="flex items-center gap-2 text-sm">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team.color || '#6366f1' }}></span>
                        {team.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">Recognition</p>
                  <p className="text-lg font-semibold">Top collaborator</p>
                  <p className="text-sm text-gray-500">Based on peer feedback</p>
                </div>
              </div>
            </section>

            <section className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-400">My delivery</p>
                  <h2 className="text-2xl font-semibold">Task performance</h2>
                </div>
                <Award className="text-primary-500" />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'In Progress', value: taskStats.in_progress, icon: Clock3, color: 'from-amber-500/10 to-amber-500/20 text-amber-600' },
                  { label: 'Completed', value: taskStats.completed, icon: CheckCircle2, color: 'from-green-500/10 to-green-500/20 text-green-600' },
                  { label: 'Pending', value: taskStats.pending, icon: ListChecks, color: 'from-blue-500/10 to-blue-500/20 text-blue-600' }
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className={`rounded-2xl p-4 bg-gradient-to-b ${color}`}>
                    <Icon size={20} className="mb-3" />
                    <p className="text-xs uppercase text-gray-500">{label}</p>
                    <p className="text-3xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-400">Activity</p>
                  <h2 className="text-2xl font-semibold">Recent impact</h2>
                </div>
                <Activity className="text-primary-500" />
              </div>
              <div className="space-y-4">
                {activityFeed.length === 0 && (
                  <p className="text-sm text-gray-500">No activity recorded for your teams yet.</p>
                )}
                {activityFeed.map((item) => (
                  <div key={item._id || item.id} className="flex gap-4 p-3 rounded-2xl border border-gray-100">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 font-semibold">
                      {item.actor?.name?.[0] || 'A'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900">
                          {item.actor?.name || 'Someone'} <span className="text-gray-400 font-normal">· {item.team?.name || 'Team'}</span>
                        </p>
                        <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {actionCopy[item.action] || 'made an update'} on <span className="font-medium">{item.task?.title || 'a task'}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-400">Contact & preferences</p>
                  <h2 className="text-2xl font-semibold">Reachability</h2>
                </div>
                <Users className="text-primary-500" />
              </div>
              <div className="mt-6 space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Work email</p>
                    <p>{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Direct line</p>
                    <p>+1 (555) 012-3456</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Working timezone</p>
                    <p>Asia/Kolkata (IST)</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-400">Operating Rhythm</p>
                  <h2 className="text-2xl font-semibold">Current focus</h2>
                </div>
                <CalendarDays className="text-primary-500" />
              </div>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="border border-gray-100 rounded-2xl p-4">
                  <p className="text-xs uppercase text-gray-400">Primary OKR</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">Improve cross-team delivery</p>
                  <p className="text-gray-500 mt-2">Partnering with product leads to streamline backlog visibility.</p>
                </div>
                <div className="border border-gray-100 rounded-2xl p-4">
                  <p className="text-xs uppercase text-gray-400">Availability</p>
                  <p className="text-gray-900 font-medium">Weekly syncs · Mon-Thu | 11:00 AM IST</p>
                  <p className="text-gray-500">Prefers async updates on Fridays for planning.</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {loading && (
          <div className="text-center text-sm text-gray-500">Refreshing your profile insights...</div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
