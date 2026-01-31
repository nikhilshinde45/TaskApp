import { useState } from 'react';
import TaskForm from './TaskForm';

function formatDue(task) {
  if (!task.dueDate && !task.dueTime) return null;
  const parts = [];
  if (task.dueDate) {
    const d = new Date(task.dueDate);
    parts.push(d.toLocaleDateString(undefined, { dateStyle: 'medium' }));
  }
  if (task.dueTime) {
    const [h, m] = (task.dueTime + '').split(':');
    const hour = parseInt(h, 10);
    if (!isNaN(hour)) {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const h12 = hour % 12 || 12;
      parts.push(`${h12}:${(m || '00').slice(0, 2)} ${ampm}`);
    }
  }
  return parts.length ? parts.join(' at ') : null;
}

function getTimelineClass(task) {
  if (!task.dueDate) return 'timeline-none';
  const due = new Date(task.dueDate);
  if (task.dueTime) {
    const [h, m] = (task.dueTime || '00:00').split(':');
    due.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
  }
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  if (due < now) return 'timeline-overdue';
  if (dueDay.getTime() === today.getTime()) return 'timeline-today';
  return 'timeline-upcoming';
}

function getDateKey(task) {
  if (!task.dueDate) return 'no-date';
  const d = new Date(task.dueDate);
  return d.toISOString().slice(0, 10);
}

function groupByDate(tasks) {
  const groups = {};
  tasks.forEach((task) => {
    const key = getDateKey(task);
    if (!groups[key]) groups[key] = [];
    groups[key].push(task);
  });
  const keys = Object.keys(groups).sort((a, b) => {
    if (a === 'no-date') return 1;
    if (b === 'no-date') return -1;
    return a.localeCompare(b);
  });
  return keys.map((key) => ({ key, tasks: groups[key] }));
}

function renderTask(task, editingId, setEditingId, handleUpdate, onDelete) {
  return (
    <li key={task._id} className={`task-card ${getTimelineClass(task)}`}>
          {editingId === task._id ? (
            <TaskForm
              task={task}
              onSubmit={(body) => handleUpdate(task._id, body)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-meta">
                  <span className={`task-status status-${task.status.replace(' ', '-').toLowerCase()}`}>
                    {task.status}
                  </span>
                  {formatDue(task) && (
                    <span className={`task-due ${getTimelineClass(task)}`}>
                      {formatDue(task)}
                    </span>
                  )}
                </div>
              </div>
              <div className="task-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => setEditingId(task._id)}
                  title="Edit"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(task._id)}
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
  );
}

export default function TaskList({ tasks, onUpdate, onDelete, viewMode = 'list' }) {
  const [editingId, setEditingId] = useState(null);

  const handleUpdate = async (id, body) => {
    await onUpdate(id, body);
    setEditingId(null);
  };

  if (!tasks?.length) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Create one to get started.</p>
      </div>
    );
  }

  if (viewMode === 'timeline') {
    const groups = groupByDate(tasks);
    return (
      <div className="timeline-view">
        {groups.map(({ key, tasks: groupTasks }) => (
          <div key={key} className="timeline-group">
            <h3 className="timeline-date-header">
              {key === 'no-date'
                ? 'No due date'
                : new Date(key).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
            </h3>
            <ul className="task-list">
              {groupTasks.map((task) =>
                renderTask(task, editingId, setEditingId, handleUpdate, onDelete)
              )}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) =>
        renderTask(task, editingId, setEditingId, handleUpdate, onDelete)
      )}
    </ul>
  );
}
