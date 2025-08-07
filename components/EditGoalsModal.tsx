import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { X } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';
import { useNutriStore } from '@/hooks/useNutriStore';
import { NutritionGoals } from '@/types';

interface EditGoalsModalProps {
  visible: boolean;
  onClose: () => void;
}

const EditGoalsModal: React.FC<EditGoalsModalProps> = ({ visible, onClose }) => {
  const { goals, updateGoals } = useNutriStore();
  const { t, isRTL } = useLanguage();
  const [caloriesGoal, setCaloriesGoal] = useState(goals.calories.toString());
  const [proteinGoal, setProteinGoal] = useState(goals.protein.toString());
  
  // Update local state when goals change
  useEffect(() => {
    setCaloriesGoal(goals.calories.toString());
    setProteinGoal(goals.protein.toString());
  }, [goals, visible]);
  
  const handleSave = () => {
    const newGoals: NutritionGoals = {
      calories: parseInt(caloriesGoal) || 0,
      protein: parseInt(proteinGoal) || 0,
    };
    
    updateGoals(newGoals);
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={[styles.header, isRTL && styles.rtlHeader]}>
            <Text style={[styles.title, isRTL && styles.rtlText]}>
              {t('editDailyGoals')}
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.textDark} />
            </Pressable>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isRTL && styles.rtlText]}>
              {t('caloriesGoal')}
            </Text>
            <TextInput
              style={[styles.input, isRTL && styles.rtlInput]}
              value={caloriesGoal}
              onChangeText={setCaloriesGoal}
              keyboardType="numeric"
              placeholder={t('enterCaloriesGoal')}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isRTL && styles.rtlText]}>
              {t('proteinGoal')}
            </Text>
            <TextInput
              style={[styles.input, isRTL && styles.rtlInput]}
              value={proteinGoal}
              onChangeText={setProteinGoal}
              keyboardType="numeric"
              placeholder={t('enterProteinGoal')}
            />
          </View>
          
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{t('saveGoals')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rtlHeader: {
    flexDirection: 'row-reverse',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textDark,
  },
  rtlText: {
    textAlign: 'right',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 16,
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
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditGoalsModal;