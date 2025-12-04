
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Risk {
  id: string;
  name: string;
  description: string;
  level: RiskLevel;
  rank: number;
  causes: BowTieEntity[];
  preventiveControls: BowTieControl[];
  mitigatingControls: BowTieControl[];
  consequences: BowTieEntity[];
  trendData: RiskTrendDataPoint[];
}

export interface RiskTrendDataPoint {
  date: string; // YYYY-MM-DD
  value: number; // Risk score or rank
}

export interface BowTieEntity {
  id: string;
  name: string;
  probabilityOrImpact: number; // Normalized 0-1
}

export interface BowTieControl {
  id: string;
  name: string;
  effectiveness: number; // Normalized 0-1
}

export interface InterventionSuggestion {
  id: string;
  text: string;
}

export type AccidentSeverity = 'Minor' | 'Serious' | 'Fatal' | 'Near Miss';

export interface HistoricalAccident {
  id: string;
  date: string; // YYYY-MM-DD
  areaId: string; // Corresponds to area IDs used in MineSiteMap or similar
  areaName: string;
  description: string;
  severity: AccidentSeverity;
  contributingFactors: string[];
  lessonsLearned: string[];
  personnelInvolved?: number; // Optional: number of people affected
  equipmentDamaged?: string[]; // Optional: list of equipment
}

export interface AreaCCOInspections {
  areaId: string;
  areaName: string;
  totalInspections: number;
  failedInspections: number;
}

// New types for Risk Factor Ratings
export interface RiskFactor {
  id: string;
  name: string;
  description?: string; // Optional description for tooltips
}

export interface AreaFactorRatingEntry {
  factorId: string;
  rating: number; // e.g., 1-5, where 5 is high contribution to risk
}

export interface AreaRiskFactorRatings {
  areaName: string;
  areaId: string; // To link with other data if needed
  factorRatings: AreaFactorRatingEntry[];
}

// Types for Strategic Advisor Flow
export interface StrategicRecommendationsInput {
  realityFactors: string;
  tradeOffValue: number;
  tradeOffLabel: string;
}

export interface StrategicRecommendationsOutput {
  recommendations: string[];
  reasoning: string;
}
