import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/authContext';

function getInitial(name) {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
  }
  return name[0].toUpperCase();
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initial = getInitial(user?.name ?? '');

  return (
    <div className="layout">
      <header className="header">
        <Link to="/dashboard" className="logo">
          Task Manager
        </Link>
        <div className="header-actions" ref={profileRef}>
          <button
            type="button"
            className="profile-trigger"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <span className="profile-avatar" title={user?.name}>
              {initial}
            </span>
            <span className="profile-name">{user?.name}</span>
            <span className="profile-chevron" aria-hidden>▼</span>
          </button>
          {profileOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <span className="profile-avatar profile-avatar-lg">{initial}</span>
                <div>
                  <div className="profile-dropdown-name">{user?.name}</div>
                  <div className="profile-dropdown-email">{user?.email}</div>
                </div>
              </div>
              <div className="profile-dropdown-actions">
                <Link
                  to="/"
                  className="profile-dropdown-item"
                  onClick={() => setProfileOpen(false)}
                >
                  Home
                </Link>
                <button
                  type="button"
                  className="profile-dropdown-item profile-dropdown-logout"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
