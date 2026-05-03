import React from 'react';
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
