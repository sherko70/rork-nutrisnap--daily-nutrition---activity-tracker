import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';
import { I18nManager, Platform } from 'react-native';

import { Language, translations, TranslationKey } from '@/constants/translations';

const LANGUAGE_STORAGE_KEY = 'nutrisnap-language';

const [LanguageProvider, useLanguage] = createContextHook(() => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language on app start
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
          setCurrentLanguage(savedLanguage as Language);
          
          // Set RTL for Arabic (only on mobile)
          if (Platform.OS !== 'web') {
            if (savedLanguage === 'ar') {
              I18nManager.allowRTL(true);
              I18nManager.forceRTL(true);
            } else {
              I18nManager.allowRTL(false);
              I18nManager.forceRTL(false);
            }
          }
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  // Save language when it changes
  const changeLanguage = async (language: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      setCurrentLanguage(language);
      
      // Handle RTL for Arabic (only on mobile)
      if (Platform.OS !== 'web') {
        if (language === 'ar') {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
        } else {
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
        }
      }
      
      // Note: In a production app, you might want to restart the app
      // to fully apply RTL changes using RNRestart.Restart()
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  // Translation function with fallback
  const t = (key: TranslationKey): string => {
    try {
      const translation = translations[currentLanguage]?.[key] || translations.en[key];
      return translation || key;
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  // Check if current language is RTL
  const isRTL = currentLanguage === 'ar';

  return {
    currentLanguage,
    changeLanguage,
    t,
    isRTL,
    isLoading,
  };
});

export { LanguageProvider, useLanguage };