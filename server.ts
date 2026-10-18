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

    // Use gemini-2.5-flash for reliable multimodal OCR and document reading
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType && mimeType.startsWith('image/') ? mimeType : 'image/jpeg',
            data: cleanBase64,
          },
        },
        {
          text: `You are an expert OCR specialist in Thai National Identification Cards (บัตรประจำตัวประชาชนไทย) for Thai Emergency Medical Services (ฮุก 31 กู้ชีพ).
Carefully read and transcribe the EXACT text printed on the provided Thai National ID Card image.

Guidelines:
1. "เลขประจำตัวประชาชน" (13 digits): Usually at top right (e.g. 1 3099 00841 23 4). Format as 1-3099-00841-23-4.
2. "ชื่อตัวและชื่อสกุล" (Thai Name): Note that on Thai ID cards:
   - First line has title + first name (e.g. "นาย ธนากร" or "นางสาว วิภาดา")
   - Second line has last name (e.g. "บุญรอด" or "รุ่งเรือง")
   - You MUST combine both to produce the complete fullName: e.g. "นายธนากร บุญรอด"
3. "เกิดวันที่" (Date of birth): e.g. "15 พ.ค. 2531" or "8 ต.ค. 2540".
4. "อายุ" (Age): Calculate exact age using the current Buddhist year 2569 (CE 2026).
   Formula: 2569 - (พ.ศ.เกิด). For example, if born in 2531, age is 38 ปี. If born in 2540, age is 29 ปี. Return e.g. "38 ปี".
5. "เพศ" (Gender): "ชาย" if title is นาย/เด็กชาย, "หญิง" if title is นาง/นางสาว/เด็กหญิง.
6. "genderCount": Format as "ชาย 1 ราย" or "หญิง 1 ราย" (or "เด็ก 1 ราย" if child).
7. "ที่อยู่" (Address): Look at lower-left of the card under "ที่อยู่". Transcribe the complete address lines: บ้านเลขที่ หมู่ ซอย ถนน ตำบล อำเภอ จังหวัด (e.g. "99/4 ม.5 ต.หัวทะเล อ.เมืองนครราชสีมา จ.นครราชสีมา").
8. "rawText": A short string of the main Thai text detected on the card.

Be extremely precise. Transcribe the real text from the image without hallucinating or inventing names. Return valid JSON.`,
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nationalId: {
              type: Type.STRING,
              description: '13-digit Thai National ID number formatted as X-XXXX-XXXXX-XX-X',
            },
            title: {
              type: Type.STRING,
              description: 'Prefix title in Thai (นาย, นาง, นางสาว, etc.)',
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
              description: 'Full name in Thai with title (เช่น นายสมชาย แสนสุข)',
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
              description: 'Date of birth in Thai, e.g. 15 พ.ค. 2531',
            },
            age: {
              type: Type.STRING,
              description: 'Calculated age in years, e.g. 38 ปี',
            },
            address: {
              type: Type.STRING,
              description: 'Complete Thai address from the card',
            },
            rawText: {
              type: Type.STRING,
              description: 'Raw text lines extracted from card',
            },
            confidence: {
              type: Type.STRING,
              description: 'high, medium, or low',
            },
          },
          required: ['fullName', 'genderCount', 'address'],
        },
      },
    });

    const textOutput = response.text?.trim();
    if (!textOutput) {
      throw new Error('ไม่ได้รับข้อมูลการตอบกลับจาก AI Model');
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(textOutput);
    } catch {
      // If direct JSON parse fails, try extracting from code fence
      const match = textOutput.match(/\{[\s\S]*\}/);
      if (match) {
        parsedData = JSON.parse(match[0]);
      } else {
        throw new Error('ไม่สามารถแปลงผลลัพธ์เป็น JSON ได้');
      }
    }

    // Server-side post-processing and sanity checks
    const currentBE = 2569; // Current Buddhist Era for 2026

    // Ensure full name is clean
    if (!parsedData.fullName && (parsedData.firstName || parsedData.lastName)) {
      parsedData.fullName = `${parsedData.title || ''} ${parsedData.firstName || ''} ${parsedData.lastName || ''}`.trim();
    }

    // Auto-calculate age if missing or incorrect
    if (!parsedData.age || parsedData.age === '0 ปี' || parsedData.age === '') {
      if (parsedData.birthDate) {
        const yearMatch = parsedData.birthDate.match(/25\d{2}/) || parsedData.birthDate.match(/19\d{2}|20\d{2}/);
        if (yearMatch) {
          const yr = parseInt(yearMatch[0], 10);
          if (yr >= 2400 && yr <= currentBE) {
            parsedData.age = `${currentBE - yr} ปี`;
          } else if (yr >= 1900 && yr <= 2026) {
            parsedData.age = `${2026 - yr} ปี`;
          }
        }
      }
    }

    // Auto-fix gender and genderCount
    const nameStr = (parsedData.fullName || '') + (parsedData.title || '');
    if (nameStr.includes('นาง') || nameStr.includes('หญิง') || nameStr.includes('น.ส.') || parsedData.gender === 'หญิง') {
      parsedData.gender = 'หญิง';
      parsedData.genderCount = nameStr.includes('เด็กหญิง') || nameStr.includes('ด.ญ.') ? 'เด็ก 1 ราย' : 'หญิง 1 ราย';
    } else {
      parsedData.gender = 'ชาย';
      parsedData.genderCount = nameStr.includes('เด็กชาย') || nameStr.includes('ด.ช.') ? 'เด็ก 1 ราย' : 'ชาย 1 ราย';
    }

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
