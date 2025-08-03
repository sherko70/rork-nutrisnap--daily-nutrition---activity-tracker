import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';

interface AdBannerProps {
  size?: string;
}

// Dynamic import for Google Mobile Ads to avoid web bundling issues
let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

// Only import on native platforms
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const GoogleMobileAds = require('react-native-google-mobile-ads');
    BannerAd = GoogleMobileAds.BannerAd;
    BannerAdSize = GoogleMobileAds.BannerAdSize;
    TestIds = GoogleMobileAds.TestIds;
  } catch (error) {
    console.log('Google Mobile Ads not available:', error);
  }
}

const AdBanner: React.FC<AdBannerProps> = ({ size = 'BANNER' }) => {
  const { isRTL } = useLanguage();
  const [adError, setAdError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Only set up timer on native platforms with ads available
    if (Platform.OS !== 'web' && BannerAd && BannerAdSize && TestIds) {
      const timer = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setAdError(true);
        }
      }, 10000); // 10 second timeout
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  // Web version - show placeholder
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
  
  // Native version - return null if Google Mobile Ads is not available
  if (!BannerAd || !BannerAdSize || !TestIds) {
    return null;
  }
  
  const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8364017641446993/6300978111';
  
  // Map size string to BannerAdSize enum
  const getBannerSize = (sizeString: string): string => {
    switch (sizeString) {
      case 'BANNER':
        return 'BANNER';
      case 'LARGE_BANNER':
        return 'LARGE_BANNER';
      case 'MEDIUM_RECTANGLE':
        return 'MEDIUM_RECTANGLE';
      case 'FULL_BANNER':
        return 'FULL_BANNER';
      case 'LEADERBOARD':
        return 'LEADERBOARD';
      default:
        return 'BANNER';
    }
  };
  
  const adSizeKey = getBannerSize(size);
  const adSize = BannerAdSize[adSizeKey];
  
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
        }}
        onAdFailedToLoad={(error: any) => {
          console.log('Ad failed to load:', error);
          setAdError(true);
          setIsLoading(false);
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
  rtlText: {
    textAlign: 'center',
  },
});

export default AdBanner;