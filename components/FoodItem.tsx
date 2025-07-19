import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Edit2, Trash2, X } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';
import { useNutriStore } from '@/hooks/useNutriStore';
import { FoodItem as FoodItemType } from '@/types';
import { getCurrentDate } from '@/utils/dateUtils';

interface FoodItemProps {
  item: FoodItemType;
}

const FoodItem: React.FC<FoodItemProps> = ({ item }) => {
  const { editFoodItem, deleteFoodItem, currentDate } = useNutriStore();
  const { t, isRTL } = useLanguage();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editCalories, setEditCalories] = useState(item.calories.toString());
  const [editProtein, setEditProtein] = useState(item.protein.toString());
  const [editQuantity, setEditQuantity] = useState(item.quantity?.toString() || '');
  
  // Check if this food item is from today (editable)
  const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
  const isEditable = itemDate === currentDate;
  
  // Format timestamp to readable time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleEdit = () => {
    setEditName(item.name);
    setEditCalories(item.calories.toString());
    setEditProtein(item.protein.toString());
    setEditQuantity(item.quantity?.toString() || '');
    setEditModalVisible(true);
  };
  
  const handleSaveEdit = () => {
    const updatedFood = {
      name: editName,
      calories: parseInt(editCalories) || 0,
      protein: parseFloat(editProtein) || 0,
      quantity: editQuantity ? parseInt(editQuantity) : undefined,
    };
    
    editFoodItem(item.id, updatedFood);
    setEditModalVisible(false);
  };
  
  const handleDelete = () => {
    deleteFoodItem(item.id);
  };
  
  return (
    <>
      <View style={[styles.container, isRTL && styles.rtlContainer]}>
        <View style={styles.leftContent}>
          <Text style={[styles.name, isRTL && styles.rtlText]}>{item.name}</Text>
          <Text style={[styles.time, isRTL && styles.rtlText]}>{formatTime(item.timestamp)}</Text>
          {item.quantity && (
            <Text style={[styles.quantity, isRTL && styles.rtlText]}>{item.quantity}{t('gram')}</Text>
          )}
        </View>
        
        <View style={[styles.rightContent, isRTL && styles.rtlRightContent]}>
          <View style={styles.nutrientContainer}>
            <Text style={styles.nutrientValue}>{item.calories}</Text>
            <Text style={[styles.nutrientLabel, isRTL && styles.rtlText]}>{t('kcal')}</Text>
          </View>
          
          <View style={styles.nutrientContainer}>
            <Text style={styles.nutrientValue}>{item.protein}</Text>
            <Text style={[styles.nutrientLabel, isRTL && styles.rtlText]}>{t('gProtein')}</Text>
          </View>
          
          {isEditable && (
            <View style={[styles.actionsContainer, isRTL && styles.rtlActionsContainer]}>
              <Pressable onPress={handleEdit} style={styles.actionButton}>
                <Edit2 size={16} color={Colors.primary} />
              </Pressable>
              
              <Pressable onPress={handleDelete} style={styles.actionButton}>
                <Trash2 size={16} color={Colors.error} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
      
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, isRTL && styles.rtlModalHeader]}>
              <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>{t('editFoodItem')}</Text>
              <Pressable onPress={() => setEditModalVisible(false)}>
                <X size={24} color={Colors.textDark} />
              </Pressable>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, isRTL && styles.rtlText]}>{t('foodName')}</Text>
              <TextInput
                style={[styles.input, isRTL && styles.rtlInput]}
                value={editName}
                onChangeText={setEditName}
                placeholder={t('enterFoodName')}
              />
            </View>
            
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isRTL && styles.rtlText]}>{t('caloriesGoal')}</Text>
                <TextInput
                  style={[styles.input, isRTL && styles.rtlInput]}
                  value={editCalories}
                  onChangeText={setEditCalories}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isRTL && styles.rtlText]}>{t('proteinGoal')}</Text>
                <TextInput
                  style={[styles.input, isRTL && styles.rtlInput]}
                  value={editProtein}
                  onChangeText={setEditProtein}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, isRTL && styles.rtlText]}>{t('quantityOptional')}</Text>
              <TextInput
                style={[styles.input, isRTL && styles.rtlInput]}
                value={editQuantity}
                onChangeText={setEditQuantity}
                keyboardType="numeric"
                placeholder={t('enterQuantityOptional')}
              />
            </View>
            
            <View style={[styles.modalActions, isRTL && styles.rtlModalActions]}>
              <Pressable 
                style={styles.cancelButton} 
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
              </Pressable>
              
              <Pressable style={styles.saveButton} onPress={handleSaveEdit}>
                <Text style={styles.saveButtonText}>{t('save')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rtlContainer: {
    flexDirection: 'row-reverse',
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rtlRightContent: {
    flexDirection: 'row-reverse',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textDark,
    marginBottom: 4,
  },
  rtlText: {
    textAlign: 'right',
  },
  time: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 2,
  },
  quantity: {
    fontSize: 12,
    color: Colors.textLight,
  },
  nutrientContainer: {
    alignItems: 'center',
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  nutrientLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  rtlActionsContainer: {
    flexDirection: 'row-reverse',
  },
  actionButton: {
    padding: 8,
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
    width: '85%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rtlModalHeader: {
    flexDirection: 'row-reverse',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textDark,
  },
  inputContainer: {
    marginBottom: 16,
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
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  rtlModalActions: {
    flexDirection: 'row-reverse',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
});

export default FoodItem;