export interface LabColor {
  L: number;
  a: number;
  b: number;
}

export interface FlowerMeta extends LabColor {
  id: number;
  path: string;
}

export interface MatchResult {
  id: number;
  path: string;
}