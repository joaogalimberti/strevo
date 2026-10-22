import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  Play, Flame, ChevronRight, ArrowUpRight, ShieldCheck, HeartPulse
} from 'lucide-react';
import './HomeScreen.css';

export default function HomeScreen() {
  const { user, workouts, streak, startWorkout, setView } = useStore();

  const today = new Date();
  const currentDayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const weeklyDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - currentDayOfWeek + i);
    const hasWorkedOut = workouts.some((w) => {
      const wDate = new Date(w.createdAt);
      return wDate.getDate() === d.getDate() && wDate.getMonth() === d.getMonth();
    });
    return { dayName: weekDays[i], hasWorkedOut, isToday: i === currentDayOfWeek };
  });

  const lastWorkout = workouts[0] || null;
  const totalThisWeek = weeklyDays.filter((d) => d.hasWorkedOut).length;
  
  // Consistency index calculation
  const consistencyScore = Math.min(100, Math.round((streak / 14) * 60 + (totalThisWeek / 7) * 40));

  return (
    <div className="home-screen scroll-content">
      {/* Editorial Header */}
      <header className="home-top-bar anim-fade-up">
        <div>
          <span className="home-date">
            {today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
          </span>
          <h1 className="home-title">Overview</h1>
        </div>
        <button
          className="athlete-badge-btn"
          onClick={() => setView('profile')}
          title="Profile"
        >
          <span className="athlete-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </span>
        </button>
      </header>

      {/* Main Luxury Metric: Consistency & Streak Gauge */}
      <section className="streak-hero-card card anim-fade-up" style={{ animationDelay: '0.04s' }}>
        <div className="streak-hero-top">
          <div>
            <span className="hero-micro-label">ACTIVE STREAK</span>
            <div className="streak-val-row">
              <span className="streak-big-num">{streak}</span>
              <span className="streak-unit">DAYS</span>
            </div>
          </div>
          <div className="hero-ember-badge">
            <Flame size={16} color="var(--accent-ember)" />
            <span>CONSISTENT</span>
          </div>
        </div>

        {/* Minimalist Gauge Bar */}
        <div className="hero-progress-section">
          <div className="progress-labels">
            <span>Consistency Index</span>
            <span className="score-val">{consistencyScore}%</span>
          </div>
          <div className="gauge-track">
            <div className="gauge-fill" style={{ width: `${consistencyScore}%` }} />
          </div>
        </div>

        {/* Weekly Micro Strip */}
        <div className="weekly-strip">
          {weeklyDays.map((d, i) => (
            <div key={i} className={`strip-day ${d.isToday ? 'is-today' : ''}`}>
              <span className="strip-label">{d.dayName}</span>
              <div className={`strip-dot ${d.hasWorkedOut ? 'active' : ''}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Primary Action Button */}
      <section className="anim-fade-up" style={{ animationDelay: '0.08s' }}>
        <button
          className="start-workout-trigger"
          onClick={startWorkout}
          id="btn-start-workout"
        >
          <div className="trigger-icon-box">
            <Play size={18} fill="#08080a" color="#08080a" />
          </div>
          <div className="trigger-text-block">
            <span className="trigger-heading">Begin Session</span>
            <span className="trigger-sub">Real-time telemetry & timer</span>
          </div>
          <ArrowUpRight size={18} className="trigger-arrow" />
        </button>
      </section>

      {/* Telemetry Grid (Heart / Volume / Recovery) */}
      <section className="telemetry-grid anim-fade-up" style={{ animationDelay: '0.12s' }}>
        <div className="telemetry-card card">
          <div className="telemetry-header">
            <HeartPulse size={16} color="var(--text-secondary)" />
            <span className="telemetry-tag">Weekly Sessions</span>
          </div>
          <span className="telemetry-number">{totalThisWeek}<small>/7</small></span>
          <span className="telemetry-caption">Target: 5 sessions</span>
        </div>

        <div className="telemetry-card card">
          <div className="telemetry-header">
            <ShieldCheck size={16} color="var(--text-secondary)" />
            <span className="telemetry-tag">Protocol Tier</span>
          </div>
          <span className="telemetry-number">Lv.{Math.max(1, Math.floor(workouts.length / 3) + 1)}</span>
          <span className="telemetry-caption">Master Disciplined</span>
        </div>
      </section>

      {/* Last Session Showcase */}
      {lastWorkout && (
        <section className="anim-fade-up" style={{ animationDelay: '0.16s' }}>
          <div className="section-label">Previous Activity</div>
          <div
            className="last-session-card card card-interactive"
            onClick={() => setView('calendar')}
            id="card-last-workout"
          >
            <div className="last-session-info">
              <span className="last-session-type">{lastWorkout.type}</span>
              <span className="last-session-date">
                {new Date(lastWorkout.createdAt).toLocaleDateString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric'
                })}
              </span>
            </div>

            <div className="last-session-stats">
              <div className="stat-pill">
                <span>{Math.floor(lastWorkout.duration / 60)} min</span>
              </div>
              <ChevronRight size={16} color="var(--text-tertiary)" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
