import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const openaiApiKey = process.env.OPENAI_API_KEY;

// Disable the default body parser to handle file uploads manually
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// Check if the request method is POST, if not, return a 405 Method Not Allowed status
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract the file from the request body
  const { file } = req.body;

//   check that file is present
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

//   appending file to a constructor <FormData>
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log(openaiApiKey);
    
    // send file to openai
    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'multipart/form-data',
      },
    });
// transcription result
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error transcribing file:', error);
    return res.status(500).json({ error: 'Failed to transcribe file' });
  }
}
