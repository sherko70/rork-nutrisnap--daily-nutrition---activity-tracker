import React, { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';
import { useNutriStore } from '@/hooks/useNutriStore';
import { FoodItem } from '@/types';

interface ScanLabelModalProps {
  visible: boolean;
  onClose: () => void;
}

const ScanLabelModal: React.FC<ScanLabelModalProps> = ({ visible, onClose }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [productName, setProductName] = useState('');
  const { addFoodItem } = useNutriStore();
  const { t, isRTL } = useLanguage();
  
  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setScanned(false);
      setScanning(false);
      setCalories('');
      setProtein('');
      setProductName('');
    }
  }, [visible]);
  
  const handleCapture = async () => {
    setScanning(true);
    
    // Simulate scanning and OCR processing
    setTimeout(() => {
      // Mock values that would come from OCR
      const mockCalories = Math.floor(Math.random() * 400 + 100).toString();
      const mockProtein = (Math.random() * 20 + 5).toFixed(1);
      
      setCalories(mockCalories);
      setProtein(mockProtein);
      setProductName(t('scannedProduct'));
      setScanned(true);
      setScanning(false);
    }, 1500);
  };
  
  const handleAddFood = () => {
    if (!calories && !protein) return;
    
    const newFood: FoodItem = {
      id: `scan-${Date.now()}`,
      name: productName || t('scannedProduct'),
      calories: parseInt(calories) || 0,
      protein: parseFloat(protein) || 0,
      timestamp: Date.now(),
    };
    
    addFoodItem(newFood);
    onClose();
  };
  
  // Handle web platform
  if (Platform.OS === 'web') {
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
              <Text style={[styles.title, isRTL && styles.rtlText]}>{t('scanNutritionLabelTitle')}</Text>
              <Pressable onPress={onClose}>
                <X size={24} color={Colors.textDark} />
              </Pressable>
            </View>
            <Text style={[styles.message, isRTL && styles.rtlText]}>
              {t('cameraNotAvailable')}
            </Text>
            <Pressable style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>{t('close')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }
  
  // Handle permission not granted
  if (permission && !permission.granted) {
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
              <Text style={[styles.title, isRTL && styles.rtlText]}>{t('cameraPermission')}</Text>
              <Pressable onPress={onClose}>
                <X size={24} color={Colors.textDark} />
              </Pressable>
            </View>
            <Text style={[styles.message, isRTL && styles.rtlText]}>
              {t('cameraPermissionRequired')}
            </Text>
            <Pressable style={styles.button} onPress={requestPermission}>
              <Text style={styles.buttonText}>{t('grantPermission')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={[styles.header, isRTL && styles.rtlHeader]}>
          <Text style={[styles.title, isRTL && styles.rtlText]}>
            {scanned ? t('confirmNutritionInfo') : t('scanNutritionLabelTitle')}
          </Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.textDark} />
          </Pressable>
        </View>
        
        {!scanned ? (
          <>
            <View style={styles.cameraContainer}>
              {permission?.granted && (
                <CameraView
                  style={styles.camera}
                  facing="back"
                >
                  <View style={styles.overlay}>
                    <View style={styles.scanArea} />
                  </View>
                </CameraView>
              )}
            </View>
            
            <View style={styles.instructionsContainer}>
              <Text style={[styles.instructions, isRTL && styles.rtlText]}>
                {t('positionLabel')}
              </Text>
            </View>
            
            <Pressable 
              style={[styles.captureButton, scanning && styles.disabledButton]}
              onPress={handleCapture}
              disabled={scanning}
            >
              <Text style={styles.captureButtonText}>
                {scanning ? t('processing') : t('captureLabel')}
              </Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, isRTL && styles.rtlText]}>{t('productName')}</Text>
              <TextInput
                style={[styles.input, isRTL && styles.rtlInput]}
                value={productName}
                onChangeText={setProductName}
                placeholder={t('enterProductName')}
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
            
            <Text style={[styles.confirmText, isRTL && styles.rtlText]}>
              {t('verifyExtracted')}
            </Text>
            
            <Pressable 
              style={styles.addButton}
              onPress={handleAddFood}
            >
              <Text style={styles.addButtonText}>{t('addFoodButton')}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.headerBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  rtlHeader: {
    flexDirection: 'row-reverse',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
  },
  rtlText: {
    textAlign: 'right',
  },
  closeButton: {
    padding: 4,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: 'transparent',
  },
  instructionsContainer: {
    padding: 16,
    backgroundColor: Colors.white,
  },
  instructions: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  captureButton: {
    backgroundColor: Colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.mediumGray,
  },
  captureButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  formContainer: {
    flex: 1,
    padding: 16,
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
    backgroundColor: Colors.white,
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
  confirmText: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: Colors.accent,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  message: {
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
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
});

export default ScanLabelModal;