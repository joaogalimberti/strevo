import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AppState } from 'react-native';
import { useStore } from '../store/useStore';
import { useNavigation } from '@react-navigation/native';
import { PlaySquare } from 'lucide-react-native';

const FOCUS_PHRASES = [
  "Embrace the burn.",
  "You're doing great. Keep pushing.",
  "Focus on your breathing.",
  "Every minute counts.",
  "Leave it all here today."
];

export default function ActiveWorkoutScreen() {
  const { activeWorkoutStart } = useStore();
  const navigation = useNavigation();
  const [elapsed, setElapsed] = useState(0);
  const [phrase, setPhrase] = useState(FOCUS_PHRASES[0]);

  const updateTimer = () => {
    if (!activeWorkoutStart) return;
    const start = new Date(activeWorkoutStart).getTime();
    const currentElapsed = Math.floor((Date.now() - start) / 1000);
    setElapsed(currentElapsed);
  };

  useEffect(() => {
    if (!activeWorkoutStart) return;
    
    // update timer immediately
    updateTimer();

    const interval = setInterval(() => {
      updateTimer();
      const currentElapsed = Math.floor((Date.now() - new Date(activeWorkoutStart).getTime()) / 1000);
      
      // change phrase every 5 minutes (300 seconds)
      if (currentElapsed > 0 && currentElapsed % 300 === 0) {
        setPhrase(FOCUS_PHRASES[Math.floor(Math.random() * FOCUS_PHRASES.length)]);
      }
    }, 1000);

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        updateTimer();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [activeWorkoutStart]);

  const handleFinish = () => {
    navigation.navigate('FinishWorkout', { duration: elapsed });
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    if (h > 0) return `${h}:${m}:${s}`;
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.pulseIndicator}>
          <View style={styles.dot} />
          <Text style={styles.recordingText}>SESSION IN PROGRESS</Text>
        </View>
        <Text style={styles.motivation}>{phrase}</Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(elapsed)}</Text>
        <Text style={styles.timerSub}>CURRENT DURATION</Text>
      </View>

      <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
        <PlaySquare color="#111" fill="#111" size={24} />
        <Text style={styles.finishText}>FINISH WORKOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'space-between', padding: 30, paddingTop: 60, paddingBottom: 50 },
  topSection: { alignItems: 'center' },
  pulseIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginBottom: 40, borderWidth: 1, borderColor: '#333' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00FFCC', marginRight: 10 },
  recordingText: { color: '#00FFCC', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  motivation: { color: '#888', fontSize: 22, fontStyle: 'italic', textAlign: 'center', maxWidth: '80%' },
  
  timerContainer: { alignItems: 'center' },
  timer: { color: '#FFF', fontSize: 90, fontWeight: '900', fontVariant: ['tabular-nums'], letterSpacing: -2 },
  timerSub: { color: '#444', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginTop: 10 },
  
  finishBtn: { backgroundColor: '#FFF', flexDirection: 'row', paddingHorizontal: 40, paddingVertical: 20, borderRadius: 100, alignItems: 'center', justifyContent: 'center', gap: 15 },
  finishText: { color: '#111', fontSize: 18, fontWeight: '900', letterSpacing: 1 }
});
