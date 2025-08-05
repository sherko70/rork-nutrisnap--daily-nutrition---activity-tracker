import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';

interface AdBannerProps {
  size?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ size = 'BANNER' }) => {
  const { isRTL } = useLanguage();
  
  // Always show placeholder on all platforms for now
  // This avoids any bundling issues with react-native-google-mobile-ads
  return (
    <View style={styles.container}>
      <Text style={[styles.text, isRTL && styles.rtlText]}>
        📢 Advertisement Space
      </Text>
      <Text style={[styles.subText, isRTL && styles.rtlText]}>
        {Platform.OS === 'web' ? 'Ads will appear on mobile devices' : 'Ads will be enabled in production'}
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
    borderStyle: Platform.OS === 'web' ? 'dashed' : 'solid',
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