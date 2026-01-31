import { Link } from 'react-router-dom';
import { useAuth } from '../services/authContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <nav className="home-nav">
        <Link to="/" className="home-logo">
          Task Manager
        </Link>
        <div className="home-nav-actions">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <h1 className="hero-title">
          Organize your work.
          <br />
          <span className="hero-accent">Get things done.</span>
        </h1>
        <p className="hero-subtitle">
          Create tasks, set due dates, and track progress in one place. Simple, fast, and built for you.
        </p>
        {!user && (
          <div className="hero-cta">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Create free account
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign in
            </Link>
          </div>
        )}
        {user && (
          <div className="hero-cta">
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Open my tasks
            </Link>
          </div>
        )}
      </section>

      <section className="features">
        <h2 className="features-title">Why Task Manager?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">✓</span>
            <h3>Tasks & due dates</h3>
            <p>Add title, description, and set a date and time so you never miss a deadline.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">◐</span>
            <h3>Status & filtering</h3>
            <p>Mark tasks as Pending, In Progress, or Completed. Filter and find what you need.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Your data only</h3>
            <p>Secure login. Your tasks are private and only visible to you.</p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>Task Manager — MERN stack • Built for productivity</p>
      </footer>
    </div>
  );
}
