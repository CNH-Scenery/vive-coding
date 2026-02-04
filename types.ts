export interface Salon {
  name: string;
  address?: string;
  rating?: number;
  reviews?: string;
  url?: string;
}

export interface StyleAdvice {
  technique: string;
  growthGuide: string;
  stylingTips: string;
  styleName: string;
}

export interface SimulationResult {
  imageUrl: string;
}

export interface AppState {
  step: 'upload' | 'analyzing' | 'results';
  currentPhoto: File | null;
  desiredPhoto: File | null;
  currentPhotoPreview: string | null;
  desiredPhotoPreview: string | null;
  advice: StyleAdvice | null;
  simulation: string | null;
  salons: any[];
  error: string | null;
  location: { lat: number; lng: number } | null;
}
