import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../config/api';
import { Calendar as CalendarIcon, X, Activity, Clock } from 'lucide-react-native';

export default function CalendarScreen() {
  const navigation = useNavigation();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  useEffect(() => {
    api.get('/workouts').then(res => setWorkouts(res.data)).catch(console.log);
    api.get('/streaks').then(res => setStreak(res.data?.currentStreak || 0)).catch(console.log);
  }, []);

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const getWorkoutForDay = (day: number) => {
    return workouts.find(w => {
      const d = new Date(w.createdAt);
      return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  };

  const workoutsThisMonth = workouts.filter(w => {
    const d = new Date(w.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>History</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Workouts</Text>
          <Text style={styles.statValue}>{workoutsThisMonth}</Text>
          <Text style={styles.statSub}>this month</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Current Streak</Text>
          <Text style={[styles.statValue, { color: '#FF007F' }]}>{streak} 🔥</Text>
          <Text style={styles.statSub}>days</Text>
        </View>
      </View>

      <Text style={styles.monthTitle}>
        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
      </Text>

      <View style={styles.calendarGrid}>
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const workout = getWorkoutForDay(day);
          const isToday = day === new Date().getDate();

          return (
            <TouchableOpacity 
              key={day} 
              style={[
                styles.dayCell, 
                workout && styles.dayCellActive,
                isToday && !workout && styles.dayCellToday
              ]}
              onPress={() => workout && setSelectedWorkout(workout)}
              disabled={!workout}
            >
              <Text style={[
                styles.dayText, 
                workout && styles.dayTextActive,
                isToday && !workout && styles.dayTextToday
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedWorkout && (
        <Modal transparent animationType="fade" visible={!!selectedWorkout}>
          <View style={styles.modalBg}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedWorkout(null)}>
                <X color="#888" size={24} />
              </TouchableOpacity>
              
              <View style={styles.modalHeader}>
                <Activity color="#00FFCC" size={32} />
                <Text style={styles.modalType}>{selectedWorkout.type.toUpperCase()}</Text>
              </View>
              
              <View style={styles.modalDetails}>
                <View style={styles.detailRow}>
                  <Clock color="#888" size={20} />
                  <Text style={styles.detailText}>
                    {Math.floor(selectedWorkout.duration / 60)} min
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <CalendarIcon color="#888" size={20} />
                  <Text style={styles.detailText}>
                    {new Date(selectedWorkout.createdAt).toLocaleDateString()} • {new Date(selectedWorkout.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  backBtn: { padding: 10, backgroundColor: '#1A1A1A', borderRadius: 12 },
  backText: { color: '#FFF', fontSize: 20 },
  title: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  statBox: { backgroundColor: '#111', padding: 20, borderRadius: 16, width: '48%', borderWidth: 1, borderColor: '#222' },
  statLabel: { color: '#888', fontSize: 12, textTransform: 'uppercase', marginBottom: 5 },
  statValue: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  statSub: { color: '#555', fontSize: 12, marginTop: 5 },
  monthTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  dayCell: { width: '12%', aspectRatio: 1, backgroundColor: '#111', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  dayCellActive: { backgroundColor: 'rgba(0, 255, 204, 0.1)', borderColor: '#00FFCC' },
  dayCellToday: { borderColor: '#444' },
  dayText: { color: '#666', fontSize: 14, fontWeight: '600' },
  dayTextActive: { color: '#00FFCC' },
  dayTextToday: { color: '#FFF' },
  
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#111', width: '100%', borderRadius: 24, padding: 30, borderWidth: 1, borderColor: '#333' },
  closeBtn: { position: 'absolute', top: 20, right: 20, zIndex: 1 },
  modalHeader: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  modalType: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginTop: 15 },
  modalDetails: { gap: 15, backgroundColor: '#1A1A1A', padding: 20, borderRadius: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  detailText: { color: '#CCC', fontSize: 16, fontWeight: '500' }
});
