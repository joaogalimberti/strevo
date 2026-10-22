import React from 'react';
import { useStore } from './store/useStore';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import ActiveWorkoutScreen from './screens/ActiveWorkoutScreen';
import FinishWorkoutScreen from './screens/FinishWorkoutScreen';
import CalendarScreen from './screens/CalendarScreen';
import ProfileScreen from './screens/ProfileScreen';
import StoryPreviewScreen from './screens/StoryPreviewScreen';
import BottomNav from './components/BottomNav';
import StatusBar from './components/StatusBar';
import PhoneShell from './components/PhoneShell';

export default function App() {
  const { currentView, user } = useStore();

  const renderScreen = () => {
    if (!user) return <AuthScreen />;
    switch (currentView) {
      case 'home': return <HomeScreen />;
      case 'active-workout': return <ActiveWorkoutScreen />;
      case 'finish-workout': return <FinishWorkoutScreen />;
      case 'calendar': return <CalendarScreen />;
      case 'profile': return <ProfileScreen />;
      case 'story-preview': return <StoryPreviewScreen />;
      default: return <HomeScreen />;
    }
  };

  const showNav = user && !['active-workout', 'finish-workout', 'story-preview', 'auth'].includes(currentView);

  return (
    <PhoneShell>
      {user && <StatusBar />}
      <div className="screen">
        {renderScreen()}
      </div>
      {showNav && <BottomNav />}
    </PhoneShell>
  );
}
