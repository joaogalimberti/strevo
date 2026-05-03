import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../config/api';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';

const STYLES = ['dark minimal', 'neon fitness', 'clean white'];

export default function StoryPreviewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { workoutId, photoBase64 } = route.params as any;
  const [style, setStyle] = useState('dark minimal');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStory = async (selectedStyle: string) => {
    setLoading(true);
    try {
      const payload: any = { workoutId, style: selectedStyle };
      if (photoBase64) payload.photoBase64 = photoBase64;
      
      const { data } = await api.post('/stories/generate', payload);
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
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required to save the story.');
        return;
      }

      const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${api.defaults.baseURL}${imageUrl}`;
      
      const downloadRes = await FileSystem.downloadAsync(
        fullUrl,
        FileSystem.documentDirectory + 'story.png'
      );
      
      const asset = await MediaLibrary.createAssetAsync(downloadRes.uri);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadRes.uri);
      } else {
        alert('Story saved to your gallery!');
      }
    } catch (e) {
      console.log(e);
      alert('Failed to save or share story.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#00FFCC" />
        ) : (
          imageUrl && <Image source={{ uri: imageUrl.startsWith('http') ? imageUrl : `${api.defaults.baseURL}${imageUrl}` }} style={styles.image} resizeMode="contain" />
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
          <Text style={styles.shareText}>Save & Share</Text>
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
