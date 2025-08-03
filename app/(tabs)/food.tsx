import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Camera, Search, X } from 'lucide-react-native';
import { Stack } from 'expo-router';

import AdBanner from '@/components/AdBanner';
import FoodSearchItem from '@/components/FoodSearchItem';
import OnlineFoodSearchItem from '@/components/OnlineFoodSearchItem';
import QuickAddFood from '@/components/QuickAddFood';
import ScanLabelModal from '@/components/ScanLabelModal';
import Colors from '@/constants/colors';
import foodDatabase from '@/constants/foodDatabase';
import { useFoodSearch } from '@/hooks/useFoodSearch';
import { useLanguage } from '@/hooks/useLanguage';

export default function FoodScreen() {
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [searchMode, setSearchMode] = useState<'local' | 'online'>('online');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const { t, isRTL } = useLanguage();
  
  const {
    searchQuery: onlineSearchQuery,
    setSearchQuery: setOnlineSearchQuery,
    searchResults: onlineResults,
    isLoading: onlineLoading,
    error: onlineError,
    hasSearched: onlineHasSearched,
    clearSearch: clearOnlineSearch,
  } = useFoodSearch();
  
  // Filter local food database
  const localResults = localSearchQuery
    ? foodDatabase.filter(food =>
        food.name.toLowerCase().includes(localSearchQuery.toLowerCase())
      )
    : [];
  
  const handleSearchModeToggle = () => {
    if (searchMode === 'online') {
      clearOnlineSearch();
      setSearchMode('local');
    } else {
      setLocalSearchQuery('');
      setSearchMode('online');
    }
  };
  
  const currentQuery = searchMode === 'online' ? onlineSearchQuery : localSearchQuery;
  const hasQuery = currentQuery.length > 0;
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: t('food'),
          headerStyle: {
            backgroundColor: Colors.headerBackground,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            color: Colors.textDark,
          },
        }} 
      />
      
      <AdBanner />
      
      <View style={styles.searchContainer}>
        <View style={[styles.searchHeader, isRTL && styles.rtlSearchHeader]}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, isRTL && styles.rtlSearchInput]}
              placeholder={searchMode === 'online' ? t('searchOnlineFoods') : t('searchLocalFoods')}
              value={currentQuery}
              onChangeText={searchMode === 'online' ? setOnlineSearchQuery : setLocalSearchQuery}
            />
            {hasQuery && (
              <Pressable
                onPress={() => {
                  if (searchMode === 'online') {
                    clearOnlineSearch();
                  } else {
                    setLocalSearchQuery('');
                  }
                }}
                style={styles.clearButton}
              >
                <X size={16} color={Colors.textLight} />
              </Pressable>
            )}
          </View>
          
          <Pressable
            style={[
              styles.modeToggle,
              searchMode === 'online' && styles.modeToggleActive
            ]}
            onPress={handleSearchModeToggle}
          >
            <Text style={[
              styles.modeToggleText,
              searchMode === 'online' && styles.modeToggleTextActive
            ]}>
              {searchMode === 'online' ? t('online') : t('local')}
            </Text>
          </Pressable>
        </View>
        
        {searchMode === 'online' && (
          <Text style={[styles.searchHint, isRTL && styles.rtlText]}>
            {t('searchHint')}
          </Text>
        )}
      </View>
      
      {hasQuery ? (
        <View style={styles.resultsContainer}>
          {searchMode === 'online' ? (
            <>
              {onlineLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={[styles.loadingText, isRTL && styles.rtlText]}>{t('loadingText')}</Text>
                </View>
              )}
              
              {onlineError && (
                <View style={styles.errorContainer}>
                  <Text style={[styles.errorText, isRTL && styles.rtlText]}>{t('errorText')}</Text>
                  <Pressable
                    style={styles.retryButton}
                    onPress={() => setOnlineSearchQuery(onlineSearchQuery)}
                  >
                    <Text style={styles.retryButtonText}>{t('retryButton')}</Text>
                  </Pressable>
                </View>
              )}
              
              {!onlineLoading && !onlineError && onlineResults.length === 0 && onlineHasSearched && (
                <View style={styles.emptySearch}>
                  <Text style={[styles.emptySearchText, isRTL && styles.rtlText]}>
                    {t('emptySearchText')} &quot;{onlineSearchQuery}&quot;
                  </Text>
                </View>
              )}
              
              {!onlineLoading && onlineResults.length > 0 && (
                <FlatList
                  data={onlineResults}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <OnlineFoodSearchItem item={item} />}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </>
          ) : (
            <>
              {localResults.length === 0 ? (
                <View style={styles.emptySearch}>
                  <Text style={[styles.emptySearchText, isRTL && styles.rtlText]}>
                    {t('emptySearchText')} &quot;{localSearchQuery}&quot;
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={localResults}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <FoodSearchItem item={item} />}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </>
          )}
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <QuickAddFood />
          
          <Pressable 
            style={styles.scanButton}
            onPress={() => setScanModalVisible(true)}
          >
            <Camera size={24} color={Colors.textDark} />
            <Text style={[styles.scanButtonText, isRTL && styles.rtlText]}>{t('scanNutritionLabel')}</Text>
          </Pressable>
          
          <View style={styles.infoCard}>
            <Text style={[styles.infoTitle, isRTL && styles.rtlText]}>{t('howToSearchFoods')}</Text>
            <Text style={[styles.infoText, isRTL && styles.rtlText]}>
              • <Text style={styles.bold}>{t('online')}:</Text> {t('onlineSearchDesc')}
            </Text>
            <Text style={[styles.infoText, isRTL && styles.rtlText]}>
              • <Text style={styles.bold}>{t('local')}:</Text> {t('localSearchDesc')}
            </Text>
            <Text style={[styles.infoText, isRTL && styles.rtlText]}>
              • <Text style={styles.bold}>{t('quickAdd')}:</Text> {t('quickAddDesc')}
            </Text>
            <Text style={[styles.infoText, isRTL && styles.rtlText]}>
              • <Text style={styles.bold}>{t('scanNutritionLabel')}:</Text> {t('scanLabelDesc')}
            </Text>
          </View>
        </View>
      )}
      
      <ScanLabelModal
        visible={scanModalVisible}
        onClose={() => setScanModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    backgroundColor: Colors.headerBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rtlSearchHeader: {
    flexDirection: 'row-reverse',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.textDark,
  },
  rtlSearchInput: {
    textAlign: 'right',
  },
  clearButton: {
    padding: 4,
  },
  modeToggle: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modeToggleActive: {
    backgroundColor: Colors.primary,
  },
  modeToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textDark,
  },
  modeToggleTextActive: {
    color: Colors.textDark,
  },
  searchHint: {
    fontSize: 12,
    color: Colors.textDark,
    marginTop: 8,
  },
  rtlText: {
    textAlign: 'right',
  },
  resultsContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 16,
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textDark,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 8,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  emptySearch: {
    padding: 24,
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textDark,
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '600',
    color: Colors.textDark,
  },
});