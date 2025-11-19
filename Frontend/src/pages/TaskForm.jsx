import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { taskAPI, teamAPI } from '../services/api';
import Layout from '../components/Layout';
import { Save, ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    team: '',
    assignee: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    tags: ''
  });

  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTeams();
    if (isEdit) {
      fetchTask();
    }
  }, [id]);

  useEffect(() => {
    if (formData.team) {
      fetchTeamMembers(formData.team);
    }
  }, [formData.team]);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data.teams);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      toast.error('Failed to load teams');
    }
  };

  const fetchTask = async () => {
    try {
      const response = await taskAPI.getById(id);
      const task = response.data.task;
      setFormData({
        title: task.title,
        description: task.description || '',
        team: task.team._id,
        assignee: task.assignee?._id || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags?.join(', ') || ''
      });
    } catch (error) {
      console.error('Failed to fetch task:', error);
      toast.error('Failed to load task');
      navigate('/dashboard');
    }
  };

  const fetchTeamMembers = async (teamId) => {
    try {
      const response = await teamAPI.getById(teamId);
      setTeamMembers(response.data.team.members);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const taskData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (isEdit) {
        await taskAPI.update(id, taskData);
        toast.success('Task updated successfully');
      } else {
        await taskAPI.create(taskData);
        toast.success('Task created successfully');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save task:', error);
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setDeleting(true);
    try {
      await taskAPI.delete(id);
      toast.success('Task deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 py-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {isEdit ? 'Update Task' : 'New Task Intake'}
              </p>
              <h1 className="text-3xl font-semibold text-gray-900">
                {isEdit ? formData.title || 'Untitled Task' : 'Create a Task Brief'}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Align scope, ownership, and timelines so your team can ship with confidence.
              </p>
            </div>
          </div>
          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
            >
              {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              <span>Delete task</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 space-y-6">
              <div className="card space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">Task title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input mt-2"
                    placeholder="eg. Launch billing experiments for Q4"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Narrative & requirements</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input mt-2 min-h-[160px]"
                    placeholder="Share the problem context, definition of done, blockers, and linked specs."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="card space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Team *</label>
                    <select
                      value={formData.team}
                      onChange={(e) => setFormData({ ...formData, team: e.target.value, assignee: '' })}
                      className="input mt-2"
                      required
                    >
                      <option value="">Select delivery team</option>
                      {teams.map((team) => (
                        <option key={team._id} value={team._id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Assignee</label>
                    <select
                      value={formData.assignee}
                      onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                      className="input mt-2"
                      disabled={!formData.team}
                    >
                      <option value="">Unassigned</option>
                      {teamMembers.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name} ({member.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="card space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="input mt-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="input mt-2"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="card space-y-2">
                  <label className="text-sm font-medium text-gray-700">Due date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="input"
                  />
                  <p className="text-xs text-gray-500">Used to surface the task in timeline & reminders.</p>
                </div>
                <div className="card space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="input"
                    placeholder="frontend, billing, hotfix"
                  />
                  <p className="text-xs text-gray-500">Comma separate multiple tags for reporting.</p>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="card space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Checklist</p>
                  <p className="text-xs text-gray-500">Ensure the brief is actionable before publishing.</p>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li>• Add context and links to specs</li>
                  <li>• Confirm owner & stakeholders</li>
                  <li>• Attach timelines and SLA expectations</li>
                </ul>
              </div>

              <div className="card bg-gray-50 space-y-3">
                <p className="text-sm font-semibold text-gray-800">Need to upload briefs?</p>
                <p className="text-sm text-gray-600">Attach PDFs, Loom links, or PRDs after creating the task from the workspace view.</p>
              </div>
            </aside>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-500">
              {isEdit ? 'Last updated moments ago · changes auto-tracked' : 'Draft tasks stay in pending until scheduled'}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary inline-flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{isEdit ? 'Update task' : 'Create task'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default TaskForm;
