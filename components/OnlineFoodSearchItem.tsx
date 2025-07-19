import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Plus, X } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';
import { useNutriStore } from '@/hooks/useNutriStore';
import { FoodItem } from '@/types';
import { SimplifiedFoodItem } from '@/utils/foodApi';

interface OnlineFoodSearchItemProps {
  item: SimplifiedFoodItem;
}

const OnlineFoodSearchItem: React.FC<OnlineFoodSearchItemProps> = ({ item }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState('100');
  const { addFoodItem } = useNutriStore();
  const { t, isRTL } = useLanguage();
  
  const calculatedCalories = Math.round((parseInt(quantity) || 0) * item.caloriesPer100g / 100);
  const calculatedProtein = Math.round(((parseInt(quantity) || 0) * item.proteinPer100g / 100) * 10) / 10;
  
  const handleAddFood = () => {
    const newFood: FoodItem = {
      id: `${item.id}-${Date.now()}`,
      name: item.brand ? `${item.name} (${item.brand})` : item.name,
      calories: calculatedCalories,
      protein: calculatedProtein,
      timestamp: Date.now(),
      quantity: parseInt(quantity) || 0,
    };
    
    addFoodItem(newFood);
    setModalVisible(false);
  };
  
  return (
    <>
      <Pressable 
        style={[styles.container, isRTL && styles.rtlContainer]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.infoContainer}>
          <Text style={[styles.name, isRTL && styles.rtlText]} numberOfLines={2}>
            {item.name}
          </Text>
          {item.brand && (
            <Text style={[styles.brand, isRTL && styles.rtlText]} numberOfLines={1}>
              {item.brand}
            </Text>
          )}
          <Text style={[styles.nutritionInfo, isRTL && styles.rtlText]}>
            {item.caloriesPer100g} {t('kcal')}, {item.proteinPer100g}{t('gProtein')} {t('per100g')}
          </Text>
        </View>
        
        <Pressable 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={20} color={Colors.white} />
        </Pressable>
      </Pressable>
      
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, isRTL && styles.rtlModalHeader]}>
              <Text style={[styles.modalTitle, isRTL && styles.rtlText]} numberOfLines={2}>
                {t('addFood')} {item.name}
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <X size={24} color={Colors.textDark} />
              </Pressable>
            </View>
            
            {item.brand && (
              <Text style={[styles.modalBrand, isRTL && styles.rtlText]}>{item.brand}</Text>
            )}
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, isRTL && styles.rtlText]}>{t('quantity')}</Text>
              <TextInput
                style={[styles.input, isRTL && styles.rtlInput]}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder={t('enterQuantity')}
              />
            </View>
            
            <View style={styles.nutritionContainer}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{calculatedCalories}</Text>
                <Text style={[styles.nutritionLabel, isRTL && styles.rtlText]}>{t('calories')}</Text>
              </View>
              
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{calculatedProtein}</Text>
                <Text style={[styles.nutritionLabel, isRTL && styles.rtlText]}>{t('gProtein')}</Text>
              </View>
              
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>
                  {Math.round(((parseInt(quantity) || 0) * item.fatPer100g / 100) * 10) / 10}
                </Text>
                <Text style={[styles.nutritionLabel, isRTL && styles.rtlText]}>{t('gFat')}</Text>
              </View>
              
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>
                  {Math.round(((parseInt(quantity) || 0) * item.carbsPer100g / 100) * 10) / 10}
                </Text>
                <Text style={[styles.nutritionLabel, isRTL && styles.rtlText]}>{t('gCarbs')}</Text>
              </View>
            </View>
            
            <Pressable style={styles.addFoodButton} onPress={handleAddFood}>
              <Text style={styles.addFoodButtonText}>{t('addFoodButton')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  rtlContainer: {
    flexDirection: 'row-reverse',
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textDark,
    marginBottom: 2,
  },
  rtlText: {
    textAlign: 'right',
  },
  brand: {
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 2,
    fontWeight: '500',
  },
  nutritionInfo: {
    fontSize: 12,
    color: Colors.textLight,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  rtlModalHeader: {
    flexDirection: 'row-reverse',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
    flex: 1,
    marginRight: 12,
  },
  modalBrand: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textDark,
    marginBottom: 8,
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
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  nutritionItem: {
    alignItems: 'center',
    minWidth: '22%',
    marginBottom: 8,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  nutritionLabel: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  addFoodButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  addFoodButtonText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnlineFoodSearchItem;