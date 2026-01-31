import { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // list | timeline

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const { tasks: data } = await taskAPI.getTasks(filter || undefined);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleCreate = async (body) => {
    await taskAPI.createTask(body);
    setShowForm(false);
    fetchTasks();
  };

  const handleUpdate = async (id, body) => {
    await taskAPI.updateTask(id, body);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await taskAPI.deleteTask(id);
    fetchTasks();
  };

  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Tasks</h1>
        <div className="dashboard-toolbar">
          <div className="filter-tabs">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value || 'all'}
                type="button"
                className={`filter-tab ${filter === opt.value ? 'active' : ''}`}
                onClick={() => setFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="dashboard-actions">
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="view-toggle">
              <button
                type="button"
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >
                List
              </button>
              <button
                type="button"
                className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
                onClick={() => setViewMode('timeline')}
                title="Timeline view"
              >
                Timeline
              </button>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-add"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ New Task'}
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card stat-pending">
          <span className="stat-value">{pendingCount}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card stat-progress">
          <span className="stat-value">{inProgressCount}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-card stat-completed">
          <span className="stat-value">{completedCount}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {showForm && (
        <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="loading-block">
          <div className="spinner" />
          <p>Loading tasks...</p>
        </div>
      ) : (
        <div className={viewMode === 'timeline' ? 'task-list-timeline' : ''}>
          <TaskList
            tasks={tasks}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            viewMode={viewMode}
          />
        </div>
      )}
    </div>
  );
}
