import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';
import { useNutriStore } from '@/hooks/useNutriStore';
import ProgressChart from './ProgressChart';

interface DailyProgressProps {
  onEditGoals: () => void;
}

const DailyProgress: React.FC<DailyProgressProps> = ({ onEditGoals }) => {
  const { goals, getTodayTotals } = useNutriStore();
  const { t, isRTL } = useLanguage();
  const todayTotals = getTodayTotals();
  
  const caloriesProgress = goals.calories > 0 ? todayTotals.calories / goals.calories : 0;
  const proteinProgress = goals.protein > 0 ? todayTotals.protein / goals.protein : 0;
  
  return (
    <Pressable style={styles.container} onPress={onEditGoals}>
      <Text style={[styles.title, isRTL && styles.rtlText]}>
        {t('todaysProgress')}
      </Text>
      
      <View style={styles.chartsContainer}>
        <ProgressChart
          progress={caloriesProgress}
          size={120}
          strokeWidth={12}
          color={Colors.caloriesColor}
          label={t('calories')}
          value={`${todayTotals.calories}`}
          target={`${goals.calories}`}
        />
        
        <ProgressChart
          progress={proteinProgress}
          size={120}
          strokeWidth={12}
          color={Colors.proteinColor}
          label={t('protein')}
          value={`${todayTotals.protein}g`}
          target={`${goals.protein}g`}
        />
      </View>
      
      <Text style={[styles.tapHint, isRTL && styles.rtlText]}>
        {t('tapToEditGoals')}
      </Text>
    </Pressable>
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
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'center', // Keep centered for this component
  },
  chartsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  tapHint: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default DailyProgress;