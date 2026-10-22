import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import './AuthScreen.css';

const DEMO_USER = {
  id: 'demo-1',
  username: 'athlete',
  email: 'demo@strevo.app',
  token: 'demo-token-123',
};

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('athlete@strevo.app');
  const [password, setPassword] = useState('passcode123');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setUser = useStore((s) => s.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 450));

    if (!email || !password) {
      setError('Please provide all credentials.');
      setLoading(false);
      return;
    }

    const name = isLogin ? email.split('@')[0] : username || email.split('@')[0];
    setUser({ ...DEMO_USER, username: name, email });
    setLoading(false);
  };

  return (
    <div className="auth-screen">
      <div className="auth-container">
        {/* Minimalist Wordmark Header */}
        <div className="auth-brand anim-fade-up">
          <span className="auth-monogram">STREVO</span>
          <p className="auth-sub">CONSISTENCY IS YOUR EDGE</p>
        </div>

        {/* Auth Glass Card */}
        <div className="auth-card card anim-fade-up" style={{ animationDelay: '0.06s' }}>
          <div className="auth-toggle-bar">
            <button
              className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
              id="tab-login"
            >
              Log In
            </button>
            <button
              className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
              id="tab-register"
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="input-group">
                <label className="input-label">ATHLETE HANDLE</label>
                <input
                  className="input"
                  placeholder="e.g. joao"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  id="input-username"
                />
              </div>
            )}
            <div className="input-group">
              <label className="input-label">EMAIL</label>
              <input
                className="input"
                type="email"
                placeholder="athlete@strevo.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="input-email"
              />
            </div>
            <div className="input-group">
              <label className="input-label">PASSCODE</label>
              <div className="pass-wrapper">
                <input
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="input-password"
                />
                <button
                  type="button"
                  className="pass-peek"
                  onClick={() => setShowPass(!showPass)}
                  id="btn-toggle-password"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <span className="auth-error-msg">{error}</span>}

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={loading}
              id="btn-auth-submit"
            >
              <span>{loading ? 'Authenticating...' : isLogin ? 'Access System' : 'Create Protocol'}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          <span className="auth-demo-tip">Pre-loaded demo mode • 1-Click Access</span>
        </div>

        {/* Editorial Footnote */}
        <div className="auth-manifesto anim-fade-up" style={{ animationDelay: '0.12s' }}>
          <span>DISCIPLINE OVER MOTIVATION</span>
        </div>
      </div>
    </div>
  );
}
