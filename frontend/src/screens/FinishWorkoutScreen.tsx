import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import {
  Clock, Flame, ChevronLeft, ArrowRight, Camera, X
} from 'lucide-react';
import './FinishWorkoutScreen.css';

const DISCIPLINES = [
  { id: 'Strength', label: 'Hypertrophy / Weights' },
  { id: 'Endurance', label: 'Tempo & Distance Run' },
  { id: 'Mobility', label: 'Recovery & Mobility' },
  { id: 'Conditioning', label: 'High-Volume Conditioning' },
];

const TARGET_AREAS = [
  'Upper Body Power', 'Posterior Chain', 'Quad & Calves Focus',
  'Chest & Deltoids', 'Full Spectrum', 'Engine & Core'
];

const PRESETS = [
  { id: '1', label: 'Obsidian Studio', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80' },
  { id: '2', label: 'Monochrome Run', url: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&auto=format&fit=crop&q=80' },
  { id: '3', label: 'Graphite Plates', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80' },
];

export default function FinishWorkoutScreen() {
  const { activeWorkoutStart, addWorkout, finishWorkout, setStoryData, setView, streak } = useStore();

  const [durationSec] = useState(() => {
    if (!activeWorkoutStart) return 3600;
    const diff = Math.floor((Date.now() - new Date(activeWorkoutStart).getTime()) / 1000);
    return Math.max(diff, 60);
  });

  const [discipline, setDiscipline] = useState('Strength');
  const [targetArea, setTargetArea] = useState('Upper Body Power');
  const [rpe, setRpe] = useState(8);
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(PRESETS[0].url);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const durationMin = Math.max(1, Math.floor(durationSec / 60));
  const calories = Math.round(durationMin * (rpe * 1.15));

  const handleCustomPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const finalType = discipline === 'Strength' ? targetArea : discipline;

    await new Promise((r) => setTimeout(r, 450));

    const workoutId = 'w-' + Date.now();
    const newWorkout = {
      id: workoutId,
      type: finalType,
      duration: durationSec,
      calories,
      intensity: (rpe >= 8 ? 'extreme' : rpe >= 6 ? 'high' : 'moderate') as any,
      notes: notes.trim() || undefined,
      photoUrl: photoUrl || undefined,
      createdAt: new Date().toISOString(),
    };

    addWorkout(newWorkout);
    finishWorkout();

    setStoryData({
      workoutId,
      type: finalType,
      duration: durationSec,
      calories,
      date: new Date().toISOString(),
      photoUrl: photoUrl || null,
      streak: streak + 1,
    });

    setSaving(false);
    setView('story-preview');
  };

  return (
    <div className="finish-screen scroll-content">
      {/* Header */}
      <div className="finish-nav anim-fade-up">
        <button className="icon-btn" onClick={() => setView('active-workout')} title="Back">
          <ChevronLeft size={20} />
        </button>
        <span className="finish-nav-title">Session Summary</span>
        <div style={{ width: 40 }} />
      </div>

      {/* Key Numbers */}
      <div className="finish-stats-card card anim-fade-up" style={{ animationDelay: '0.04s' }}>
        <div className="stat-column">
          <div className="stat-label-wrap">
            <Clock size={13} color="var(--text-tertiary)" />
            <span>DURATION</span>
          </div>
          <div className="stat-digits">
            <span>{durationMin}</span>
            <small>MIN</small>
          </div>
        </div>
        <div className="stat-sep" />
        <div className="stat-column">
          <div className="stat-label-wrap">
            <Flame size={13} color="var(--text-tertiary)" />
            <span>EST. EXERTION</span>
          </div>
          <div className="stat-digits">
            <span>{calories}</span>
            <small>KCAL</small>
          </div>
        </div>
      </div>

      {/* Discipline Selector */}
      <div className="finish-group anim-fade-up" style={{ animationDelay: '0.08s' }}>
        <div className="section-label">Discipline</div>
        <div className="discipline-list">
          {DISCIPLINES.map((d) => (
            <button
              key={d.id}
              className={`discipline-chip ${discipline === d.id ? 'active' : ''}`}
              onClick={() => setDiscipline(d.id)}
            >
              <span>{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target Focus Area */}
      {discipline === 'Strength' && (
        <div className="finish-group anim-fade-up" style={{ animationDelay: '0.12s' }}>
          <div className="section-label">Focus Area</div>
          <div className="target-grid">
            {TARGET_AREAS.map((a) => (
              <button
                key={a}
                className={`target-pill ${targetArea === a ? 'active' : ''}`}
                onClick={() => setTargetArea(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Perceived Exertion (RPE 1 to 10 slider / stepper) */}
      <div className="finish-group anim-fade-up" style={{ animationDelay: '0.16s' }}>
        <div className="rpe-header">
          <span className="section-label" style={{ margin: 0 }}>Rate of Exertion (RPE)</span>
          <span className="rpe-score">{rpe}/10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={rpe}
          onChange={(e) => setRpe(Number(e.target.value))}
          className="luxury-slider"
        />
        <div className="rpe-scales">
          <span>Moderate (6)</span>
          <span>Target Strain (8)</span>
          <span>Max Output (10)</span>
        </div>
      </div>

      {/* Story Editorial Photo */}
      <div className="finish-group anim-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="section-label">Story Visual Background</div>
        {photoUrl && (
          <div className="photo-preview-wrap">
            <img src={photoUrl} alt="Session" className="photo-preview-img" />
            <button className="photo-clear-btn" onClick={() => setPhotoUrl(null)}>
              <X size={14} />
            </button>
          </div>
        )}
        <div className="preset-strip">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className={`preset-thumb ${photoUrl === p.url ? 'active' : ''}`}
              onClick={() => setPhotoUrl(p.url)}
            >
              <img src={p.url} alt={p.label} />
            </button>
          ))}
          <button
            className="preset-thumb upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera size={16} />
            <span>Upload</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomPhoto}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="finish-group anim-fade-up" style={{ animationDelay: '0.24s' }}>
        <div className="section-label">Athlete Note</div>
        <input
          className="input"
          placeholder="Session highlights, weights, or cadence..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Submit */}
      <div className="finish-submit-wrap anim-fade-up" style={{ animationDelay: '0.28s' }}>
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={saving}
          id="btn-save-workout"
        >
          <span>{saving ? 'Recording Data...' : 'Commit & Create Story'}</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
