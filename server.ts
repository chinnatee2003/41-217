import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Support base64 image uploads from camera or file
app.use(express.json({ limit: '20mb' }));

// Initialize Google GenAI with recommended telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI-Powered Thai National ID Card OCR
app.post('/api/scan-thai-id', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'กรุณาส่งข้อมูลรูปภาพ (imageBase64)',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'ยังไม่ได้กำหนด GEMINI_API_KEY ในระบบ',
      });
    }

    // Strip data URL prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType.startsWith('image/') ? mimeType : 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: `You are an expert optical character recognition (OCR) and document extraction model specialized in Thai National Identification Cards (บัตรประจำตัวประชาชนไทย) for emergency medical rescue services (EMS / ฮุก 31).
Carefully inspect the Thai National ID card image and extract:
1. Identification number (เลขประจำตัวประชาชน 13 หลัก)
2. Thai Name with prefix (คำนำหน้า เช่น นาย/นาง/นางสาว/เด็กชาย/เด็กหญิง, ชื่อตัว, นามสกุล)
3. Full Name (คำนำหน้า + ชื่อ + นามสกุล)
4. Gender: 'ชาย' or 'หญิง'
5. Gender count string formatted for Thai EMS radio reports: 'ชาย 1 ราย' or 'หญิง 1 ราย'
6. Birth Date in Thai (e.g., '14 ม.ค. 2510')
7. Calculated Age in Thai years string (e.g., '59 ปี')
8. Address (ที่อยู่ตามบัตรประชาชน แบบละเอียดครบถ้วน ทั้งบ้านเลขที่ หมู่ ซอย ถนน ตำบล อำเภอ จังหวัด)

If any field is blurry or not legible, provide the best guess or empty string. Always return structured JSON strictly following the schema.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nationalId: {
              type: Type.STRING,
              description: '13-digit Thai National ID number',
            },
            title: {
              type: Type.STRING,
              description: 'Prefix title in Thai: นาย, นาง, นางสาว, etc.',
            },
            firstName: {
              type: Type.STRING,
              description: 'First name in Thai',
            },
            lastName: {
              type: Type.STRING,
              description: 'Last name in Thai',
            },
            fullName: {
              type: Type.STRING,
              description: 'Full name in Thai with title',
            },
            gender: {
              type: Type.STRING,
              description: 'ชาย or หญิง',
            },
            genderCount: {
              type: Type.STRING,
              description: 'ชาย 1 ราย or หญิง 1 ราย',
            },
            birthDate: {
              type: Type.STRING,
              description: 'Date of birth in Thai',
            },
            age: {
              type: Type.STRING,
              description: 'Calculated age string, e.g. 59 ปี',
            },
            address: {
              type: Type.STRING,
              description: 'Full address according to the ID card',
            },
            confidence: {
              type: Type.STRING,
              description: 'Confidence level: high, medium, low',
            },
          },
          required: ['fullName', 'genderCount', 'age', 'address'],
        },
      },
    });

    const textOutput = response.text?.trim();
    if (!textOutput) {
      throw new Error('ไม่ได้รับข้อมูลการตอบกลับจาก AI Model');
    }

    const parsedData = JSON.parse(textOutput);
    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('OCR Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'เกิดข้อผิดพลาดในการประมวลผลรูปภาพบัตรประชาชน',
    });
  }
});

// Vite Middleware for development / Static for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Hook 31 EMS Server running at http://localhost:${port}`);
  });
}

startServer();
