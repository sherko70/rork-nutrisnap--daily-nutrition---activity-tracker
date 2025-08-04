import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';

interface AdBannerProps {
  size?: string;
}

// Web-only placeholder component
const WebAdPlaceholder: React.FC<{ isRTL: boolean }> = ({ isRTL }) => (
  <View style={styles.webContainer}>
    <Text style={[styles.webText, isRTL && styles.rtlText]}>
      📢 Advertisement Space
    </Text>
    <Text style={[styles.webSubText, isRTL && styles.rtlText]}>
      Ads will appear on mobile devices
    </Text>
  </View>
);



const AdBanner: React.FC<AdBannerProps> = ({ size = 'BANNER' }) => {
  const { isRTL } = useLanguage();
  
  // Always show web placeholder on web
  if (Platform.OS === 'web') {
    return <WebAdPlaceholder isRTL={isRTL} />;
  }
  
  // On native platforms, show a simple placeholder for now
  // This avoids any import issues with Google Mobile Ads
  return (
    <View style={styles.nativeContainer}>
      <Text style={[styles.nativeText, isRTL && styles.rtlText]}>
        📱 Native Ad Space
      </Text>
      <Text style={[styles.nativeSubText, isRTL && styles.rtlText]}>
        Ads will be enabled in production
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  webContainer: {
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
  webText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 2,
  },
  webSubText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  loadingContainer: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  errorContainer: {
    backgroundColor: Colors.error + '20',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
  },
  nativeContainer: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'solid',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  nativeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 2,
  },
  nativeSubText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  rtlText: {
    textAlign: 'center',
  },
});

export default AdBanner;