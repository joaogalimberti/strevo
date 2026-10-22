import React from 'react';
import { useStore } from '../store/useStore';
import {
  ChevronLeft, ShieldCheck, Flame, Trophy, Activity, LogOut, Check
} from 'lucide-react';
import './ProfileScreen.css';

const DOSSIER_BADGES = [
  { id: '1', title: 'Consistency Protocol', desc: 'Active 7+ continuous cycle days', earned: true },
  { id: '2', title: 'Volume Mastery', desc: 'Over 10 verified training logs', earned: true },
  { id: '3', title: 'High Exertion', desc: 'Target strain threshold surpassed', earned: true },
  { id: '4', title: 'Century Milestone', desc: '100 Completed Sessions', earned: false },
];

export default function ProfileScreen() {
  const { user, setUser, streak, bestStreak, workouts, setView } = useStore();

  const totalSessions = workouts.length;
  const totalHours = Math.round(workouts.reduce((acc, w) => acc + w.duration, 0) / 3600);
  const totalKcal = workouts.reduce((acc, w) => acc + (w.calories || 380), 0);

  return (
    <div className="profile-screen scroll-content">
      {/* Header */}
      <div className="profile-nav anim-fade-up">
        <button className="icon-btn" onClick={() => setView('home')} title="Back">
          <ChevronLeft size={20} />
        </button>
        <span className="profile-nav-title">Athlete Dossier</span>
        <div style={{ width: 40 }} />
      </div>

      {/* User Hero */}
      <div className="profile-dossier-hero anim-fade-up" style={{ animationDelay: '0.04s' }}>
        <div className="dossier-monogram">
          <span>{user?.username?.charAt(0).toUpperCase() || 'A'}</span>
        </div>
        <h2 className="dossier-name">@{user?.username || 'athlete'}</h2>
        <span className="dossier-status">
          <ShieldCheck size={13} color="var(--accent-champagne)" />
          <span>PRO ATHLETE TIER</span>
        </span>
      </div>

      {/* Primary Metrics Grid */}
      <div className="dossier-grid anim-fade-up" style={{ animationDelay: '0.08s' }}>
        <div className="dossier-metric-card card">
          <div className="dossier-metric-header">
            <Flame size={14} color="var(--accent-ember)" />
            <span>CURRENT STREAK</span>
          </div>
          <span className="dossier-number">{streak} <small>DAYS</small></span>
        </div>

        <div className="dossier-metric-card card">
          <div className="dossier-metric-header">
            <Trophy size={14} color="var(--accent-champagne)" />
            <span>ALL-TIME BEST</span>
          </div>
          <span className="dossier-number">{bestStreak} <small>DAYS</small></span>
        </div>

        <div className="dossier-metric-card card">
          <div className="dossier-metric-header">
            <Activity size={14} color="var(--text-secondary)" />
            <span>TOTAL TIME</span>
          </div>
          <span className="dossier-number">{totalHours} <small>HOURS</small></span>
        </div>

        <div className="dossier-metric-card card">
          <div className="dossier-metric-header">
            <ShieldCheck size={14} color="var(--text-secondary)" />
            <span>SESSIONS</span>
          </div>
          <span className="dossier-number">{totalSessions} <small>LOGS</small></span>
        </div>
      </div>

      {/* Protocol Milestones / Badges */}
      <div className="dossier-section anim-fade-up" style={{ animationDelay: '0.12s' }}>
        <div className="section-label">Verified Protocols</div>
        <div className="dossier-badge-list">
          {DOSSIER_BADGES.map((b) => (
            <div key={b.id} className={`dossier-badge-item card ${b.earned ? 'earned' : 'locked'}`}>
              <div className="badge-bullet">
                {b.earned ? <Check size={12} strokeWidth={3} /> : '•'}
              </div>
              <div className="badge-content">
                <span className="badge-title">{b.title}</span>
                <span className="badge-desc">{b.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Exit */}
      <div className="dossier-actions anim-fade-up" style={{ animationDelay: '0.16s' }}>
        <button
          className="btn-secondary"
          onClick={() => setUser(null)}
          id="btn-sign-out"
        >
          <LogOut size={16} />
          <span>Exit Session</span>
        </button>
        <span className="dossier-version">STREVO Protocol v2.4 • Clean Architecture</span>
      </div>
    </div>
  );
}
