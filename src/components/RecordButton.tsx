import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, shadows, radius } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
  size?: number;
  disabled?: boolean;
}

export function RecordButton({ isRecording, onPress, size = 120, disabled = false }: RecordButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Outer pulsing ring animation
  useEffect(() => {
    if (isRecording) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.stopAnimation();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isRecording]);

  // Inner scale "squish" on press
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const innerSize = size * 0.65;
  const ringSize = size * 1.25;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.touchWrapper, disabled && styles.disabledWrapper]}
    >
      {/* Outer pulse ring */}
      {isRecording && (
        <Animated.View
          style={[
            styles.outerRing,
            {
              // @ts-ignore — Animated multiply with number
              width: ringSize * pulseAnim,
              // @ts-ignore
              height: ringSize * pulseAnim,
              // @ts-ignore
              borderRadius: (ringSize * pulseAnim) / 2,
            },
          ]}
        />
      )}

      {/* Main button body */}
      <Animated.View
        style={[
          styles.buttonBody,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: scaleAnim }],
          },
          isRecording ? shadows.floating : shadows.elevated,
        ]}
      >
        {/* Gradient fill */}
        <View
          style={[
            styles.gradientFill,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: disabled
                ? colors.lightGray
                : isRecording
                ? colors.accentCoral
                : colors.primary,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          {/* Glow effect */}
          <View
            style={{
              width: size * 0.7,
              height: size * 0.7,
              borderRadius: (size * 0.7) / 2,
              backgroundColor: disabled
                ? 'rgba(180,180,180,0.2)'
                : isRecording
                ? 'rgba(241,131,69,0.4)'
                : 'rgba(37,69,211,0.4)',
              opacity: disabled ? 0.3 : 1,
            }}
          />
        </View>

        {/* Center icon placeholder */}
        <View style={styles.centerIcon}>
          <View
            style={[
              styles.iconDot,
              {
                width: innerSize * 0.25,
                height: innerSize * 0.25,
                borderRadius: (innerSize * 0.25) / 2,
                backgroundColor: colors.white,
              },
            ]}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 160,
  },
  disabledWrapper: {
    opacity: 0.5,
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(241,131,69,0.35)',
    backgroundColor: 'rgba(241,131,69,0.05)',
  },
  buttonBody: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gradientFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  centerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDot: {
    // The center dot of the record button
  },
});