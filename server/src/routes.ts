import { Router, Request, Response } from 'express';
import { upload, bufferToBase64 } from './middleware/upload.js';
import {
  generateHairstyleSimulation,
  analyzeHairstyle,
  findSalons,
  StyleAdvice,
  Salon
} from './geminiService.js';

export const router = Router();

// Type for multer files
interface MulterFiles {
  currentPhoto?: Express.Multer.File[];
  desiredPhoto?: Express.Multer.File[];
}

// POST /api/process - Combined endpoint for all processing
router.post(
  '/process',
  upload.fields([
    { name: 'currentPhoto', maxCount: 1 },
    { name: 'desiredPhoto', maxCount: 1 }
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as MulterFiles;

      // Validate files
      if (!files?.currentPhoto?.[0] || !files?.desiredPhoto?.[0]) {
        res.status(400).json({
          success: false,
          error: 'Both currentPhoto and desiredPhoto are required'
        });
        return;
      }

      // Convert buffers to base64
      const currentPhotoBase64 = bufferToBase64(files.currentPhoto[0].buffer);
      const desiredPhotoBase64 = bufferToBase64(files.desiredPhoto[0].buffer);

      // Get optional location from form data
      const lat = req.body.lat ? parseFloat(req.body.lat) : null;
      const lng = req.body.lng ? parseFloat(req.body.lng) : null;

      console.log('Processing images...');

      // Run analysis and simulation in parallel
      const [advice, simulation] = await Promise.all([
        analyzeHairstyle(currentPhotoBase64, desiredPhotoBase64),
        generateHairstyleSimulation(currentPhotoBase64, desiredPhotoBase64)
      ]);

      // Find salons if location is provided
      let salons: Salon[] = [];
      if (lat && lng && advice.styleName) {
        console.log(`Searching salons for style: ${advice.styleName}`);
        salons = await findSalons(advice.styleName, lat, lng);
      }

      res.json({
        success: true,
        data: {
          simulation,
          advice,
          salons
        }
      });

    } catch (error: any) {
      console.error('Process error:', error);
      res.status(500).json({
        success: false,
        error: error.message || '처리에 실패했습니다.'
      });
    }
  }
);

// POST /api/simulate - Simulation only
router.post(
  '/simulate',
  upload.fields([
    { name: 'currentPhoto', maxCount: 1 },
    { name: 'desiredPhoto', maxCount: 1 }
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as MulterFiles;

      if (!files?.currentPhoto?.[0] || !files?.desiredPhoto?.[0]) {
        res.status(400).json({
          success: false,
          error: 'Both currentPhoto and desiredPhoto are required'
        });
        return;
      }

      const currentPhotoBase64 = bufferToBase64(files.currentPhoto[0].buffer);
      const desiredPhotoBase64 = bufferToBase64(files.desiredPhoto[0].buffer);

      const simulation = await generateHairstyleSimulation(currentPhotoBase64, desiredPhotoBase64);

      res.json({
        success: true,
        data: { simulation }
      });

    } catch (error: any) {
      console.error('Simulate error:', error);
      res.status(500).json({
        success: false,
        error: error.message || '시뮬레이션에 실패했습니다.'
      });
    }
  }
);

// POST /api/analyze - Analysis only
router.post(
  '/analyze',
  upload.fields([
    { name: 'currentPhoto', maxCount: 1 },
    { name: 'desiredPhoto', maxCount: 1 }
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as MulterFiles;

      if (!files?.currentPhoto?.[0] || !files?.desiredPhoto?.[0]) {
        res.status(400).json({
          success: false,
          error: 'Both currentPhoto and desiredPhoto are required'
        });
        return;
      }

      const currentPhotoBase64 = bufferToBase64(files.currentPhoto[0].buffer);
      const desiredPhotoBase64 = bufferToBase64(files.desiredPhoto[0].buffer);

      const advice = await analyzeHairstyle(currentPhotoBase64, desiredPhotoBase64);

      res.json({
        success: true,
        data: { advice }
      });

    } catch (error: any) {
      console.error('Analyze error:', error);
      res.status(500).json({
        success: false,
        error: error.message || '분석에 실패했습니다.'
      });
    }
  }
);

// POST /api/salons - Salon search only
router.post('/salons', async (req: Request, res: Response): Promise<void> => {
  try {
    const { styleName, lat, lng } = req.body;

    if (!styleName || lat === undefined || lng === undefined) {
      res.status(400).json({
        success: false,
        error: 'styleName, lat, and lng are required'
      });
      return;
    }

    const salons = await findSalons(styleName, lat, lng);

    res.json({
      success: true,
      data: { salons }
    });

  } catch (error: any) {
    console.error('Salons error:', error);
    res.status(500).json({
      success: false,
      error: error.message || '미용실 검색에 실패했습니다.'
    });
  }
});
