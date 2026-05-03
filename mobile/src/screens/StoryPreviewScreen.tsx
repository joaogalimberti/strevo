import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, Share } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../config/api';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { ChevronLeft, Download, Share2, CheckCircle } from 'lucide-react-native';

const STYLES = ['dark minimal', 'neon fitness', 'clean white'];

export default function StoryPreviewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { workoutId, photoBase64 } = route.params as any;
  const [style, setStyle] = useState('dark minimal');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchStory = async (selectedStyle: string) => {
    setLoading(true);
    setSuccess(false);
    try {
      const payload: any = { workoutId, style: selectedStyle };
      if (photoBase64) payload.photoBase64 = photoBase64;
      
      const { data } = await api.post('/stories/generate', payload);
      setImageUrl(data.imageUrl);
    } catch (e) {
      console.log(e);
      Alert.alert('Generation Failed', 'Failed to generate your story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStory(style);
  }, [style]);

  const handleSaveAndShare = async () => {
    if (!imageUrl) return;
    setProcessing(true);
    try {
      // 1. Request Permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need access to your gallery to save the story.');
        setProcessing(false);
        return;
      }

      // 2. Prepare URL
      const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${api.defaults.baseURL}${imageUrl}`;
      const fileUri = `${FileSystem.cacheDirectory}strevo_story_${Date.now()}.png`;

      // 3. Download Image (using non-deprecated approach if possible, or reliable resumable)
      const downloadResumable = FileSystem.createDownloadResumable(fullUrl, fileUri);
      const downloadResult = await downloadResumable.downloadAsync();

      if (!downloadResult || !downloadResult.uri) {
        throw new Error('Download failed');
      }

      // 4. Save to Media Library
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      const album = await MediaLibrary.getAlbumAsync('STREVO');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('STREVO', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      setSuccess(true);

      // 5. Share
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share your STREVO Story',
          UTI: 'public.png',
        });
      } else {
        Alert.alert('Saved!', 'Story saved to STREVO album in your gallery.');
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to save or share the story. Please check your connection and permissions.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview Story</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.imageContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00FFCC" />
            <Text style={styles.loadingText}>Generating your story...</Text>
          </View>
        ) : (
          imageUrl && (
            <Image 
              source={{ uri: imageUrl.startsWith('http') ? imageUrl : `${api.defaults.baseURL}${imageUrl}` }} 
              style={styles.image} 
              resizeMode="contain" 
            />
          )
        )}
      </View>

      <View style={styles.controls}>
        <Text style={styles.label}>CHOOSE A STYLE</Text>
        <View style={styles.stylesRow}>
          {STYLES.map(s => (
            <TouchableOpacity 
              key={s} 
              onPress={() => setStyle(s)}
              style={[styles.styleBtnBox, style === s && styles.styleBtnActiveBox]}
            >
              <Text style={[styles.styleBtnText, style === s && styles.styleBtnActiveText]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.shareBtn, success && styles.successBtn]} 
          onPress={handleSaveAndShare}
          disabled={processing || loading}
        >
          {processing ? (
            <ActivityIndicator color="#111" />
          ) : success ? (
            <View style={styles.btnInner}>
              <CheckCircle color="#111" size={20} />
              <Text style={styles.shareText}>SAVED & SHARED</Text>
            </View>
          ) : (
            <View style={styles.btnInner}>
              <Share2 color="#111" size={20} />
              <Text style={styles.shareText}>SAVE & SHARE</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Home' as never)} 
          style={styles.doneBtn}
          disabled={processing}
        >
          <Text style={styles.doneText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50 },
  backBtn: { backgroundColor: '#111', padding: 10, borderRadius: 12 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  
  imageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  image: { width: '100%', height: '100%', borderRadius: 20 },
  loadingContainer: { alignItems: 'center' },
  loadingText: { color: '#888', marginTop: 15, fontSize: 16 },

  controls: { padding: 30, backgroundColor: '#0A0A0A', borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 1, borderColor: '#222' },
  label: { color: '#444', fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 15, textAlign: 'center' },
  stylesRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 30 },
  styleBtnBox: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, backgroundColor: '#111', borderWidth: 1, borderColor: '#222' },
  styleBtnActiveBox: { backgroundColor: '#00FFCC', borderColor: '#00FFCC' },
  styleBtnText: { color: '#666', textTransform: 'capitalize', fontWeight: 'bold' },
  styleBtnActiveText: { color: '#111' },

  shareBtn: { backgroundColor: '#00FFCC', padding: 20, borderRadius: 100, alignItems: 'center' },
  successBtn: { backgroundColor: '#50FA7B' },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  shareText: { color: '#111', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  
  doneBtn: { marginTop: 20, padding: 10 },
  doneText: { color: '#444', textAlign: 'center', fontWeight: 'bold' }
});
