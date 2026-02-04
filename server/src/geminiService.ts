import { GoogleGenAI, Type } from '@google/genai';

export interface StyleAdvice {
  technique: string;
  growthGuide: string;
  stylingTips: string;
  styleName: string;
}

export interface Salon {
  name: string;
  address?: string;
  url?: string;
}

// Initialize Google GenAI with API key from environment
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Generate the "After" look visualization
export const generateHairstyleSimulation = async (
  currentPhotoBase64: string,
  desiredPhotoBase64: string
): Promise<string | null> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: "You are a professional virtual hair stylist. Your goal is to show the user (Image 1) exactly how they would look with the hairstyle from the reference photo (Image 2).\n\n" +
                  "STRICT GENERATION GUIDELINES:\n" +
                  "1. **Base Subject**: Use the person in IMAGE 1 as the base. KEEP their face, facial features, skin tone, expression, and clothing EXACTLY THE SAME. Do not change the person's identity.\n" +
                  "2. **Target Hairstyle**: Extract the hairstyle (cut, shape, volume, texture, length) from IMAGE 2 and apply it to the person in Image 1.\n" +
                  "3. **Seamless Blending**: The new hair must look naturally grown from the user's head. Match the lighting and shadows of Image 1 so it looks like a real photo, not a sticker.\n" +
                  "4. **Composition**: ensure the FULL HEAD and HAIRSTYLE are visible. Do not crop the top of the hair. Keep the image framing similar to Image 1.\n" +
                  "5. **Output**: A high-quality, photorealistic portrait of the User (Image 1) wearing the Hairstyle (Image 2)."
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: currentPhotoBase64
            }
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: desiredPhotoBase64
            }
          }
        ]
      },
      config: {}
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Simulation error:", error);
    return null;
  }
};

// 2. Analyze images for text advice
export const analyzeHairstyle = async (
  currentPhotoBase64: string,
  desiredPhotoBase64: string
): Promise<StyleAdvice> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            text: `Analyze these two images. Image 1 is the user's current hair. Image 2 is the desired hairstyle.
            Provide a structured JSON response with the following fields. **All values must be written in Korean.**
            1. 'styleName': A concise name for the desired style (e.g., '레이어드 컷', '가일컷').
            2. 'technique': Detailed technical instructions for a professional hairdresser to achieve this look on the user's current hair (cuts, texturing, chemical treatments).
            3. 'growthGuide': Estimate how long the user needs to grow their hair (in months or cm) or if it needs cutting. Be specific based on the length difference.
            4. 'stylingTips': Daily styling advice for the user to maintain this look.

            Return ONLY valid JSON.`
          },
          {
            inlineData: { mimeType: 'image/jpeg', data: currentPhotoBase64 }
          },
          {
            inlineData: { mimeType: 'image/jpeg', data: desiredPhotoBase64 }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            styleName: { type: Type.STRING },
            technique: { type: Type.STRING },
            growthGuide: { type: Type.STRING },
            stylingTips: { type: Type.STRING },
          },
          required: ["styleName", "technique", "growthGuide", "stylingTips"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as StyleAdvice;
  } catch (error) {
    console.error("Analysis error:", error);
    throw new Error("스타일 분석에 실패했습니다.");
  }
};

// 3. Search for salons using Google Maps Grounding
export const findSalons = async (
  styleName: string,
  lat: number,
  lng: number
): Promise<Salon[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `현재 위치(위도:${lat}, 경도:${lng})에서 5km 반경 내에 있는 미용실 중, '${styleName}' 스타일 시술 경험이 있거나 평점이 4.0 이상인 곳을 5곳 추천해주세요.
      **중요**: 사용자가 지도 앱에서 바로 찾을 수 있도록 정확한 '상호명(Place Name)'을 찾아주세요. 프랜차이즈인 경우 지점명까지 정확히 포함해야 합니다.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const salons = chunks
      .filter((c: any) => c.maps)
      .map((c: any) => ({
        name: c.maps.title,
        url: c.maps.uri,
        address: "지도에서 위치 보기",
      }));

    // Remove duplicates
    const uniqueSalons = salons.filter((salon: Salon, index: number, self: Salon[]) =>
      index === self.findIndex((t: Salon) => t.name === salon.name)
    );

    return uniqueSalons.slice(0, 5);
  } catch (error) {
    console.error("Maps search error:", error);
    return [];
  }
};
