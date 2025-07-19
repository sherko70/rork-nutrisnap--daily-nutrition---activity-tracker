export interface NutritionGoals {
  calories: number;
  protein: number;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  timestamp: number;
  quantity?: number; // in grams if applicable
}

export interface DailyLog {
  date: string;
  totalCalories: number;
  totalProtein: number;
  foods: FoodItem[];
}

export interface HistoryData {
  [date: string]: DailyLog;
}

export interface FoodDatabaseItem {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
}