import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';

interface MobileAdBannerProps {
  size?: string;
  onError?: () => void;
  onLoad?: () => void;
}

const MobileAdBanner: React.FC<MobileAdBannerProps> = ({ size = 'BANNER', onError, onLoad }) => {
  const { isRTL } = useLanguage();
  const [adError, setAdError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8364017641446993/6300978111';
  
  // Map size string to BannerAdSize enum
  const getBannerSize = (sizeString: string) => {
    switch (sizeString) {
      case 'BANNER':
        return BannerAdSize.BANNER;
      case 'LARGE_BANNER':
        return BannerAdSize.LARGE_BANNER;
      case 'MEDIUM_RECTANGLE':
        return BannerAdSize.MEDIUM_RECTANGLE;
      case 'FULL_BANNER':
        return BannerAdSize.FULL_BANNER;
      case 'LEADERBOARD':
        return BannerAdSize.LEADERBOARD;
      default:
        return BannerAdSize.BANNER;
    }
  };
  
  const adSize = getBannerSize(size);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setAdError(true);
      }
    }, 10000); // 10 second timeout
    
    return () => clearTimeout(timer);
  }, [isLoading]);
  
  if (adError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, isRTL && styles.rtlText]}>
          Ad failed to load
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
  
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={adSize}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('Ad loaded successfully');
          setAdError(false);
          setIsLoading(false);
          onLoad?.();
        }}
        onAdFailedToLoad={(error: any) => {
          console.log('Ad failed to load:', error);
          setAdError(true);
          setIsLoading(false);
          onError?.();
        }}
      />
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

export default MobileAdBanner;