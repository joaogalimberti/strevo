import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { useNavigation } from '@react-navigation/native';
import { LogOut, ChevronLeft, Award, Zap, Activity } from 'lucide-react-native';
import { api } from '../config/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { user, setUser } = useStore();
  const navigation = useNavigation();
  const [stats, setStats] = useState({ currentStreak: 0, bestStreak: 0, totalWorkouts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [streakRes, workoutsRes] = await Promise.all([
          api.get('/streaks'),
          api.get('/workouts')
        ]);
        setStats({
          currentStreak: streakRes.data?.currentStreak || 0,
          bestStreak: streakRes.data?.bestStreak || 0,
          totalWorkouts: workoutsRes.data?.length || 0
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Account</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileSection}>
          <LinearGradient
            colors={['#FF007F', '#7000FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase()}</Text>
          </LinearGradient>
          <Text style={styles.username}>@{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Zap color="#FF007F" size={24} />
            <Text style={styles.statValue}>{stats.currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Award color="#00FFCC" size={24} />
            <Text style={styles.statValue}>{stats.bestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
          <View style={[styles.statCard, { width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 20 }]}>
            <Activity color="#7000FF" size={24} />
            <View>
              <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
              <Text style={styles.statLabel}>Total Workouts Completed</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => setUser(null)}>
            <LogOut color="#FF3366" size={20} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.footer}>STREVO v1.0.0 • Built for consistency</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { backgroundColor: '#1A1A1A', padding: 8, borderRadius: 12 },
  title: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  
  container: { padding: 20 },
  
  profileSection: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 2, borderColor: '#333' },
  avatarText: { color: '#FFF', fontSize: 40, fontWeight: '900' },
  username: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  email: { color: '#888', fontSize: 16 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 40 },
  statCard: { backgroundColor: '#111', borderRadius: 20, padding: 20, width: '47.5%', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  statValue: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginTop: 10 },
  statLabel: { color: '#666', fontSize: 12, fontWeight: 'bold', marginTop: 5, textTransform: 'uppercase' },

  menuSection: { marginBottom: 40 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20, borderRadius: 100, backgroundColor: 'rgba(255, 51, 102, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 51, 102, 0.2)' },
  logoutText: { color: '#FF3366', fontSize: 16, fontWeight: 'bold' },

  footer: { textAlign: 'center', color: '#444', fontSize: 12, marginTop: 20 }
});
