import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';

import Colors from '@/constants/colors';
import { DailyLog } from '@/types';
import { formatDateForDisplay } from '@/utils/dateUtils';

interface HistoryChartProps {
  data: DailyLog[];
  type: 'calories' | 'protein';
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data, type }) => {
  const screenWidth = Dimensions.get('window').width - 32; // Padding
  const chartHeight = 200;
  const barWidth = Math.min(30, (screenWidth - (data.length - 1) * 8) / data.length);
  const barGap = 8;
  
  // Get values based on type
  const values = data.map(item => {
    switch (type) {
      case 'calories':
        return item.totalCalories;
      case 'protein':
        return item.totalProtein;
      default:
        return 0;
    }
  });
  
  // Calculate max value for scaling
  const maxValue = Math.max(...values, 1);
  
  // Get color based on type
  const getColor = () => {
    switch (type) {
      case 'calories':
        return Colors.caloriesColor;
      case 'protein':
        return Colors.proteinColor;
      default:
        return Colors.primary;
    }
  };
  
  // Get label based on type
  const getLabel = () => {
    switch (type) {
      case 'calories':
        return 'Calories';
      case 'protein':
        return 'Protein (g)';
      default:
        return '';
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getLabel()}</Text>
      
      <View style={styles.chartContainer}>
        <Svg width={screenWidth} height={chartHeight}>
          {/* Y-axis line */}
          <Line
            x1={30}
            y1={10}
            x2={30}
            y2={chartHeight - 30}
            stroke={Colors.mediumGray}
            strokeWidth={1}
          />
          
          {/* X-axis line */}
          <Line
            x1={30}
            y1={chartHeight - 30}
            x2={screenWidth - 10}
            y2={chartHeight - 30}
            stroke={Colors.mediumGray}
            strokeWidth={1}
          />
          
          {/* Bars */}
          {data.map((item, index) => {
            const value = values[index];
            const barHeight = (value / maxValue) * (chartHeight - 50);
            const x = 40 + index * (barWidth + barGap);
            const y = chartHeight - 30 - barHeight;
            
            return (
              <Rect
                key={item.date}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={getColor()}
                rx={4}
              />
            );
          })}
        </Svg>
        
        {/* Values and dates as React Native Text components for better mobile compatibility */}
        <View style={styles.labelsContainer}>
          {data.map((item, index) => {
            const value = values[index];
            const barHeight = (value / maxValue) * (chartHeight - 50);
            const x = 40 + index * (barWidth + barGap);
            const y = chartHeight - 30 - barHeight;
            
            return (
              <View key={`labels-${item.date}`}>
                {/* Value label */}
                <Text
                  style={[
                    styles.valueLabel,
                    {
                      left: x + barWidth / 2 - 15,
                      top: y - 20,
                    }
                  ]}
                >
                  {value}
                </Text>
                
                {/* Date label */}
                <Text
                  style={[
                    styles.dateLabel,
                    {
                      left: x + barWidth / 2 - 20,
                      top: chartHeight - 25,
                    }
                  ]}
                >
                  {formatDateForDisplay(item.date)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 16,
  },
  chartContainer: {
    height: 200,
    position: 'relative',
  },
  labelsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  valueLabel: {
    position: 'absolute',
    fontSize: 10,
    color: Colors.textDark,
    fontWeight: '500',
    textAlign: 'center',
    width: 30,
  },
  dateLabel: {
    position: 'absolute',
    fontSize: 8,
    color: Colors.textLight,
    textAlign: 'center',
    width: 40,
  },
});

export default HistoryChart;