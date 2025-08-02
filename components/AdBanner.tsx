import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';

// Dynamic import types for mobile ads
type BannerAdSize = any;
type BannerAdComponent = any;
type TestIds = any;

interface AdBannerProps {
  size?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ size = 'BANNER' }) => {
  const { isRTL } = useLanguage();
  const [adError, setAdError] = useState<boolean>(false);
  const [BannerAd, setBannerAd] = useState<BannerAdComponent | null>(null);
  const [BannerAdSize, setBannerAdSize] = useState<BannerAdSize | null>(null);
  const [TestIds, setTestIds] = useState<TestIds | null>(null);
  
  useEffect(() => {
    // Only load ads module on mobile platforms
    if (Platform.OS !== 'web') {
      const loadAdsModule = async () => {
        try {
          const adsModule = await import('react-native-google-mobile-ads');
          setBannerAd(() => adsModule.BannerAd);
          setBannerAdSize(adsModule.BannerAdSize);
          setTestIds(adsModule.TestIds);
        } catch (error) {
          console.log('Failed to load ads module:', error);
          setAdError(true);
        }
      };
      loadAdsModule();
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
  
  // Show loading state while ads module is loading
  if (!BannerAd || !BannerAdSize || !TestIds) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, isRTL && styles.rtlText]}>
          Loading ad...
        </Text>
      </View>
    );
  }
  
  if (adError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, isRTL && styles.rtlText]}>
          Ad failed to load
        </Text>
      </View>
    );
  }
  
  // Use test ad unit ID for development, replace with your real ad unit ID for production
  const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8364017641446993/6300978111';
  const adSize = BannerAdSize[size] || BannerAdSize.BANNER;
  
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
        }}
        onAdFailedToLoad={(error: any) => {
          console.log('Ad failed to load:', error);
          setAdError(true);
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