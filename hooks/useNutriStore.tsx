import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';

import { DailyLog, FoodItem, HistoryData, NutritionGoals } from '@/types';
import { getCurrentDate } from '@/utils/dateUtils';
import { useAuth } from './useAuth';
import { trpcClient } from '@/lib/trpc';

const GOALS_STORAGE_KEY = 'nutrisnap-goals';
const TODAY_FOODS_STORAGE_KEY = 'nutrisnap-today-foods';
const HISTORY_STORAGE_KEY = 'nutrisnap-history';

// Default goals
const DEFAULT_GOALS: NutritionGoals = {
  calories: 2000,
  protein: 120,
};

const [NutriStoreProvider, useNutriStore] = createContextHook(() => {
  const [goals, setGoals] = useState<NutritionGoals>(DEFAULT_GOALS);
  const [todayFoods, setTodayFoods] = useState<FoodItem[]>([]);
  const [history, setHistory] = useState<HistoryData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);
  
  const { isAuthenticated, getToken } = useAuth();

  // Load data from storage or backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        if (isAuthenticated) {
          // Load from backend if authenticated
          const token = await getToken();
          if (token) {
            try {
              const data = await trpcClient.nutrition.get.query({ token });
              setGoals({ ...DEFAULT_GOALS, ...data.goals });
              setHistory(data.history as HistoryData);
              
              // Set today's foods from history
              const todayData = data.history[currentDate];
              if (todayData) {
                setTodayFoods(todayData.foods);
              }
            } catch (error) {
              console.error('Error loading data from backend:', error);
              // Fallback to local storage
              await loadFromLocalStorage();
            }
          }
        } else {
          // Load from local storage if not authenticated
          await loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Reset to defaults on error
        setGoals(DEFAULT_GOALS);
        setTodayFoods([]);
        setHistory({});
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, currentDate]);

  const loadFromLocalStorage = async () => {
    // Load goals
    const storedGoals = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
    if (storedGoals) {
      try {
        const parsedGoals = JSON.parse(storedGoals);
        if (parsedGoals && typeof parsedGoals === 'object') {
          setGoals({ ...DEFAULT_GOALS, ...parsedGoals });
        }
      } catch (parseError) {
        console.warn('Error parsing stored goals:', parseError);
      }
    }
    
    // Load today's foods
    const storedTodayFoods = await AsyncStorage.getItem(TODAY_FOODS_STORAGE_KEY);
    if (storedTodayFoods) {
      try {
        const parsedFoods = JSON.parse(storedTodayFoods);
        if (Array.isArray(parsedFoods)) {
          setTodayFoods(parsedFoods);
        }
      } catch (parseError) {
        console.warn('Error parsing stored foods:', parseError);
      }
    }
    
    // Load history
    const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        if (parsedHistory && typeof parsedHistory === 'object') {
          setHistory(parsedHistory);
        }
      } catch (parseError) {
        console.warn('Error parsing stored history:', parseError);
      }
    }
  };

  // Sync data to backend periodically
  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const syncToBackend = async () => {
      try {
        const token = await getToken();
        if (token) {
          await trpcClient.nutrition.sync.mutate({
            token,
            goals,
            history: history as Record<string, DailyLog>,
          });
          setLastSyncTime(Date.now());
        }
      } catch (error) {
        console.error('Error syncing to backend:', error);
      }
    };

    // Sync every 30 seconds if there are changes
    const now = Date.now();
    if (now - lastSyncTime > 30000) {
      syncToBackend();
    }

    const interval = setInterval(() => {
      syncToBackend();
    }, 30000);

    return () => clearInterval(interval);
  }, [goals, history, isAuthenticated, isLoading, lastSyncTime]);

  // Check for day change
  useEffect(() => {
    const checkDayChange = () => {
      const newDate = getCurrentDate();
      if (newDate !== currentDate) {
        // Archive yesterday's data
        archiveDailyData(currentDate);
        // Reset today's data
        setTodayFoods([]);
        // Update current date
        setCurrentDate(newDate);
      }
    };

    // Check on mount and set interval
    checkDayChange();
    const interval = setInterval(checkDayChange, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [currentDate, todayFoods]);

  // Save to local storage when not authenticated
  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    
    const saveToLocalStorage = async () => {
      try {
        await Promise.all([
          AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals)),
          AsyncStorage.setItem(TODAY_FOODS_STORAGE_KEY, JSON.stringify(todayFoods)),
          AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history)),
        ]);
      } catch (error) {
        console.error('Error saving to local storage:', error);
      }
    };
    
    saveToLocalStorage();
  }, [goals, todayFoods, history, isLoading, isAuthenticated]);

  // Archive daily data to history
  const archiveDailyData = (date: string) => {
    const totalCalories = todayFoods.reduce((sum, food) => sum + food.calories, 0);
    const totalProtein = todayFoods.reduce((sum, food) => sum + food.protein, 0);
    
    const dailyLog: DailyLog = {
      date,
      totalCalories,
      totalProtein,
      foods: todayFoods,
    };
    
    setHistory(prev => ({
      ...prev,
      [date]: dailyLog,
    }));
  };

  // Update today's data in history
  const updateTodayInHistory = () => {
    const totalCalories = todayFoods.reduce((sum, food) => sum + food.calories, 0);
    const totalProtein = todayFoods.reduce((sum, food) => sum + food.protein, 0);
    
    const dailyLog: DailyLog = {
      date: currentDate,
      totalCalories,
      totalProtein,
      foods: todayFoods,
    };
    
    setHistory(prev => ({
      ...prev,
      [currentDate]: dailyLog,
    }));
  };

  // Add food item
  const addFoodItem = (food: FoodItem) => {
    setTodayFoods(prev => [...prev, food]);
  };

  // Edit food item (only for today)
  const editFoodItem = (foodId: string, updatedFood: Partial<FoodItem>) => {
    setTodayFoods(prev => 
      prev.map(food => 
        food.id === foodId 
          ? { ...food, ...updatedFood }
          : food
      )
    );
  };

  // Delete food item (only for today)
  const deleteFoodItem = (foodId: string) => {
    setTodayFoods(prev => prev.filter(food => food.id !== foodId));
  };

  // Update goals
  const updateGoals = (newGoals: NutritionGoals) => {
    setGoals({ ...DEFAULT_GOALS, ...newGoals });
  };

  // Calculate today's totals
  const getTodayTotals = () => {
    const totalCalories = todayFoods.reduce((sum, food) => sum + food.calories, 0);
    const totalProtein = todayFoods.reduce((sum, food) => sum + food.protein, 0);
    
    return {
      calories: totalCalories,
      protein: totalProtein,
    };
  };

  // Update today in history whenever totals change
  useEffect(() => {
    if (!isLoading) {
      updateTodayInHistory();
    }
  }, [todayFoods, currentDate, isLoading]);

  return {
    goals,
    todayFoods,
    history,
    isLoading,
    currentDate,
    updateGoals,
    addFoodItem,
    editFoodItem,
    deleteFoodItem,
    getTodayTotals,
  };
});

export { NutriStoreProvider, useNutriStore };