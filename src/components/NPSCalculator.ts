
export type NPSRating = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Respondent = 'promotor' | 'passivo' | 'detrator';

export const calculateRespondentType = (rating: NPSRating): Respondent => {
  if (rating >= 9) return 'promotor';
  if (rating >= 7) return 'passivo';
  return 'detrator';
};

export interface NPSResult {
  score: number;
  promoters: number;
  passives: number;
  detractors: number;
  promotersPercentage: number;
  passivesPercentage: number;
  detractorsPercentage: number;
  totalResponses: number;
}

export const calculateNPS = (ratings: NPSRating[]): NPSResult => {
  if (ratings.length === 0) {
    return {
      score: 0,
      promoters: 0,
      passives: 0,
      detractors: 0,
      promotersPercentage: 0,
      passivesPercentage: 0,
      detractorsPercentage: 0,
      totalResponses: 0,
    };
  }

  const totalResponses = ratings.length;
  
  const promoters = ratings.filter(r => r >= 9).length;
  const passives = ratings.filter(r => r >= 7 && r <= 8).length;
  const detractors = ratings.filter(r => r <= 6).length;
  
  const promotersPercentage = (promoters / totalResponses) * 100;
  const passivesPercentage = (passives / totalResponses) * 100;
  const detractorsPercentage = (detractors / totalResponses) * 100;
  
  // NPS formula: % Promoters - % Detractors
  const score = Math.round(promotersPercentage - detractorsPercentage);
  
  return {
    score,
    promoters,
    passives,
    detractors,
    promotersPercentage,
    passivesPercentage,
    detractorsPercentage,
    totalResponses,
  };
};
