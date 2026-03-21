import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import Svg, { Path, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

type BlockedMessageProps = {
  message: string;
  onButtonPress?: () => void;
  buttonText?: string;
};

const BlockedMessageAnimated: React.FC<BlockedMessageProps> = ({ 
  message, 
  onButtonPress, 
  buttonText = 'Go Back to Safety' 
}) => {
  // --- ANIMATION VALUES ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const lockShake = useRef(new Animated.Value(0)).current;
  
  // Bubbles state to avoid ".map is not a function" error
  const [bubbles] = useState(() => 
    Array.from({ length: 10 }).map(() => ({
      x: Math.random() * width,
      y: new Animated.Value(height + 100),
      size: Math.random() * 80 + 40,
      opacity: Math.random() * 0.1 + 0.03,
      speed: Math.random() * 6000 + 4000,
      delay: Math.random() * 2000,
    }))
  );

  useEffect(() => {
    // 1. Entrance Animation (Card and Background Fade)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Lock Shake Animation (Loop)
    Animated.loop(
      Animated.sequence([
        Animated.timing(lockShake, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(lockShake, { toValue: -1, duration: 100, useNativeDriver: true }),
        Animated.timing(lockShake, { toValue: 0, duration: 100, useNativeDriver: true }),
        Animated.delay(3000),
      ])
    ).start();

    // 3. Floating Bubbles Animation
    bubbles.forEach((bubble) => {
      const animateBubble = () => {
        bubble.y.setValue(height + 100);
        Animated.sequence([
          Animated.delay(bubble.delay),
          Animated.timing(bubble.y, {
            toValue: -150,
            duration: bubble.speed,
            useNativeDriver: true,
          }),
        ]).start(() => animateBubble());
      };
      animateBubble();
    });
  }, []);

  // Interpolate shake for the lock icon
  const shakeRotation = lockShake.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* --- PREMIUM DARK BACKGROUND --- */}
      <LinearGradient
        colors={['#050A19', '#0A1229', '#02050D']}
        style={StyleSheet.absoluteFill}
      />

      {/* --- ANIMATED AMBIENT ORBS --- */}
      {bubbles.map((bubble, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bubble,
            {
              width: bubble.size,
              height: bubble.size,
              borderRadius: bubble.size / 2,
              opacity: bubble.opacity,
              transform: [
                { translateX: bubble.x },
                { translateY: bubble.y }
              ],
            },
          ]}
        />
      ))}

      {/* --- GLASSMORPHISM CARD --- */}
      <Animated.View
        style={[
          styles.glassCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.glassInner}>
          
          {/* 1. ANIMATED SECURITY ICON (SVG) */}
          <Animated.View style={{ transform: [{ rotate: shakeRotation }] }}>
            <View style={styles.iconCircle}>
              <Svg width={wScale(45)} height={wScale(45)} viewBox="0 0 24 24" fill="none">
                <Rect x="5" y="11" width="14" height="10" rx="2" stroke="#FF4D4D" strokeWidth="2" />
                <Path 
                  d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" 
                  stroke="#FF4D4D" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
                <Path d="M12 15V17" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </View>
          </Animated.View>

          {/* 2. TEXT CONTENT */}
          <Text style={styles.title}>Access Restricted</Text>
          <View style={styles.divider} />
          
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>

          {/* 3. ACTION BUTTON */}
          <TouchableOpacity 
            style={styles.buttonWrapper} 
            onPress={onButtonPress}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#FF4B4B', '#C62828']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    position: 'absolute',
    backgroundColor: '#3A86FF', // Subtle blue orbs
  },
  glassCard: {
    width: width * 0.86,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  glassInner: {
    padding: wScale(25),
    alignItems: 'center',
  },
  iconCircle: {
    width: wScale(85),
    height: wScale(85),
    borderRadius: wScale(42.5),
    backgroundColor: 'rgba(255, 77, 77, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 77, 77, 0.3)',
    marginBottom: hScale(20),
  },
  title: {
    fontSize: wScale(22),
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  divider: {
    width: wScale(40),
    height: 3,
    backgroundColor: '#FF4D4D',
    borderRadius: 2,
    marginVertical: hScale(15),
  },
  messageBox: {
    marginBottom: hScale(30),
  },
  messageText: {
    fontSize: wScale(15),
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: wScale(22),
    fontWeight: '500',
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: hScale(15),
  },
  gradientButton: {
    paddingVertical: hScale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: wScale(16),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footerBrand: {
    fontSize: wScale(9),
    color: 'rgba(255,255,255,0.25)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: hScale(5),
  },
});

export default BlockedMessageAnimated;