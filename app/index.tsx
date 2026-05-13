import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, G } from 'react-native-svg';
import { CactusSTT } from 'cactus-react-native';
import { RecordButton } from '../src/components/RecordButton';
import { colors, spacing, radius, typography, shadows, GRAIN_OPACITY } from '../src/theme';

// Fixed grain dots for SSR safety
const GRAIN_DOTS = Array.from({ length: 600 }, (_, i) => ({
  id: i,
  x: (i * 137.5) % 400,
  y: (i * 97.3) % 900,
  size: (i % 3) * 0.5 + 0.5,
  opacity: (i % 5) * 0.1 + 0.1,
}));

export default function HomeScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelStatus, setModelStatus] = useState('Initializing Moonshine...');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const grainOpacity = useRef(new Animated.Value(GRAIN_OPACITY)).current;
  const audioRecorder = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sttRef = useRef<CactusSTT | null>(null);

  // Initialize CactusSTT with Moonshine-Base
  useEffect(() => {
    let mounted = true;

    const initSTT = async () => {
      try {
        // Class-based API: new CactusSTT({ model: 'moonshine-base' })
        const stt = new CactusSTT({ model: 'moonshine-base' });
        sttRef.current = stt;

        // Check if model is already downloaded
        if (mounted) {
          const models = await stt.getModels();
          console.log('Available STT models:', models.map((m) => m.slug));
        }
      } catch (err) {
        console.error('Failed to initialize CactusSTT:', err);
        if (mounted) setModelStatus('STT init failed');
      }
    };

    initSTT();

    return () => {
      mounted = false;
      sttRef.current = null;
    };
  }, []);

  // Grain breathing animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(grainOpacity, {
          toValue: GRAIN_OPACITY + 0.02,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(grainOpacity, {
          toValue: GRAIN_OPACITY,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Download model on mount
  const downloadModel = async () => {
    if (!sttRef.current) return;

    setIsModelLoading(true);
    setModelStatus('Downloading Moonshine-Base model...');

    try {
      await sttRef.current.download({
        onProgress: (progress: number) => {
          setDownloadProgress(progress);
          setModelStatus(`Downloading... ${Math.round(progress * 100)}%`);
        },
      });
      setModelStatus('Initializing model...');

      // Init is called automatically by transcribe, but we can pre-warm it
      await sttRef.current.init();
      setIsModelReady(true);
      setModelStatus('Moonshine STT Ready');
    } catch (err) {
      console.error('Download/init failed:', err);
      setModelStatus('Model download failed — using demo mode');
      // Fall back to demo mode
      setIsModelReady(false);
    } finally {
      setIsModelLoading(false);
    }
  };

  // Trigger download on mount
  useEffect(() => {
    downloadModel();
  }, []);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Microphone access is required for voice capture.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 16kHz mono WAV — matches Moonshine's expected input
      // This is the optimal format for on-device STT
      const recordingOptions = {
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.DEFAULT,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      };

      const { recording } = await Audio.Recording.createAsync(
        recordingOptions as any
      );
      audioRecorder.current = recording;
      setIsRecording(true);
      setRecordingTime(0);
      setTranscribedText('');

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Could not start recording.');
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    let audioUri = '';
    if (audioRecorder.current) {
      await audioRecorder.current.stopAndUnloadAsync();
      audioUri = audioRecorder.current.getURI() || '';
      audioRecorder.current = null;
    }

    setIsRecording(false);

    if (!audioUri) return;

    // Transcribe with CactusSTT
    if (sttRef.current && isModelReady) {
      setIsTranscribing(true);
      setModelStatus('Transcribing...');
      setTranscribedText('');

      try {
        const result = await sttRef.current.transcribe({
          audio: audioUri,
          options: { useVad: true }, // Strip silence automatically
          onToken: (token: string) => {
            // Streaming token callback — text appears as it's generated
            setTranscribedText((prev) => prev + token);
          },
        });

        if (result?.response) {
          setTranscribedText(result.response);
        }
        setModelStatus('Moonshine STT Ready');
      } catch (err) {
        console.error('Transcription failed:', err);
        setModelStatus('Transcription failed — check logs');
      } finally {
        setIsTranscribing(false);
      }
    } else {
      // Demo mode fallback
      setTranscribedText('Moonshine model not ready. Please wait for download to complete.');
      setModelStatus('Model still downloading...');
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Gradient Background */}
      <View style={styles.gradientBg}>
        <View style={styles.gradientTop} />
        <View style={styles.gradientMiddle} />
        <View style={styles.gradientBottom} />
      </View>

      {/* Grain Texture */}
      <Animated.View style={[styles.grainOverlay, { opacity: grainOpacity }]}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="grainGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#2545D3" stopOpacity="0.03" />
              <Stop offset="50%" stopColor="#8B8D98" stopOpacity="0.04" />
              <Stop offset="100%" stopColor="#F18345" stopOpacity="0.03" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grainGrad)" />
          <G opacity={0.5}>
            {GRAIN_DOTS.slice(0, 200).map((dot) => (
              <Circle
                key={dot.id}
                cx={dot.x}
                cy={dot.y}
                r={dot.size}
                fill="rgba(0,0,0,0.4)"
              />
            ))}
          </G>
        </Svg>
      </Animated.View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Capture</Text>
        <View style={styles.headerBadge}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isModelReady
                  ? colors.primary
                  : isTranscribing
                  ? colors.accentCoral
                  : colors.lightGray,
              },
            ]}
          />
          <Text style={styles.statusText}>
            {isTranscribing
              ? 'Transcribing...'
              : isModelLoading
              ? `${Math.round(downloadProgress * 100)}%`
              : isModelReady
              ? 'Moonshine STT'
              : 'Downloading'}
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>

        <View style={styles.transcriptionCard}>
          <Text style={[styles.confirmedText, { opacity: transcribedText ? 1 : 0.4 }]}>
            {isTranscribing
              ? 'Processing audio...'
              : transcribedText || (isRecording ? 'Listening...' : 'Tap the button to start')}
          </Text>

          {/* Cursor */}
          {isRecording && <View style={styles.cursor} />}
        </View>

        {/* Waveform */}
        {isRecording && (
          <View style={styles.waveformContainer}>
            {Array.from({ length: 20 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.waveformBar,
                  {
                    height: Math.random() * 30 + 10,
                    opacity: Math.random() * 0.5 + 0.3,
                  },
                ]}
              />
            ))}
          </View>
        )}

        <Text style={styles.modelStatusText}>{modelStatus}</Text>
      </View>

      {/* Record Button */}
      <View style={styles.buttonContainer}>
        <RecordButton
          isRecording={isRecording}
          onPress={handleRecordPress}
          size={120}
          disabled={isModelLoading && !isModelReady}
        />
        <Text style={styles.recordHint}>
          {isRecording ? 'Tap to stop' : isModelReady ? 'Hold to record' : 'Downloading...'}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Powered by Cactus Compute · Moonshine-Base ASR
        </Text>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.offWhite },
  gradientBg: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  gradientTop: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: height * 0.4, backgroundColor: colors.white,
  },
  gradientMiddle: {
    position: 'absolute', top: height * 0.2, left: 0, right: 0,
    height: height * 0.4, backgroundColor: '#F0F4FF',
  },
  gradientBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: height * 0.5, backgroundColor: '#FEF6F0',
  },
  grainOverlay: {
    ...StyleSheet.absoluteFillObject, zIndex: 1, overflow: 'hidden',
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingTop: spacing.section,
    paddingBottom: spacing.md, zIndex: 10,
  },
  headerTitle: {
    ...typography.h3, color: colors.heading, fontWeight: '600',
  },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: radius.pill,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderWidth: 1, borderColor: colors.lightBorder,
    ...shadows.raised,
  },
  statusDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: colors.primary, marginRight: spacing.xs,
  },
  statusText: {
    ...typography.bodySmall, color: colors.lightGray,
    fontWeight: '500', fontSize: 11,
  },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xxl, zIndex: 10,
  },
  timerText: {
    ...typography.display, color: colors.lightGray,
    marginBottom: spacing.lg, letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  transcriptionCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.xxl, width: '100%', minHeight: 180,
    borderWidth: 1, borderColor: colors.lightBorder,
    ...shadows.elevated, overflow: 'hidden',
  },
  confirmedText: {
    ...typography.body, color: colors.heading, lineHeight: 32,
  },
  cursor: {
    width: 2, height: 24, backgroundColor: colors.primary,
    marginTop: spacing.sm, borderRadius: 1,
  },
  modelStatusText: {
    ...typography.caption, color: colors.veryLightGray,
    marginTop: spacing.md, fontSize: 10,
  },
  waveformContainer: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', height: 60, marginTop: spacing.lg, gap: 3,
  },
  waveformBar: {
    width: 3, backgroundColor: colors.primary, borderRadius: 2,
  },
  buttonContainer: {
    alignItems: 'center', paddingVertical: spacing.xxl, zIndex: 10,
  },
  recordHint: {
    ...typography.bodySmall, color: colors.lightGray,
    marginTop: spacing.md, fontWeight: '500',
  },
  footer: {
    alignItems: 'center', paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl, zIndex: 10,
  },
  footerText: {
    ...typography.caption, color: colors.veryLightGray,
  },
});