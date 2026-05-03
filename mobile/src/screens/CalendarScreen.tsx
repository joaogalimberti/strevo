import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../config/api';
import { Calendar as CalendarIcon, X, Activity, Clock, ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 100) / 7;

export default function CalendarScreen() {
  const navigation = useNavigation();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wRes, sRes] = await Promise.all([
          api.get('/workouts'),
          api.get('/streaks')
        ]);
        setWorkouts(wRes.data);
        setStreak(sRes.data?.currentStreak || 0);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Monthly</Text>
            <Text style={styles.statValue}>{workoutsThisMonth}</Text>
            <Text style={styles.statSub}>Sessions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={[styles.statValue, { color: '#FF007F' }]}>{streak}</Text>
            <Text style={styles.statSub}>Active 🔥</Text>
          </View>
        </View>

        <View style={styles.calendarCard}>
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
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dayText, 
                    workout && styles.dayTextActive,
                    isToday && !workout && styles.dayTextToday
                  ]}>
                    {day}
                  </Text>
                  {workout && <View style={styles.activeDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text style={styles.recentTitle}>Recent Activity</Text>
        {workouts.slice(0, 5).map((w, i) => (
          <TouchableOpacity key={i} style={styles.activityItem} onPress={() => setSelectedWorkout(w)}>
            <View style={styles.activityIcon}>
              <Activity color="#00FFCC" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityType}>{w.type}</Text>
              <Text style={styles.activityDate}>
                {new Date(w.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </Text>
            </View>
            <Text style={styles.activityDuration}>{Math.floor(w.duration / 60)}m</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedWorkout && (
        <Modal transparent animationType="fade" visible={!!selectedWorkout}>
          <View style={styles.modalBg}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedWorkout(null)}>
                <X color="#888" size={24} />
              </TouchableOpacity>
              
              <View style={styles.modalHeader}>
                <LinearGradient
                  colors={['#00FFCC', '#0099FF']}
                  style={styles.modalIconBg}
                >
                  <Activity color="#000" size={32} />
                </LinearGradient>
                <Text style={styles.modalType}>{selectedWorkout.type.toUpperCase()}</Text>
              </View>
              
              <View style={styles.modalDetails}>
                <View style={styles.detailRow}>
                  <Clock color="#00FFCC" size={20} />
                  <Text style={styles.detailText}>
                    Duration: {Math.floor(selectedWorkout.duration / 60)} minutes
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <CalendarIcon color="#00FFCC" size={20} />
                  <Text style={styles.detailText}>
                    {new Date(selectedWorkout.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.modalAction} onPress={() => setSelectedWorkout(null)}>
                <Text style={styles.modalActionText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0A0A' },
  container: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { backgroundColor: '#1A1A1A', padding: 8, borderRadius: 12 },
  title: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statBox: { backgroundColor: '#111', padding: 20, borderRadius: 20, width: '48%', borderWidth: 1, borderColor: '#222' },
  statLabel: { color: '#666', fontSize: 11, textTransform: 'uppercase', fontWeight: '900', letterSpacing: 1 },
  statValue: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginVertical: 4 },
  statSub: { color: '#444', fontSize: 12, fontWeight: '600' },

  calendarCard: { backgroundColor: '#111', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#222', marginBottom: 30 },
  monthTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-start' },
  dayCell: { width: CELL_SIZE, height: CELL_SIZE, backgroundColor: '#0A0A0A', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  dayCellActive: { backgroundColor: 'rgba(0, 255, 204, 0.05)', borderColor: '#00FFCC' },
  dayCellToday: { borderColor: '#444' },
  dayText: { color: '#444', fontSize: 14, fontWeight: '600' },
  dayTextActive: { color: '#FFF', fontWeight: 'bold' },
  dayTextToday: { color: '#888' },
  activeDot: { position: 'absolute', bottom: 6, width: 4, height: 4, borderRadius: 2, backgroundColor: '#00FFCC' },

  recentTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  activityItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 15, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  activityIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  activityType: { color: '#FFF', fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize' },
  activityDate: { color: '#666', fontSize: 13, marginTop: 2 },
  activityDuration: { color: '#00FFCC', fontWeight: 'bold', fontSize: 15 },
  
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#111', width: '100%', borderRadius: 32, padding: 30, borderWidth: 1, borderColor: '#333' },
  closeBtn: { position: 'absolute', top: 25, right: 25, zIndex: 1 },
  modalHeader: { alignItems: 'center', marginBottom: 35 },
  modalIconBg: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalType: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  modalDetails: { gap: 20, backgroundColor: '#1A1A1A', padding: 25, borderRadius: 24, marginBottom: 30 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  detailText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  modalAction: { backgroundColor: '#FFF', padding: 18, borderRadius: 100, alignItems: 'center' },
  modalActionText: { color: '#000', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 }
});
