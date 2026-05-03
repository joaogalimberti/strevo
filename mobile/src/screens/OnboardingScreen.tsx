import React, { useState } from 'react';
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
