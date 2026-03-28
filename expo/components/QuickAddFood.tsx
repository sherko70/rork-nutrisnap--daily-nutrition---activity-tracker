import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';
import { useNutriStore } from '@/hooks/useNutriStore';
import { FoodItem } from '@/types';

const QuickAddFood: React.FC = () => {
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [mealName, setMealName] = useState('');
  const { addFoodItem } = useNutriStore();
  const { t, isRTL } = useLanguage();
  
  const handleAddMeal = () => {
    if (!calories && !protein) return;
    
    const newFood: FoodItem = {
      id: `quick-${Date.now()}`,
      name: mealName || t('quickAddMeal'),
      calories: parseInt(calories) || 0,
      protein: parseFloat(protein) || 0,
      timestamp: Date.now(),
    };
    
    addFoodItem(newFood);
    
    // Reset form
    setCalories('');
    setProtein('');
    setMealName('');
  };
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, isRTL && styles.rtlText]}>{t('quickAdd')}</Text>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, isRTL && styles.rtlText]}>{t('mealName')}</Text>
        <TextInput
          style={[styles.input, isRTL && styles.rtlInput]}
          value={mealName}
          onChangeText={setMealName}
          placeholder={t('enterMealName')}
        />
      </View>
      
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, isRTL && styles.rtlText]}>{t('caloriesGoal')}</Text>
          <TextInput
            style={[styles.input, isRTL && styles.rtlInput]}
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, isRTL && styles.rtlText]}>{t('proteinGoal')}</Text>
          <TextInput
            style={[styles.input, isRTL && styles.rtlInput]}
            value={protein}
            onChangeText={setProtein}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
      </View>
      
      <Pressable 
        style={[
          styles.addButton,
          (!calories && !protein) && styles.disabledButton
        ]}
        onPress={handleAddMeal}
        disabled={!calories && !protein}
      >
        <Text style={styles.addButtonText}>{t('addMeal')}</Text>
      </Pressable>
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
  rtlText: {
    textAlign: 'right',
  },
  inputContainer: {
    marginBottom: 12,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textDark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.textDark,
  },
  rtlInput: {
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: Colors.mediumGray,
  },
  addButtonText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuickAddFood;