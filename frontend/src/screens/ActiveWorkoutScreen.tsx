import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import {
  Square, Heart, Flame, Activity, Pause, Play
} from 'lucide-react';
import './ActiveWorkoutScreen.css';

export default function ActiveWorkoutScreen() {
  const { activeWorkoutStart, setView } = useStore();
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [heartRate, setHeartRate] = useState(142);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!activeWorkoutStart) return;

    const start = new Date(activeWorkoutStart).getTime();

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        const diff = Math.floor((Date.now() - start) / 1000);
        setElapsed(diff);

        // Subtle biological variance in heart rate
        setHeartRate(138 + Math.floor(Math.sin(diff / 5) * 8 + Math.random() * 4));
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeWorkoutStart, isPaused]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  const calories = Math.round((elapsed / 60) * 8.5);

  const getZone = (hr: number) => {
    if (hr < 120) return { label: 'Zone 1 • Recovery', color: 'var(--text-secondary)' };
    if (hr < 140) return { label: 'Zone 2 • Aerobic Base', color: 'var(--accent-champagne)' };
    if (hr < 160) return { label: 'Zone 3 • Tempo', color: 'var(--text-primary)' };
    return { label: 'Zone 4 • Threshold', color: 'var(--accent-ember)' };
  };

  const currentZone = getZone(heartRate);

  return (
    <div className="active-screen">
      {/* Top Protocol Status */}
      <div className="active-nav anim-fade-up">
        <div className="active-live-indicator">
          <span className="live-dot" />
          <span className="live-text">{isPaused ? 'SESSION PAUSED' : 'SESSION IN PROGRESS'}</span>
        </div>
      </div>

      {/* Hero Timer (Apple Watch style) */}
      <div className="active-hero anim-fade-up" style={{ animationDelay: '0.04s' }}>
        <span className="timer-headline">ELAPSED TIME</span>
        <div className="time-display-block">
          <span className="time-digits">{formatTime(elapsed)}</span>
        </div>
        <div className="zone-pill" style={{ color: currentZone.color }}>
          <Activity size={14} />
          <span>{currentZone.label}</span>
        </div>
      </div>

      {/* Live Telemetry Grid */}
      <div className="active-metrics-grid anim-fade-up" style={{ animationDelay: '0.08s' }}>
        <div className="metric-box card">
          <div className="metric-header">
            <Heart size={15} color="var(--accent-ember)" />
            <span className="metric-label">Heart Rate</span>
          </div>
          <div className="metric-val-row">
            <span className="metric-num">{heartRate}</span>
            <span className="metric-unit">BPM</span>
          </div>
        </div>

        <div className="metric-box card">
          <div className="metric-header">
            <Flame size={15} color="var(--accent-champagne)" />
            <span className="metric-label">Active Burn</span>
          </div>
          <div className="metric-val-row">
            <span className="metric-num">{calories}</span>
            <span className="metric-unit">KCAL</span>
          </div>
        </div>
      </div>

      {/* Control Buttons (Pause + End Session) */}
      <div className="active-controls anim-fade-up" style={{ animationDelay: '0.12s' }}>
        <button
          className="control-btn-secondary"
          onClick={() => setIsPaused(!isPaused)}
          id="btn-pause-workout"
        >
          {isPaused ? <Play size={18} /> : <Pause size={18} />}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>

        <button
          className="control-btn-primary"
          onClick={() => setView('finish-workout')}
          id="btn-finish-workout"
        >
          <Square size={16} fill="currentColor" />
          <span>Complete Session</span>
        </button>
      </div>
    </div>
  );
}
