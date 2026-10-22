import React from 'react';
import { Home, CalendarDays, UserRound } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { View } from '../types';

const items: { view: View; icon: React.ElementType; label: string }[] = [
  { view: 'home', icon: Home, label: 'Today' },
  { view: 'calendar', icon: CalendarDays, label: 'History' },
  { view: 'profile', icon: UserRound, label: 'Profile' },
];

export default function BottomNav() {
  const { currentView, setView } = useStore();

  return (
    <nav className="bottom-nav" aria-label="Main Navigation">
      <div className="bottom-nav-dock">
        {items.map(({ view, icon: Icon, label }) => {
          const isActive = currentView === view;
          return (
            <button
              key={view}
              type="button"
              className={`nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => setView(view)}
              id={`nav-${view}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} className="nav-icon" />
              <span className="nav-tab-label">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
