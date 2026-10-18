import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '@/core/theme';
import { soundService } from '@/core/audio/sound.service';
import { useAppStore } from '@/core/store/app.store';
import { ShieldCheck, ChevronRight, Sparkles } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Stage & Spotlight Geometry
const LOGO_CX = SCREEN_WIDTH * 0.5;
const LOGO_CY = SCREEN_HEIGHT * 0.44;

const BEAM_SRC_1 = { x: SCREEN_WIDTH * 0.12, y: -30 }; // Top-Left Cyan Beam Origin
const BEAM_SRC_2 = { x: SCREEN_WIDTH * 0.88, y: -30 }; // Top-Right Violet Beam Origin

const TOTAL_SPLASH_DURATION = 3000; // Locked 3.0 Seconds

const STATUS_MESSAGES = [
  'Kurumsal sahne & altyapı hazırlanıyor...',
  'Güvenlik ve anahtarlar doğrulanıyor...',
  'Executive Portal 2026 hazır!',
];

export default function AnimatedSplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAppStore();

  const [statusText, setStatusText] = useState(STATUS_MESSAGES[0]);

  // Master Choreography Timeline Shared Value (0.0 to 1.0 over 3000ms)
  const masterTimeline = useSharedValue(0);

  // Wallpaper Ambient Breathing
  const wallpaperScale = useSharedValue(1.0);
  const wallpaperOpacity = useSharedValue(0);
  const contentFade = useSharedValue(0);
  const pulseOpacity = useSharedValue(0.4);

  useEffect(() => {
    // 1. Play entrance sound & pop
    soundService.playPop();

    // 2. Initial Smooth Fade-in
    wallpaperOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) });
    contentFade.value = withTiming(1, { duration: 600 });

    // 3. Subtle 3D Ambient Breathing
    wallpaperScale.value = withRepeat(
      withSequence(
        withTiming(1.035, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.0, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: 800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.35, { duration: 800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // 4. Master 3000ms Choreography
    masterTimeline.value = withTiming(1, {
      duration: TOTAL_SPLASH_DURATION,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    const timer1 = setTimeout(() => {
      setStatusText(STATUS_MESSAGES[1]);
    }, 1100);

    const timer2 = setTimeout(() => {
      setStatusText(STATUS_MESSAGES[2]);
    }, 2200);

    // 5. Completion chime and transition at exactly 3.0s
    const exitTimer = setTimeout(() => {
      soundService.playSuccess();
      finishSplash();
    }, TOTAL_SPLASH_DURATION);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(exitTimer);
    };
  }, []);

  const finishSplash = () => {
    if (user) {
      router.replace('/(tabs)/dashboard');
    } else {
      router.replace('/(auth)/login');
    }
  };

  // --- REANIMATED WORKLETS FOR DUAL VOLUMETRIC SPOTLIGHTS ---

  // Spotlight 1 (Electric Cyan/Cobalt) Ground Pool
  const animatedSpot1Style = useAnimatedStyle(() => {
    'worklet';
    const t = masterTimeline.value; // 0 to 1

    // Orbit angle: 0 to 2.25 * PI
    const angle = t * Math.PI * 2.25;

    // Radius: 130px initially, spirals down to 0 between t = 0.65 and 0.85
    let r = 130;
    if (t > 0.65 && t <= 0.86) {
      const conv = (t - 0.65) / 0.21;
      r = 130 * (1 - conv);
    } else if (t > 0.86) {
      r = 0;
    }

    const x = LOGO_CX + r * Math.cos(angle) - 100; // Center offset for 200px spot
    const y = LOGO_CY + 0.58 * r * Math.sin(angle) - 100;

    // Opacity
    let op = 0;
    if (t < 0.12) {
      op = (t / 0.12) * 0.85;
    } else if (t <= 0.86) {
      op = 0.85;
    } else {
      op = 0.85 * (1 - (t - 0.86) / 0.14);
    }

    const scale = 0.95 + 0.12 * Math.sin(angle * 2);

    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { scale },
      ],
      opacity: op,
    };
  });

  // Spotlight 2 (Vivid Violet/Magenta) Ground Pool
  const animatedSpot2Style = useAnimatedStyle(() => {
    'worklet';
    const t = masterTimeline.value;

    // Opposite phase: angle + PI
    const angle = t * Math.PI * 2.25 + Math.PI;

    let r = 130;
    if (t > 0.65 && t <= 0.86) {
      const conv = (t - 0.65) / 0.21;
      r = 130 * (1 - conv);
    } else if (t > 0.86) {
      r = 0;
    }

    const x = LOGO_CX + r * Math.cos(angle) - 100;
    const y = LOGO_CY + 0.58 * r * Math.sin(angle) - 100;

    let op = 0;
    if (t < 0.12) {
      op = (t / 0.12) * 0.85;
    } else if (t <= 0.86) {
      op = 0.85;
    } else {
      op = 0.85 * (1 - (t - 0.86) / 0.14);
    }

    const scale = 0.95 + 0.12 * Math.cos(angle * 2);

    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { scale },
      ],
      opacity: op,
    };
  });

  // Volumetric Cone 1 (Top-Left Cyan Light Beam)
  const animatedBeam1Style = useAnimatedStyle(() => {
    'worklet';
    const t = masterTimeline.value;
    const angle = t * Math.PI * 2.25;

    let r = 130;
    if (t > 0.65 && t <= 0.86) {
      const conv = (t - 0.65) / 0.21;
      r = 130 * (1 - conv);
    } else if (t > 0.86) {
      r = 0;
    }

    const targetX = LOGO_CX + r * Math.cos(angle);
    const targetY = LOGO_CY + 0.58 * r * Math.sin(angle);

    const dx = targetX - BEAM_SRC_1.x;
    const dy = targetY - BEAM_SRC_1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Beam angle relative to vertical axis
    const beamAngle = Math.atan2(dx, dy);

    let op = 0;
    if (t < 0.12) {
      op = (t / 0.12) * 0.75;
    } else if (t <= 0.86) {
      op = 0.75;
    } else {
      op = 0.75 * (1 - (t - 0.86) / 0.14);
    }

    return {
      left: BEAM_SRC_1.x - 140, // 280px width centered on source
      top: BEAM_SRC_1.y,
      height: dist * 1.05,
      transform: [
        { rotate: `${-beamAngle}rad` },
      ],
      opacity: op,
    };
  });

  // Volumetric Cone 2 (Top-Right Violet Light Beam)
  const animatedBeam2Style = useAnimatedStyle(() => {
    'worklet';
    const t = masterTimeline.value;
    const angle = t * Math.PI * 2.25 + Math.PI;

    let r = 130;
    if (t > 0.65 && t <= 0.86) {
      const conv = (t - 0.65) / 0.21;
      r = 130 * (1 - conv);
    } else if (t > 0.86) {
      r = 0;
    }

    const targetX = LOGO_CX + r * Math.cos(angle);
    const targetY = LOGO_CY + 0.58 * r * Math.sin(angle);

    const dx = targetX - BEAM_SRC_2.x;
    const dy = targetY - BEAM_SRC_2.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const beamAngle = Math.atan2(dx, dy);

    let op = 0;
    if (t < 0.12) {
      op = (t / 0.12) * 0.75;
    } else if (t <= 0.86) {
      op = 0.75;
    } else {
      op = 0.75 * (1 - (t - 0.86) / 0.14);
    }

    return {
      left: BEAM_SRC_2.x - 140,
      top: BEAM_SRC_2.y,
      height: dist * 1.05,
      transform: [
        { rotate: `${-beamAngle}rad` },
      ],
      opacity: op,
    };
  });

  // Prismatic Convergence Flare (Center Starburst upon Merger at t = 2200ms - 3000ms)
  const animatedFlareStyle = useAnimatedStyle(() => {
    'worklet';
    const t = masterTimeline.value;

    let scale = 0;
    let opacity = 0;

    if (t >= 0.72 && t < 0.84) {
      // Rapid blooming flash
      const p = (t - 0.72) / 0.12;
      scale = 0.4 + 1.1 * p;
      opacity = p * 0.95;
    } else if (t >= 0.84) {
      // Radiance sustain
      const p = (t - 0.84) / 0.16;
      scale = 1.5 - 0.2 * p;
      opacity = 0.95 - 0.35 * p;
    }

    return {
      transform: [
        { translateX: LOGO_CX - 128 },
        { translateY: LOGO_CY - 128 },
        { scale },
        { rotate: `${t * 45}deg` },
      ],
      opacity,
    };
  });

  const animatedWallpaperStyle = useAnimatedStyle(() => ({
    transform: [{ scale: wallpaperScale.value }],
    opacity: wallpaperOpacity.value,
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${masterTimeline.value * 100}%`,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentFade.value,
  }));

  return (
    <View style={styles.container}>
      {/* 1. Master 3D Vertical Wallpaper (Aspect-Ratio Agnostic) */}
      <Animated.View style={[styles.wallpaperWrapper, animatedWallpaperStyle]}>
        <Image
          source={require('../../assets/splash/hubio_3d_splash_wallpaper.png')}
          style={styles.wallpaperImage}
          contentFit="contain"
          priority="high"
        />
      </Animated.View>

      {/* 2. Volumetric Light Cones (Projected from Top Angles) */}
      <Animated.View style={[styles.beamWrapper, animatedBeam1Style]}>
        <Image
          source={require('../../assets/splash/spotlight_cone_cyan.png')}
          style={styles.beamImage}
          contentFit="fill"
        />
      </Animated.View>

      <Animated.View style={[styles.beamWrapper, animatedBeam2Style]}>
        <Image
          source={require('../../assets/splash/spotlight_cone_violet.png')}
          style={styles.beamImage}
          contentFit="fill"
        />
      </Animated.View>

      {/* 3. Circular Ground Spotlights (Orbiting & Converging around Logo) */}
      <Animated.View style={[styles.spotlightPool, animatedSpot1Style]}>
        <Image
          source={require('../../assets/splash/spotlight_radial_cyan.png')}
          style={styles.spotlightImage}
          contentFit="contain"
        />
      </Animated.View>

      <Animated.View style={[styles.spotlightPool, animatedSpot2Style]}>
        <Image
          source={require('../../assets/splash/spotlight_radial_violet.png')}
          style={styles.spotlightImage}
          contentFit="contain"
        />
      </Animated.View>

      {/* 4. Prismatic Convergence Lens Flare (Merger Starburst) */}
      <Animated.View style={[styles.flareWrapper, animatedFlareStyle]}>
        <Image
          source={require('../../assets/splash/spotlight_convergence_flare.png')}
          style={styles.flareImage}
          contentFit="contain"
        />
      </Animated.View>

      {/* 5. Top Bar with Skip Action & Security Status */}
      <Animated.View
        style={[
          styles.topBar,
          animatedContentStyle,
          { top: Math.max(insets.top + 8, Platform.OS === 'android' ? 24 : 16) },
        ]}
      >
        <View style={styles.versionBadge}>
          <ShieldCheck size={12} color="#38BDF8" />
          <Text style={styles.versionText}>HUBIO OS • v2026.4</Text>
        </View>

        <Pressable
          style={styles.skipBtn}
          onPress={() => {
            soundService.playClick();
            finishSplash();
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.skipText}>Geç</Text>
          <ChevronRight size={13} color="#94A3B8" />
        </Pressable>
      </Animated.View>

      {/* 6. Bottom Micro Status Indicator (Synchronized 3-second Timeline) */}
      <Animated.View
        style={[
          styles.bottomContainer,
          animatedContentStyle,
          { paddingBottom: Math.max(insets.bottom + 20, 28) },
        ]}
      >
        {/* Pulsing Status Pill */}
        <View style={styles.statusPill}>
          <Animated.View style={[styles.statusDot, animatedPulseStyle]} />
          <Text style={styles.statusLabel} numberOfLines={1}>
            {statusText}
          </Text>
        </View>

        {/* Minimal Hairline Progress */}
        <View style={styles.hairlineTrack}>
          <Animated.View style={[styles.hairlineFill, animatedProgressStyle]} />
        </View>

        {/* Enterprise Security Subtitle */}
        <Text style={styles.securityText}>
          Enterprise 256-bit AES • Bridgeless Native Engine
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03050d',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  wallpaperWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wallpaperImage: {
    width: '100%',
    height: '100%',
  },
  beamWrapper: {
    position: 'absolute',
    width: 280,
    transformOrigin: 'top center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  beamImage: {
    width: '100%',
    height: '100%',
  },
  spotlightPool: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    zIndex: 12,
    pointerEvents: 'none',
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
  },
  flareWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 256,
    height: 256,
    zIndex: 15,
    pointerEvents: 'none',
  },
  flareImage: {
    width: '100%',
    height: '100%',
  },
  topBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 25,
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderColor: 'rgba(56, 189, 248, 0.25)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  versionText: {
    ...Typography.caption,
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
  },
  skipText: {
    ...Typography.caption,
    fontSize: 11,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 25,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    marginBottom: 10,
    minHeight: 28,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  hairlineTrack: {
    width: 140,
    height: 2,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: 8,
  },
  hairlineFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 1,
  },
  securityText: {
    ...Typography.caption,
    fontSize: 9,
    color: '#475569',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
