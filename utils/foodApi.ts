const USDA_API_KEY = 'DEMO_KEY'; // In production, use a real API key
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export interface USDAFoodItem {
  fdcId: number;
  description: string;
  brandOwner?: string;
  ingredients?: string;
  foodNutrients: {
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    value: number;
  }[];
}

export interface SimplifiedFoodItem {
  id: string;
  name: string;
  brand?: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbsPer100g: number;
}

// Nutrient IDs from USDA database
const NUTRIENT_IDS = {
  ENERGY_KCAL: 1008,
  PROTEIN: 1003,
  FAT: 1004,
  CARBS: 1005,
};

export const searchFoods = async (query: string, pageSize: number = 25): Promise<SimplifiedFoodItem[]> => {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(`${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query.trim(),
        dataType: ['Foundation', 'SR Legacy', 'Branded'],
        pageSize,
        pageNumber: 1,
        sortBy: 'dataType.keyword',
        sortOrder: 'asc',
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    return data.foods?.map((food: USDAFoodItem) => {
      // Extract nutrition values
      const nutrients = food.foodNutrients || [];
      
      const getNutrientValue = (nutrientId: number): number => {
        const nutrient = nutrients.find(n => n.nutrientId === nutrientId);
        return nutrient?.value || 0;
      };

      const calories = getNutrientValue(NUTRIENT_IDS.ENERGY_KCAL);
      const protein = getNutrientValue(NUTRIENT_IDS.PROTEIN);
      const fat = getNutrientValue(NUTRIENT_IDS.FAT);
      const carbs = getNutrientValue(NUTRIENT_IDS.CARBS);

      return {
        id: food.fdcId.toString(),
        name: food.description,
        brand: food.brandOwner,
        caloriesPer100g: Math.round(calories),
        proteinPer100g: Math.round(protein * 10) / 10,
        fatPer100g: Math.round(fat * 10) / 10,
        carbsPer100g: Math.round(carbs * 10) / 10,
      };
    }) || [];
  } catch (error) {
    console.error('Error searching foods:', error);
    throw new Error('Failed to search foods. Please try again.');
  }
};

export const getFoodDetails = async (fdcId: string): Promise<SimplifiedFoodItem | null> => {
  try {
    const response = await fetch(`${USDA_BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const food: USDAFoodItem = await response.json();
    const nutrients = food.foodNutrients || [];
    
    const getNutrientValue = (nutrientId: number): number => {
      const nutrient = nutrients.find(n => n.nutrientId === nutrientId);
      return nutrient?.value || 0;
    };

    const calories = getNutrientValue(NUTRIENT_IDS.ENERGY_KCAL);
    const protein = getNutrientValue(NUTRIENT_IDS.PROTEIN);
    const fat = getNutrientValue(NUTRIENT_IDS.FAT);
    const carbs = getNutrientValue(NUTRIENT_IDS.CARBS);

    return {
      id: food.fdcId.toString(),
      name: food.description,
      brand: food.brandOwner,
      caloriesPer100g: Math.round(calories),
      proteinPer100g: Math.round(protein * 10) / 10,
      fatPer100g: Math.round(fat * 10) / 10,
      carbsPer100g: Math.round(carbs * 10) / 10,
    };
  } catch (error) {
    console.error('Error getting food details:', error);
    return null;
  }
};