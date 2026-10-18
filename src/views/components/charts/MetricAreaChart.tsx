import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import { DataPoint } from '@/models/seo-geo.model';
import { Colors, Typography, Spacing } from '@/core/theme';
import * as Haptics from 'expo-haptics';

interface MetricAreaChartProps {
  data: DataPoint[];
  color?: string;
  unit?: string;
  activePoint?: DataPoint | null;
  onPointSelect?: (point: DataPoint) => void;
  height?: number;
}

export const MetricAreaChart: React.FC<MetricAreaChartProps> = React.memo(({
  data,
  color = Colors.primary,
  unit = '%',
  activePoint,
  onPointSelect,
  height = 190,
}) => {
  const [containerWidth, setContainerWidth] = useState(320);

  const { minVal, maxVal, range } = useMemo(() => {
    if (!data || data.length === 0) return { minVal: 0, maxVal: 1, range: 1 };
    const values = data.map((d) => d.value);
    const min = Math.min(...values) * 0.92;
    const max = Math.max(...values) * 1.05;
    return { minVal: min, maxVal: max, range: max - min || 1 };
  }, [data]);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) {
      setContainerWidth(w);
    }
  }, []);

  const chartWidth = Math.max(containerWidth, 260);
  const chartHeight = height - 40; // reserved for x-axis labels

  const stepX = chartWidth / (data.length - 1 || 1);

  // Compute points with useMemo
  const points = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((d, index) => {
      const x = index * stepX;
      const y = chartHeight - ((d.value - minVal) / range) * chartHeight;
      return { x, y, dataPoint: d };
    });
  }, [data, stepX, chartHeight, minVal, range]);

  const selectedPoint = activePoint || (data && data.length > 0 ? data[data.length - 1] : null);

  const handleSelect = useCallback((point: DataPoint) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Safe fallback
      }
    }
    onPointSelect?.(point);
  }, [onPointSelect]);

  if (!data || data.length === 0) {
    return <View style={[styles.placeholder, { height }]} />;
  }

  return (
    <View style={styles.wrapper} onLayout={handleLayout}>
      {/* Scrubber Tooltip */}
      {selectedPoint && (
        <View style={styles.tooltipHeader}>
          <View style={styles.tooltipDateBadge}>
            <Text style={styles.tooltipDateText}>{selectedPoint.date}</Text>
          </View>
          <Text style={[styles.tooltipValue, { color }]}>
            {selectedPoint.value}
            {unit}
          </Text>
        </View>
      )}

      {/* SVG-free High Performance Canvas Representation */}
      <View style={[styles.chartArea, { height: chartHeight }]}>
        {/* Horizontal Grid Lines */}
        <View style={[styles.gridLine, { top: 0 }]} />
        <View style={[styles.gridLine, { top: chartHeight * 0.33 }]} />
        <View style={[styles.gridLine, { top: chartHeight * 0.66 }]} />
        <View style={[styles.gridLine, { bottom: 0 }]} />

        {/* Touch Columns for Scrubbing */}
        <View style={styles.touchOverlay}>
          {points.map((pt, idx) => {
            const isSelected = selectedPoint?.label === pt.dataPoint.label;
            const barHeight = Math.max(
              ((pt.dataPoint.value - minVal) / range) * chartHeight,
              12
            );

            return (
              <Pressable
                key={pt.dataPoint.label + idx}
                onPress={() => handleSelect(pt.dataPoint)}
                style={styles.touchCol}
              >
                {/* Vertical Cursor Indicator when active */}
                {isSelected && (
                  <View
                    style={[
                      styles.activeGuideLine,
                      { backgroundColor: color },
                    ]}
                  />
                )}

                {/* Soft Gradient Column Bar */}
                <View
                  style={[
                    styles.areaBar,
                    {
                      height: barHeight,
                      backgroundColor: isSelected
                        ? color
                        : color + '22',
                      borderColor: isSelected ? color : 'transparent',
                    },
                  ]}
                />

                {/* Top Data Node */}
                <View
                  style={[
                    styles.nodeDot,
                    {
                      bottom: barHeight - 4,
                      backgroundColor: isSelected ? Colors.surface : color,
                      borderColor: color,
                      borderWidth: isSelected ? 3 : 2,
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* X-Axis Labels */}
      <View style={styles.xAxis}>
        {data.map((d) => {
          const isSelected = selectedPoint?.label === d.label;
          return (
            <Text
              key={d.label}
              style={[
                styles.xLabel,
                isSelected && { color: color, fontWeight: '700' },
              ]}
            >
              {d.label}
            </Text>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  placeholder: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  tooltipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tooltipDateBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tooltipDateText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tooltipValue: {
    ...Typography.metricNumber,
    fontSize: 22,
    lineHeight: 26,
    fontVariant: ['tabular-nums'],
  },
  chartArea: {
    position: 'relative',
    width: '100%',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  touchOverlay: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
  touchCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    position: 'relative',
  },
  activeGuideLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1.5,
    opacity: 0.6,
  },
  areaBar: {
    width: '55%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 1,
  },
  nodeDot: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  xLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
  },
});
