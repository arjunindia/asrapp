import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { colors } from '../theme';

const { width } = Dimensions.get('window');

// SVG noise pattern as a base64 data URI for grain texture
// This creates a repeatable, subtle noise pattern overlay
const GRAIN_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E`;

interface GrainOverlayProps {
  opacity?: number;
}

export function GrainOverlay({ opacity = 0.035 }: GrainOverlayProps) {
  const opacityAnim = useRef(new Animated.Value(opacity)).current;

  useEffect(() => {
    // Subtle breathing animation on the grain
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: opacity + 0.015,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: opacity,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.grain,
        {
          opacity: opacityAnim,
        },
      ]}
    >
      {/* We render grain via a View with a semi-transparent overlay pattern */}
      {/* In a real app you'd use an Image with the SVG, but here we simulate it */}
    </Animated.View>
  );
}

// Simulate grain with animated semi-transparent overlay pattern
// This creates a visual grain/noise effect using layered semi-transparent views
export function GrainNoise({ opacity = 0.035 }: { opacity?: number }) {
  const dots = useRef(
    Array.from({ length: 400 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * 800,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5,
    }))
  ).current;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {dots.map((dot) => (
        <View
          key={dot.id}
          style={{
            position: 'absolute',
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            borderRadius: dot.size / 2,
            backgroundColor: `rgba(0,0,0,${dot.opacity * opacity})`,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.03)',
    zIndex: 100,
  },
});