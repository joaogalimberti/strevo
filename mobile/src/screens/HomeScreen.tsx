import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store/useStore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { api } from '../config/api';
import { User, Calendar, Activity, Play } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MOTIVATIONS = [
  "You showed up yesterday. Let's go again.",
  "Consistency is your edge.",
  "One more day. Keep building.",
  "Your future self is watching.",
  "Small daily habits, massive results."
];

export default function HomeScreen() {
  const { activeWorkoutStart, startWorkout } = useStore();
  const navigation = useNavigation();
  const [streak, setStreak] = useState(0);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [motivation, setMotivation] = useState(MOTIVATIONS[0]);

  const fetchData = () => {
    api.get('/streaks').then(res => setStreak(res.data?.currentStreak || 0)).catch(console.log);
    api.get('/workouts').then(res => setWorkouts(res.data)).catch(console.log);
    setMotivation(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleStart = () => {
    startWorkout();
    navigation.navigate('ActiveWorkout' as never);
  };

  if (activeWorkoutStart) {
    setTimeout(() => navigation.navigate('ActiveWorkout' as never), 0);
  }

  const lastWorkout = workouts.length > 0 ? workouts[0] : null;

  // Generate Weekly Progress (Mon-Sun)
  const today = new Date();
  const currentDayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1; // 0 is Monday, 6 is Sunday
  
  const weeklyDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - currentDayOfWeek + i);
    
    // check if we have a workout on this date
    const hasWorkedOut = workouts.some(w => {
      const wDate = new Date(w.createdAt);
      return wDate.getDate() === d.getDate() && wDate.getMonth() === d.getMonth();
    });

    const isToday = i === currentDayOfWeek;
    const dayName = ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i];
    
    return { dayName, hasWorkedOut, isToday };
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey there,</Text>
            <Text style={styles.motivation}>{motivation}</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Calendar' as never)}>
              <Calendar color="#FFF" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Profile' as never)}>
              <User color="#FFF" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* STREAK CARD */}
        <LinearGradient 
          colors={['#FF007F', '#7000FF']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.streakCard}
        >
          <View style={styles.streakInfo}>
            <Text style={styles.streakNumber}>{streak}</Text>
            <View>
              <Text style={styles.streakTitle}>Day Streak 🔥</Text>
              <Text style={styles.streakSub}>Don't break it today.</Text>
            </View>
          </View>
        </LinearGradient>

        {/* WEEKLY PROGRESS */}
        <View style={styles.weeklyContainer}>
          {weeklyDays.map((d, i) => (
            <View key={i} style={styles.weeklyDayBox}>
              <View style={[
                styles.weeklyDot, 
                d.hasWorkedOut && styles.weeklyDotActive,
                d.isToday && !d.hasWorkedOut && styles.weeklyDotToday
              ]} />
              <Text style={[styles.weeklyDayText, d.isToday && styles.weeklyDayTextToday]}>
                {d.dayName}
              </Text>
            </View>
          ))}
        </View>

        {/* LAST WORKOUT */}
        {lastWorkout && (
          <View style={styles.lastWorkoutCard}>
            <View style={styles.lastWorkoutHeader}>
              <Activity color="#00FFCC" size={20} />
              <Text style={styles.lastWorkoutTitle}>Last Session</Text>
            </View>
            <View style={styles.lastWorkoutDetails}>
              <Text style={styles.lastWorkoutType}>{lastWorkout.type}</Text>
              <Text style={styles.lastWorkoutMeta}>
                {Math.floor(lastWorkout.duration / 60)} min • {new Date(lastWorkout.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </View>
          </View>
        )}

        {/* MAIN CTA */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.8}>
            <View style={styles.playIconContainer}>
              <Play color="#111" fill="#111" size={32} />
            </View>
            <Text style={styles.startText}>START TRAINING</Text>
          </TouchableOpacity>
          <Text style={styles.ctaSubtext}>Time to build consistency</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0A0A' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 30 },
  greeting: { color: '#888', fontSize: 16, marginBottom: 5 },
  motivation: { color: '#FFF', fontSize: 24, fontWeight: 'bold', maxWidth: '75%' },
  headerIcons: { flexDirection: 'row', gap: 15 },
  iconBtn: { backgroundColor: '#1A1A1A', padding: 12, borderRadius: 50 },
  
  streakCard: { borderRadius: 24, padding: 25, marginBottom: 25, overflow: 'hidden', borderWidth: 1, borderColor: '#333' },
  streakInfo: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  streakNumber: { color: '#FFF', fontSize: 64, fontWeight: '900', lineHeight: 70 },
  streakTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  streakSub: { color: '#CCC', fontSize: 14 },

  weeklyContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#111', borderRadius: 20, padding: 20, marginBottom: 25, borderWidth: 1, borderColor: '#222' },
  weeklyDayBox: { alignItems: 'center', gap: 10 },
  weeklyDot: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#222', borderWidth: 1, borderColor: '#333' },
  weeklyDotActive: { backgroundColor: '#00FFCC', borderColor: '#00FFCC' },
  weeklyDotToday: { borderColor: '#888', borderStyle: 'dashed' },
  weeklyDayText: { color: '#666', fontSize: 12, fontWeight: 'bold' },
  weeklyDayTextToday: { color: '#FFF' },

  lastWorkoutCard: { backgroundColor: '#111', borderRadius: 20, padding: 20, marginBottom: 40, borderWidth: 1, borderColor: '#222' },
  lastWorkoutHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  lastWorkoutTitle: { color: '#888', fontSize: 14, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 1 },
  lastWorkoutDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastWorkoutType: { color: '#FFF', fontSize: 20, fontWeight: 'bold', textTransform: 'capitalize' },
  lastWorkoutMeta: { color: '#00FFCC', fontSize: 14, fontWeight: '600' },

  ctaContainer: { alignItems: 'center', marginTop: 'auto' },
  startBtn: { backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 100, width: '100%', justifyContent: 'center', gap: 15 },
  playIconContainer: { backgroundColor: '#00FFCC', padding: 10, borderRadius: 50 },
  startText: { color: '#111', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  ctaSubtext: { color: '#666', fontSize: 14, marginTop: 15 }
});
