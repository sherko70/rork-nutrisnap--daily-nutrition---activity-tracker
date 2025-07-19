import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';

import AdBanner from '@/components/AdBanner';
import HistoryChart from '@/components/HistoryChart';
import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';
import { useNutriStore } from '@/hooks/useNutriStore';
import { DailyLog } from '@/types';
import { getMonthDates, getWeekDates } from '@/utils/dateUtils';

type Period = 'daily' | 'weekly' | 'monthly';

export default function HistoryScreen() {
  const { history } = useNutriStore();
  const { t } = useLanguage();
  const [activePeriod, setActivePeriod] = useState<Period>('daily');
  
  // Get dates for the selected period
  const getDatesForPeriod = (): string[] => {
    switch (activePeriod) {
      case 'daily':
        return [new Date().toISOString().split('T')[0]];
      case 'weekly':
        return getWeekDates();
      case 'monthly':
        return getMonthDates();
      default:
        return [];
    }
  };
  
  // Get data for the selected period
  const getDataForPeriod = (): DailyLog[] => {
    const dates = getDatesForPeriod();
    return dates
      .map(date => history[date])
      .filter(Boolean)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  const data = getDataForPeriod();
  const hasData = data.length > 0;
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: t('history'),
          headerStyle: {
            backgroundColor: Colors.headerBackground,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            color: Colors.textDark,
          },
        }} 
      />
      
      <AdBanner onPress={() => console.log('History screen ad clicked!')} />
      
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, activePeriod === 'daily' && styles.activeTab]}
          onPress={() => setActivePeriod('daily')}
        >
          <Text
            style={[
              styles.tabText,
              activePeriod === 'daily' && styles.activeTabText,
            ]}
          >
            Daily
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.tab, activePeriod === 'weekly' && styles.activeTab]}
          onPress={() => setActivePeriod('weekly')}
        >
          <Text
            style={[
              styles.tabText,
              activePeriod === 'weekly' && styles.activeTabText,
            ]}
          >
            Weekly
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.tab, activePeriod === 'monthly' && styles.activeTab]}
          onPress={() => setActivePeriod('monthly')}
        >
          <Text
            style={[
              styles.tabText,
              activePeriod === 'monthly' && styles.activeTabText,
            ]}
          >
            Monthly
          </Text>
        </Pressable>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {hasData ? (
          <>
            <HistoryChart data={data} type="calories" />
            <HistoryChart data={data} type="protein" />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No History Data</Text>
            <Text style={styles.emptyStateText}>
              Start tracking your nutrition to see your progress over time.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLight,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    paddingVertical: 16,
    paddingBottom: 32,
  },
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});