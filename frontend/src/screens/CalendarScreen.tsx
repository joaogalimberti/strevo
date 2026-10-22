import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  ChevronLeft, ChevronRight, Clock, Flame, Calendar as CalendarIcon, CheckCircle2, X
} from 'lucide-react';
import type { Workout } from '../types';
import './CalendarScreen.css';

export default function CalendarScreen() {
  const { workouts, streak, setView } = useStore();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const getWorkoutForDay = (day: number) => {
    return workouts.find((w) => {
      const d = new Date(w.createdAt);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const workoutsThisMonth = workouts.filter((w) => {
    const d = new Date(w.createdAt);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const totalMinutesThisMonth = workoutsThisMonth.reduce(
    (acc, w) => acc + Math.floor(w.duration / 60),
    0
  );

  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const filteredWorkouts = selectedDay
    ? workouts.filter((w) => {
        const d = new Date(w.createdAt);
        return d.getDate() === selectedDay && d.getMonth() === month && d.getFullYear() === year;
      })
    : workoutsThisMonth;

  return (
    <div className="calendar-screen scroll-content">
      {/* Top Header */}
      <header className="calendar-top-bar anim-fade-up">
        <div>
          <span className="section-label" style={{ margin: 0 }}>HISTORICAL LOG</span>
          <h1 className="calendar-page-title">Discipline Grid</h1>
        </div>
        <div className="cal-streak-badge">
          <span className="cal-streak-num">{streak}</span>
          <span className="cal-streak-tag">DAYS ACTIVE</span>
        </div>
      </header>

      {/* Complete, Guaranteed-Visible Calendar Card */}
      <div className="calendar-card card anim-fade-up" style={{ animationDelay: '0.04s' }}>
        {/* Month Navigation */}
        <div className="month-nav">
          <button className="nav-arrow" onClick={prevMonth} aria-label="Previous Month">
            <ChevronLeft size={16} />
          </button>
          <div className="month-title-wrap">
            <span className="month-title">{monthName}</span>
            <span className="month-subtitle">{workoutsThisMonth.length} Sessions Logged</span>
          </div>
          <button className="nav-arrow" onClick={nextMonth} aria-label="Next Month">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Weekday Columns */}
        <div className="calendar-weekdays">
          {weekDays.map((d, i) => (
            <span key={i} className="cal-weekday">{d}</span>
          ))}
        </div>

        {/* Calendar Days Matrix */}
        <div className="calendar-grid">
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="cal-day empty" aria-hidden="true" />
          ))}

          {/* Actual days 1..daysInMonth */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const workout = getWorkoutForDay(day);
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                type="button"
                className={`cal-day ${workout ? 'has-workout' : ''} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                onClick={() => {
                  if (workout) {
                    setSelectedWorkout(workout);
                  } else {
                    setSelectedDay(selectedDay === day ? null : day);
                  }
                }}
              >
                <span className="day-number">{day}</span>
                {workout && (
                  <span className="workout-marker" title={workout.type}>
                    <span className="marker-dot" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mini stats summary inside calendar */}
        <div className="calendar-card-footer">
          <div className="footer-stat">
            <span className="footer-stat-val">{workoutsThisMonth.length}</span>
            <span className="footer-stat-lbl">Sessions</span>
          </div>
          <div className="footer-stat-div" />
          <div className="footer-stat">
            <span className="footer-stat-val">{Math.round(totalMinutesThisMonth / 60)}h</span>
            <span className="footer-stat-lbl">Time</span>
          </div>
          <div className="footer-stat-div" />
          <div className="footer-stat">
            <span className="footer-stat-val">{streak}d</span>
            <span className="footer-stat-lbl">Streak</span>
          </div>
        </div>
      </div>

      {/* Completed Sessions Feed */}
      <section className="timeline-section anim-fade-up" style={{ animationDelay: '0.08s' }}>
        <div className="timeline-header-row">
          <span className="section-label" style={{ margin: 0 }}>
            {selectedDay ? `Sessions on ${monthName.split(' ')[0]} ${selectedDay}` : `All Sessions (${filteredWorkouts.length})`}
          </span>
          {selectedDay && (
            <button className="clear-filter-btn" onClick={() => setSelectedDay(null)}>
              Show All
            </button>
          )}
        </div>

        <div className="history-list">
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((w) => (
              <div
                key={w.id}
                className="history-item card card-interactive"
                onClick={() => setSelectedWorkout(w)}
              >
                <div className="history-main">
                  <span className="history-type">{w.type}</span>
                  <span className="history-date">
                    {new Date(w.createdAt).toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="history-meta">
                  <span className="history-duration">{Math.floor(w.duration / 60)} min</span>
                  <span className="history-cal">{w.calories || 380} kcal</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-day-notice card">
              <span className="empty-notice-title">No Workout Recorded</span>
              <span className="empty-notice-sub">Rest day or session not logged for this date.</span>
            </div>
          )}
        </div>
      </section>

      {/* Session Modal Sheet */}
      {selectedWorkout && (
        <div className="modal-overlay" onClick={() => setSelectedWorkout(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            
            <div className="modal-sheet-top">
              <span className="modal-sheet-tag">VERIFIED LOG</span>
              <h3 className="modal-sheet-title">{selectedWorkout.type}</h3>
              <span className="modal-sheet-date">
                {new Date(selectedWorkout.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                })}
              </span>
            </div>

            <div className="modal-sheet-metrics">
              <div className="sheet-metric-card">
                <Clock size={16} color="var(--text-tertiary)" />
                <span className="sheet-metric-val">{Math.floor(selectedWorkout.duration / 60)} min</span>
                <span className="sheet-metric-lbl">Duration</span>
              </div>

              <div className="sheet-metric-card">
                <Flame size={16} color="var(--text-tertiary)" />
                <span className="sheet-metric-val">{selectedWorkout.calories || 420} kcal</span>
                <span className="sheet-metric-lbl">Estimated Burn</span>
              </div>
            </div>

            {selectedWorkout.notes && (
              <div className="sheet-note-box">
                <span className="note-title">ATHLETE NOTE</span>
                <p className="note-body">"{selectedWorkout.notes}"</p>
              </div>
            )}

            <button
              className="btn-secondary"
              style={{ marginTop: 20 }}
              onClick={() => setSelectedWorkout(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
