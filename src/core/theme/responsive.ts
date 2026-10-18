import { useState, useEffect } from 'react';
import { Dimensions, Platform, ScaledSize } from 'react-native';

// Base guideline viewport dimensions (iPhone 14 / 15 / 16 standard viewport)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Gets current window dimensions safely
 */
export const getWindowDimensions = (): ScaledSize => {
  return Dimensions.get('window');
};

/**
 * Horizontal scale based on window width
 */
export const scale = (size: number): number => {
  if (Platform.OS === 'web') return size;
  const { width } = getWindowDimensions();
  return Math.round((width / BASE_WIDTH) * size);
};

/**
 * Vertical scale based on window height
 */
export const verticalScale = (size: number): number => {
  if (Platform.OS === 'web') return size;
  const { height } = getWindowDimensions();
  return Math.round((height / BASE_HEIGHT) * size);
};

/**
 * Moderate scale for typography and icons
 * Factor (default 0.5) controls how aggressively the size scales up or down
 */
export const moderateScale = (size: number, factor = 0.5): number => {
  if (Platform.OS === 'web') return size;
  const scaled = scale(size);
  return Math.round(size + (scaled - size) * factor);
};

/**
 * Device size classification flags
 */
export const getDeviceCategory = (width: number) => {
  return {
    isSmallDevice: width < 380,   // iPhone SE, small Android devices (<=375px)
    isMediumDevice: width >= 380 && width < 420, // Standard iPhones & standard Androids
    isLargeDevice: width >= 420 && width < 768,  // Plus / Max / Pro Max / Ultra phones
    isTablet: width >= 768,      // iPad & tablets
  };
};

/**
 * React hook to listen for screen size changes and provide responsive metrics
 */
export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(getWindowDimensions);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    });
    return () => subscription.remove();
  }, []);

  const { width, height } = dimensions;
  const categories = getDeviceCategory(width);

  return {
    width,
    height,
    ...categories,
    scale: (size: number) => (Platform.OS === 'web' ? size : Math.round((width / BASE_WIDTH) * size)),
    verticalScale: (size: number) => (Platform.OS === 'web' ? size : Math.round((height / BASE_HEIGHT) * size)),
    moderateScale: (size: number, factor = 0.5) => {
      if (Platform.OS === 'web') return size;
      const sc = Math.round((width / BASE_WIDTH) * size);
      return Math.round(size + (sc - size) * factor);
    },
  };
};
