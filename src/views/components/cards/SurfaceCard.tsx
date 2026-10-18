import React from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing } from '@/core/theme';

interface SurfaceCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: 'standard' | 'large' | 'compact' | 'none';
  variant?: 'default' | 'elevated' | 'tinted' | 'accentSubtle';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const SurfaceCard: React.FC<SurfaceCardProps> = React.memo(({
  children,
  style,
  onPress,
  padding = 'standard',
  variant = 'default',
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!onPress) return;
    scale.value = withSpring(0.985, { damping: 18, stiffness: 350 });
  };

  const handlePressOut = () => {
    if (!onPress) return;
    scale.value = withSpring(1, { damping: 18, stiffness: 350 });
  };

  const handlePress = () => {
    if (!onPress) return;
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      } catch {
        // Safe fallback
      }
    }
    onPress();
  };

  const getPaddingStyle = (): ViewStyle => {
    switch (padding) {
      case 'large':
        return { padding: Spacing.cardPaddingLarge };
      case 'compact':
        return { padding: 12 };
      case 'none':
        return { padding: 0 };
      case 'standard':
      default:
        return { padding: Spacing.cardPadding };
    }
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'tinted':
        return {
          backgroundColor: Colors.surfaceSubtle,
          borderColor: Colors.borderHairline,
        };
      case 'accentSubtle':
        return {
          backgroundColor: Colors.primaryLight,
          borderColor: '#BFDBFE',
        };
      case 'elevated':
        return {
          backgroundColor: Colors.surface,
          borderColor: Colors.borderHairline,
          ...Platform.select({
            ios: {
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
            },
            android: {
              elevation: 2,
            },
            web: {
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
            },
          }),
        };
      case 'default':
      default:
        return {
          backgroundColor: Colors.surface,
          borderColor: Colors.borderHairline,
        };
    }
  };

  const cardStyle = [
    styles.card,
    getPaddingStyle(),
    getVariantStyle(),
    style,
  ];

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[cardStyle, animatedStyle]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
});

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.radiusCard,
    borderWidth: Spacing.hairlineWidth,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
});
