import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, LogOut, User } from 'lucide-react-native';
import { Stack } from 'expo-router';

import Colors from '@/constants/colors';
import { Language } from '@/constants/translations';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';

export default function SettingsScreen() {
  const { t, currentLanguage, changeLanguage, isRTL } = useLanguage();
  const { user, logout } = useAuth();

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: t('english') },
    { code: 'ar', name: t('arabic') },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: t('settings'),
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
      
      {/* User Profile Section */}
      <View style={styles.section}>
        <View style={[styles.profileHeader, isRTL && styles.rtlProfileHeader]}>
          <View style={styles.profileIcon}>
            <User size={24} color={Colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, isRTL && styles.rtlText]}>
              {user?.name}
            </Text>
            <Text style={[styles.profileEmail, isRTL && styles.rtlText]}>
              {user?.email}
            </Text>
          </View>
        </View>
      </View>

      {/* Language Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
          {t('language')}
        </Text>
        
        <View style={styles.languageContainer}>
          {languages.map((language) => (
            <Pressable
              key={language.code}
              style={[
                styles.languageOption,
                currentLanguage === language.code && styles.selectedLanguageOption,
                isRTL && styles.rtlLanguageOption,
              ]}
              onPress={() => changeLanguage(language.code)}
            >
              <Text
                style={[
                  styles.languageText,
                  currentLanguage === language.code && styles.selectedLanguageText,
                  isRTL && styles.rtlText,
                ]}
              >
                {language.name}
              </Text>
              
              {currentLanguage === language.code && (
                <Check size={20} color={Colors.primary} />
              )}
            </Pressable>
          ))}
        </View>
      </View>

      {/* Sign Out Section */}
      <View style={styles.section}>
        <Pressable
          style={[styles.logoutButton, isRTL && styles.rtlLogoutButton]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={Colors.error} />
          <Text style={[styles.logoutText, isRTL && styles.rtlText]}>
            Sign Out
          </Text>
        </Pressable>
      </View>
      
      {/* App Info Section */}
      <View style={styles.infoSection}>
        <Text style={[styles.infoTitle, isRTL && styles.rtlText]}>
          {t('appName')}
        </Text>
        <Text style={[styles.infoText, isRTL && styles.rtlText]}>
          {t('version')} 1.0.0
        </Text>
        <Text style={[styles.infoText, isRTL && styles.rtlText]}>
          {t('appDescription')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 8,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rtlProfileHeader: {
    flexDirection: 'row-reverse',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 16,
  },
  rtlText: {
    textAlign: 'right',
  },
  languageContainer: {
    gap: 8,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  rtlLanguageOption: {
    flexDirection: 'row-reverse',
  },
  selectedLanguageOption: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  languageText: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '500',
  },
  selectedLanguageText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  rtlLogoutButton: {
    flexDirection: 'row-reverse',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.error,
  },
  infoSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 4,
  },
});