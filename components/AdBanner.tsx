import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';

interface AdBannerProps {
  size?: BannerAdSize;
}

const AdBanner: React.FC<AdBannerProps> = ({ size = BannerAdSize.BANNER }) => {
  const { isRTL } = useLanguage();
  const [adError, setAdError] = useState<boolean>(false);
  
  // Use test ad unit ID for development, replace with your real ad unit ID for production
  const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8364017641446993/6300978111';
  
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
  
  if (adError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, isRTL && styles.rtlText]}>
          Ad failed to load
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('Ad loaded successfully');
          setAdError(false);
        }}
        onAdFailedToLoad={(error) => {
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