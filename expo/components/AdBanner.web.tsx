import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';

interface AdBannerProps {
  size?: string;
}

// Web implementation with proper type safety
const AdBanner: React.FC<AdBannerProps> = ({ size = 'BANNER' }) => {
  const { isRTL } = useLanguage();
  
  // Ensure size is always a string to avoid TypeScript errors
  const adSize: string = size || 'BANNER';
  
  return (
    <View style={styles.container}>
      <Text style={[styles.text, isRTL && styles.rtlText]}>
        📢 Advertisement Space ({adSize})
      </Text>
      <Text style={[styles.subText, isRTL && styles.rtlText]}>
        Ads will appear on mobile devices
      </Text>
    </View>
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
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  text: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textDark,
    marginBottom: 2,
  },
  subText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  rtlText: {
    textAlign: 'center' as const,
  },
});

export default AdBanner;