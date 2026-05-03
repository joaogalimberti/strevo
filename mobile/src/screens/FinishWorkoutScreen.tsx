import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import { useStore } from '../store/useStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../config/api';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon } from 'lucide-react-native';

const MAIN_TYPES = ['Gym', 'Running', 'Yoga', 'Cycling', 'Other'];
const GYM_SUBCATEGORIES = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Full Upper', 'Full Lower', 'Cardio'];

export default function FinishWorkoutScreen() {
  const { activeWorkoutStart, finishWorkout } = useStore();
  const navigation = useNavigation();
  const route = useRoute();
  const { duration } = route.params as any;
  
  const [mainType, setMainType] = useState('Gym');
  const [subType, setSubType] = useState('Chest');
  const [loading, setLoading] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  const pickImage = async (useCamera = false) => {
    let result;
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return alert('Sorry, we need camera permissions to make this work!');
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.5,
        base64: true,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return alert('Sorry, we need camera roll permissions to make this work!');
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.5,
        base64: true,
      });
    }

    if (!result.canceled && result.assets[0].base64) {
      setPhotoUri(result.assets[0].uri);
      setPhotoBase64(result.assets[0].base64);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const finalType = mainType === 'Gym' ? subType : mainType;
    try {
      const { data: workout } = await api.post('/workouts', {
        startTime: activeWorkoutStart,
        endTime: new Date().toISOString(),
        duration,
        type: finalType
      });
      finishWorkout();
      navigation.navigate('StoryPreview', { workoutId: workout.id, photoBase64 });
    } catch (e) {
      console.log(e);
      alert('Failed to save workout');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingVertical: 40 }}>
      <Text style={styles.title}>Session Complete</Text>
      <Text style={styles.subtitle}>That's how consistency is built.</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>DURATION</Text>
          <Text style={styles.statValue}>{Math.floor(duration / 60)} min</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>What did you train?</Text>
      <View style={styles.typeContainer}>
        {MAIN_TYPES.map(t => (
          <TouchableOpacity 
            key={t} 
            style={[styles.typeBtn, mainType === t && styles.typeBtnActive]} 
            onPress={() => setMainType(t)}
          >
            <Text style={[styles.typeText, mainType === t && styles.typeTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {mainType === 'Gym' && (
        <>
          <Text style={styles.sectionTitle}>Focus Area</Text>
          <View style={styles.typeContainer}>
            {GYM_SUBCATEGORIES.map(t => (
              <TouchableOpacity 
                key={t} 
                style={[styles.subTypeBtn, subType === t && styles.subTypeBtnActive]} 
                onPress={() => setSubType(t)}
              >
                <Text style={[styles.subTypeText, subType === t && styles.subTypeTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Add a Photo (Optional)</Text>
      <View style={styles.photoActions}>
        {photoUri ? (
          <View style={styles.photoPreviewContainer}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            <TouchableOpacity style={styles.removePhotoBtn} onPress={() => { setPhotoUri(null); setPhotoBase64(null); }}>
              <Text style={styles.removePhotoText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.photoBtn} onPress={() => pickImage(true)}>
              <Camera color="#888" size={24} />
              <Text style={styles.photoBtnText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoBtn} onPress={() => pickImage(false)}>
              <ImageIcon color="#888" size={24} />
              <Text style={styles.photoBtnText}>Gallery</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#111" /> : <Text style={styles.saveText}>Save & Generate Story</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', padding: 20 },
  title: { color: '#FFF', fontSize: 36, fontWeight: '900', textAlign: 'center', marginBottom: 5 },
  subtitle: { color: '#00FFCC', fontSize: 16, textAlign: 'center', marginBottom: 40, fontStyle: 'italic' },
  
  statsRow: { alignItems: 'center', marginBottom: 40 },
  statBox: { backgroundColor: '#111', padding: 20, borderRadius: 16, alignItems: 'center', minWidth: 150, borderWidth: 1, borderColor: '#222' },
  statLabel: { color: '#888', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  statValue: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },

  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginLeft: 5 },
  typeContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 30, gap: 10 },
  
  typeBtn: { backgroundColor: '#1A1A1A', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 100, borderWidth: 1, borderColor: '#333' },
  typeBtnActive: { backgroundColor: '#FFF', borderColor: '#FFF' },
  typeText: { color: '#888', fontSize: 16, fontWeight: '600' },
  typeTextActive: { color: '#111', fontWeight: 'bold' },

  subTypeBtn: { backgroundColor: '#111', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#222' },
  subTypeBtnActive: { backgroundColor: 'rgba(0, 255, 204, 0.1)', borderColor: '#00FFCC' },
  subTypeText: { color: '#666', fontSize: 14, fontWeight: '600' },
  subTypeTextActive: { color: '#00FFCC', fontWeight: 'bold' },

  photoActions: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  photoBtn: { flex: 1, backgroundColor: '#111', padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#222', borderStyle: 'dashed' },
  photoBtnText: { color: '#888', marginTop: 10, fontWeight: 'bold' },
  
  photoPreviewContainer: { flex: 1, alignItems: 'center', position: 'relative' },
  photoPreview: { width: 100, height: 150, borderRadius: 10, borderWidth: 2, borderColor: '#00FFCC' },
  removePhotoBtn: { marginTop: 10, padding: 5 },
  removePhotoText: { color: '#FF007F', fontWeight: 'bold' },

  saveBtn: { backgroundColor: '#00FFCC', padding: 20, borderRadius: 100, alignItems: 'center', marginTop: 10 },
  saveText: { color: '#111', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 }
});
