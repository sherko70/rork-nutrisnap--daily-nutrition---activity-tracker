import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';

interface ProgressChartProps {
  progress: number; // 0 to 1
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor?: string;
  label: string;
  value: string;
  target: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  progress,
  size,
  strokeWidth,
  color,
  backgroundColor = Colors.lightGray,
  label,
  value,
  target,
}) => {
  const { t, isRTL } = useLanguage();
  
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  
  // Calculate radius and center
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  // Calculate circumference and stroke dash
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clampedProgress);
  
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {Platform.OS !== 'web' ? (
          <Svg width={size} height={size}>
            {/* Background Circle */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={backgroundColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            
            {/* Progress Circle */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              transform={`rotate(-90, ${center}, ${center})`}
            />
          </Svg>
        ) : (
          // Fallback for web using CSS
          <View
            style={[
              styles.webCircle,
              {
                width: size,
                height: size,
                borderWidth: strokeWidth,
                borderColor: backgroundColor,
              }
            ]}
          >
            <View
              style={[
                styles.webProgress,
                {
                  width: size - strokeWidth * 2,
                  height: size - strokeWidth * 2,
                  borderWidth: strokeWidth,
                  borderColor: color,
                  transform: [{ rotate: '-90deg' }],
                }
              ]}
            />
          </View>
        )}
        
        <View style={styles.valueContainer}>
          <Text style={[styles.valueText, { color }]}>{value}</Text>
        </View>
      </View>
      
      <Text style={[styles.label, isRTL && styles.rtlText]}>{label}</Text>
      <Text style={[styles.targetText, isRTL && styles.rtlText]}>
        {t('goal')}: {target}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textDark,
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'center', // Keep centered for charts
  },
  targetText: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
    textAlign: 'center',
  },
  webCircle: {
    borderRadius: 1000,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webProgress: {
    borderRadius: 1000,
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});

export default ProgressChart;