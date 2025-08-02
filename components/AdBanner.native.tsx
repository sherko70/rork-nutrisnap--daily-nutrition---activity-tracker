import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';

interface AdBannerProps {
  size?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ size = 'BANNER' }) => {
  const { isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [MobileAdBanner, setMobileAdBanner] = useState<React.ComponentType<any> | null>(null);
  
  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Dynamically import MobileAdBanner only on native platforms
      import('./MobileAdBanner').then((module) => {
        setMobileAdBanner(() => module.default);
        setIsLoading(false);
      }).catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
    } else {
      // On web, show placeholder
      setIsLoading(false);
    }
  }, []);
  
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <Text style={[styles.webText, isRTL && styles.rtlText]}>
          📢 Advertisement Space
        </Text>
        <Text style={[styles.webSubText, isRTL && styles.rtlText]}>
          Ads will appear on mobile devices
        </Text>
      </View>
    );
  }
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, isRTL && styles.rtlText]}>
          Loading ad...
        </Text>
      </View>
    );
  }
  
  if (hasError || !MobileAdBanner) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, isRTL && styles.rtlText]}>
          Ad failed to load
        </Text>
      </View>
    );
  }
  
  return (
    <MobileAdBanner 
      size={size} 
      onError={() => setHasError(true)}
      onLoad={() => setIsLoading(false)}
    />
  );
};

const styles = StyleSheet.create({
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
  rtlText: {
    textAlign: 'center',
  },
});

export default AdBanner;