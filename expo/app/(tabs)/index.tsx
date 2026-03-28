import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';

import AdBanner from '@/components/AdBanner';
import DailyProgress from '@/components/DailyProgress';
import EditGoalsModal from '@/components/EditGoalsModal';
import FoodItem from '@/components/FoodItem';
import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';
import { useNutriStore } from '@/hooks/useNutriStore';

export default function DashboardScreen() {
  const { todayFoods, isLoading } = useNutriStore();
  const { t, isRTL } = useLanguage();
  const [goalsModalVisible, setGoalsModalVisible] = useState(false);
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: t('appName'),
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
      
      <AdBanner />
      
      <DailyProgress onEditGoals={() => setGoalsModalVisible(true)} />
      
      <View style={styles.foodListContainer}>
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
          {t('todaysFood')}
        </Text>
        
        {todayFoods.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, isRTL && styles.rtlText]}>
              {t('noFoodLogged')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={todayFoods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FoodItem item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
      
      <EditGoalsModal
        visible={goalsModalVisible}
        onClose={() => setGoalsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 8,
  },
  foodListContainer: {
    flex: 1,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  rtlText: {
    textAlign: 'right',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textLight,
  },
});