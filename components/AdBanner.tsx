import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';

interface AdBannerProps {
  size?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ size = 'BANNER' }) => {
  const { isRTL } = useLanguage();
  const [MobileAdComponent, setMobileAdComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Dynamically import the mobile ad component
      import('./MobileAdBanner')
        .then((module) => {
          setMobileAdComponent(() => module.default);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log('Failed to load mobile ad component:', error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);
  
  // For web, show placeholder
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
  
  // For mobile, show loading state or the actual ad component
  if (isLoading || !MobileAdComponent) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>
          Loading ad...
        </Text>
      </View>
    );
  }
  
  return <MobileAdComponent size={size} />;
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
  loadingText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    padding: 12,
  },
  rtlText: {
    textAlign: 'center',
  },
});

export default AdBanner;