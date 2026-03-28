import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

import Colors from '@/constants/colors';
import { useLanguage } from '@/hooks/useLanguage';

interface AdBannerProps {
  size?: keyof typeof BannerAdSize;
}

// Native implementation with Google Mobile Ads
const AdBanner: React.FC<AdBannerProps> = ({ size = 'BANNER' }) => {
  const { isRTL } = useLanguage();
  const [adError, setAdError] = useState<boolean>(false);
  
  // Use test ad unit ID for development, replace with your actual ad unit ID for production
  const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8364017641446993/6300978111';
  
  // Get the banner size from the BannerAdSize enum
  const bannerSize = BannerAdSize[size] || BannerAdSize.BANNER;
  
  if (adError) {
    // Fallback UI when ad fails to load
    return (
      <View style={styles.container}>
        <Text style={[styles.text, isRTL && styles.rtlText]}>
          📢 Advertisement Space
        </Text>
        <Text style={[styles.subText, isRTL && styles.rtlText]}>
          Ad failed to load
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.adContainer}>
      <BannerAd
        unitId={adUnitId}
        size={bannerSize}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded successfully');
        }}
        onAdFailedToLoad={(error) => {
          console.log('Banner ad failed to load:', error);
          setAdError(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  container: {
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