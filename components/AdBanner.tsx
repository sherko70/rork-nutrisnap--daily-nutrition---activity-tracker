import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';

interface AdBannerProps {
  onPress?: () => void;
}

const AdBanner: React.FC<AdBannerProps> = ({ onPress }) => {
  const { t, isRTL } = useLanguage();
  
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={[styles.adText, isRTL && styles.rtlText]}>
          📢 Advertisement Space
        </Text>
        <Text style={[styles.subText, isRTL && styles.rtlText]}>
          Tap to learn more
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  content: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  adText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 2,
  },
  subText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  rtlText: {
    textAlign: 'center',
  },
});

export default AdBanner;