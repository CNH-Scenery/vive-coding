import { StyleAdvice, Salon } from '../types';

const API_BASE_URL = '/api';

export interface ProcessResponse {
  success: boolean;
  data?: {
    simulation: string | null;
    advice: StyleAdvice;
    salons: Salon[];
  };
  error?: string;
}

// Process both images with all AI features
export const processImages = async (
  currentPhoto: File,
  desiredPhoto: File,
  location?: { lat: number; lng: number } | null
): Promise<ProcessResponse> => {
  const formData = new FormData();
  formData.append('currentPhoto', currentPhoto);
  formData.append('desiredPhoto', desiredPhoto);

  if (location) {
    formData.append('lat', location.lat.toString());
    formData.append('lng', location.lng.toString());
  }

  const response = await fetch(`${API_BASE_URL}/process`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '처리에 실패했습니다.');
  }

  return response.json();
};
