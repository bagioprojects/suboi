import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, moderateScale, scale } from '@/core/theme';
import { soundService } from '@/core/audio/sound.service';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AppButtonComponent: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const pressScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const handlePressIn = () => {
    if (disabled || loading) return;
    pressScale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (disabled || loading) return;
    soundService.playClick();
    onPress();
  };

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'accent':
        return {
          container: {
            backgroundColor: Colors.accent,
            borderColor: Colors.accent,
          },
          text: { color: Colors.textInverse },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: Colors.surfaceSubtle,
            borderColor: Colors.borderHairline,
          },
          text: { color: Colors.textPrimary },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: Colors.surface,
            borderColor: Colors.borderHairline,
            borderWidth: Spacing.hairlineWidth,
          },
          text: { color: Colors.textPrimary },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          },
          text: { color: Colors.primary },
        };
      case 'success':
        return {
          container: {
            backgroundColor: Colors.success,
            borderColor: Colors.success,
          },
          text: { color: Colors.textInverse },
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: Colors.primary,
            borderColor: Colors.primary,
          },
          text: { color: Colors.textInverse },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: 7,
            paddingHorizontal: scale(10),
            minHeight: 34,
          },
          text: { fontSize: moderateScale(13), lineHeight: moderateScale(16), fontWeight: '600' },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: 13,
            paddingHorizontal: scale(18),
            minHeight: 50,
          },
          text: { fontSize: moderateScale(16), lineHeight: moderateScale(21), fontWeight: '600' },
        };
      case 'md':
      default:
        return {
          container: {
            paddingVertical: 10,
            paddingHorizontal: scale(14),
            minHeight: Spacing.minTouchTarget,
          },
          text: { fontSize: moderateScale(14), lineHeight: moderateScale(19), fontWeight: '600' },
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.baseButton,
        vStyles.container,
        sStyles.container,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'secondary' || variant === 'ghost' ? Colors.primary : Colors.textInverse}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <>{icon}</>}
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.baseText,
              vStyles.text,
              sStyles.text,
              icon && iconPosition === 'left' ? { marginLeft: 6 } : undefined,
              icon && iconPosition === 'right' ? { marginRight: 6 } : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && <>{icon}</>}
        </>
      )}
    </AnimatedPressable>
  );
};

export const AppButton = React.memo(AppButtonComponent);

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: Spacing.radiusInner,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  baseText: {
    ...Typography.body,
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 1,
  },
  disabled: {
    opacity: 0.45,
  },
});
