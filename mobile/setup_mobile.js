const fs = require('fs');
const path = require('path');

const files = {
  'src/store/useStore.ts': `import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  token: string;
}

interface StoreState {
  user: User | null;
  activeWorkoutStart: string | null;
  setUser: (user: User | null) => void;
  startWorkout: () => void;
  finishWorkout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      activeWorkoutStart: null,
      setUser: (user) => set({ user }),
      startWorkout: () => set({ activeWorkoutStart: new Date().toISOString() }),
      finishWorkout: () => set({ activeWorkoutStart: null }),
    }),
    {
      name: 'strevo-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
`,
  'src/config/api.ts': `import axios from 'axios';
import { useStore } from '../store/useStore';

export const API_URL = 'http://10.0.2.2:3000'; // For Android emulator. iOS is localhost

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = useStore.getState().user?.token;
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});
`,
  'src/screens/OnboardingScreen.tsx': `import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';
import { api } from '../config/api';

export default function OnboardingScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setUser = useStore(state => state.setUser);

  const handleSubmit = async () => {
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { username, email, password };
      const { data } = await api.post(endpoint, payload);
      setUser({ ...data.user, token: data.access_token });
    } catch (e) {
      console.log(e);
      alert('Authentication failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>STREVO</Text>
      {!isLogin && (
        <TextInput placeholder="Username" placeholderTextColor="#666" style={styles.input} value={username} onChangeText={setUsername} />
      )}
      <TextInput placeholder="Email" placeholderTextColor="#666" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Password" placeholderTextColor="#666" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>{isLogin ? 'Login' : 'Register'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.toggle}>{isLogin ? 'Create an account' : 'Already have an account? Login'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', justifyContent: 'center', padding: 20 },
  title: { color: '#FFF', fontSize: 48, fontWeight: 'bold', marginBottom: 40, textAlign: 'center', letterSpacing: 2 },
  input: { backgroundColor: '#222', color: '#FFF', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  btn: { backgroundColor: '#00FFCC', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#111', fontSize: 18, fontWeight: 'bold' },
  toggle: { color: '#888', textAlign: 'center', marginTop: 20 }
});
`,
  'src/screens/HomeScreen.tsx': `import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';
import { useNavigation } from '@react-navigation/native';
import { api } from '../config/api';

export default function HomeScreen() {
  const { activeWorkoutStart, startWorkout } = useStore();
  const navigation = useNavigation();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    api.get('/streaks').then(res => setStreak(res.data?.currentStreak || 0)).catch(console.log);
  }, []);

  const handleStart = () => {
    startWorkout();
    navigation.navigate('ActiveWorkout' as never);
  };

  if (activeWorkoutStart) {
    // If there's an active workout, go there
    setTimeout(() => navigation.navigate('ActiveWorkout' as never), 0);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.streak}>🔥 {streak} Day Streak</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
          <Text style={styles.profileBtn}>Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.center}>
        <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
          <Text style={styles.startText}>START</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 },
  streak: { color: '#00FFCC', fontSize: 20, fontWeight: 'bold' },
  profileBtn: { color: '#888', fontSize: 18 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  startBtn: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  startText: { color: '#111', fontSize: 32, fontWeight: 'bold', letterSpacing: 2 }
});
`,
  'src/screens/ActiveWorkoutScreen.tsx': `import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';
import { useNavigation } from '@react-navigation/native';

export default function ActiveWorkoutScreen() {
  const { activeWorkoutStart } = useStore();
  const navigation = useNavigation();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!activeWorkoutStart) return;
    const start = new Date(activeWorkoutStart).getTime();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkoutStart]);

  const handleFinish = () => {
    navigation.navigate('FinishWorkout', { duration: elapsed });
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return \`\${m}:\${s}\`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(elapsed)}</Text>
      <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
        <Text style={styles.finishText}>FINISH</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  timer: { color: '#00FFCC', fontSize: 80, fontWeight: 'bold', marginBottom: 50 },
  finishBtn: { backgroundColor: '#FF007F', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30 },
  finishText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' }
});
`,
  'src/screens/FinishWorkoutScreen.tsx': `import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useStore } from '../store/useStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../config/api';

const TYPES = ['Running', 'Gym', 'Yoga', 'Cycling', 'Other'];

export default function FinishWorkoutScreen() {
  const { activeWorkoutStart, finishWorkout } = useStore();
  const navigation = useNavigation();
  const route = useRoute();
  const { duration } = route.params as any;
  const [type, setType] = useState('Gym');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: workout } = await api.post('/workouts', {
        startTime: activeWorkoutStart,
        endTime: new Date().toISOString(),
        duration,
        type
      });
      finishWorkout();
      navigation.navigate('StoryPreview', { workoutId: workout.id });
    } catch (e) {
      console.log(e);
      alert('Failed to save workout');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Great Job!</Text>
      <Text style={styles.subtitle}>Duration: {Math.floor(duration / 60)} min</Text>
      
      <View style={styles.typeContainer}>
        {TYPES.map(t => (
          <TouchableOpacity key={t} style={[styles.typeBtn, type === t && styles.typeBtnActive]} onPress={() => setType(t)}>
            <Text style={[styles.typeText, type === t && styles.typeTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#111" /> : <Text style={styles.saveText}>Save & Create Story</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', justifyContent: 'center', padding: 20 },
  title: { color: '#FFF', fontSize: 40, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { color: '#888', fontSize: 20, textAlign: 'center', marginBottom: 40 },
  typeContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 },
  typeBtn: { backgroundColor: '#222', padding: 15, borderRadius: 20, margin: 5 },
  typeBtnActive: { backgroundColor: '#00FFCC' },
  typeText: { color: '#888', fontSize: 16 },
  typeTextActive: { color: '#111', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, alignItems: 'center' },
  saveText: { color: '#111', fontSize: 18, fontWeight: 'bold' }
});
`,
  'src/screens/StoryPreviewScreen.tsx': `import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../config/api';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const STYLES = ['dark minimal', 'neon fitness', 'clean white'];

export default function StoryPreviewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { workoutId } = route.params as any;
  const [style, setStyle] = useState('dark minimal');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStory = async (selectedStyle: string) => {
    setLoading(true);
    try {
      const { data } = await api.post('/stories/generate', { workoutId, style: selectedStyle });
      setImageUrl(data.imageUrl);
    } catch (e) {
      console.log(e);
      alert('Failed to generate story');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStory(style);
  }, [style]);

  const handleShare = async () => {
    if (!imageUrl) return;
    try {
      const downloadRes = await FileSystem.downloadAsync(
        imageUrl,
        FileSystem.documentDirectory + 'story.png'
      );
      await Sharing.shareAsync(downloadRes.uri);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#00FFCC" />
        ) : (
          imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        )}
      </View>
      <View style={styles.controls}>
        <View style={styles.stylesRow}>
          {STYLES.map(s => (
            <TouchableOpacity key={s} onPress={() => setStyle(s)}>
              <Text style={[styles.styleBtn, style === s && styles.styleBtnActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareText}>Share to IG</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)} style={{ marginTop: 20 }}>
          <Text style={{ color: '#888', textAlign: 'center' }}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  imageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  controls: { padding: 20, backgroundColor: '#111', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  stylesRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  styleBtn: { color: '#666', textTransform: 'capitalize' },
  styleBtnActive: { color: '#00FFCC', fontWeight: 'bold' },
  shareBtn: { backgroundColor: '#FF007F', padding: 15, borderRadius: 10, alignItems: 'center' },
  shareText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 }
});
`,
  'src/screens/ProfileScreen.tsx': `import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { user, setUser } = useStore();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.info}>@{user?.username}</Text>
      <Text style={styles.info}>{user?.email}</Text>
      
      <TouchableOpacity style={styles.btn} onPress={() => {
        setUser(null);
      }}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, {backgroundColor: '#333'}]} onPress={() => navigation.goBack()}>
        <Text style={[styles.btnText, {color: '#FFF'}]}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', padding: 20, justifyContent: 'center' },
  title: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  info: { color: '#888', fontSize: 18, marginBottom: 10 },
  btn: { backgroundColor: '#FF3366', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
`,
  'App.tsx': `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useStore } from './src/store/useStore';

import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import ActiveWorkoutScreen from './src/screens/ActiveWorkoutScreen';
import FinishWorkoutScreen from './src/screens/FinishWorkoutScreen';
import StoryPreviewScreen from './src/screens/StoryPreviewScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const user = useStore(state => state.user);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
            <Stack.Screen name="FinishWorkout" component={FinishWorkoutScreen} />
            <Stack.Screen name="StoryPreview" component={StoryPreviewScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Mobile setup complete');
