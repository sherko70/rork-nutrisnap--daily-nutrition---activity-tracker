import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';
import MobileAdBanner from './MobileAdBanner';

interface AdBannerProps {
  size?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ size = 'BANNER' }) => {
  const { isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  
  useEffect(() => {
    // Set a timeout to handle loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, isRTL && styles.rtlText]}>
          Loading ad...
        </Text>
      </View>
    );
  }
  
  if (hasError) {
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
  rtlText: {
    textAlign: 'center',
  },
});

export default AdBanner;