import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const MAX_ATTEMPTS = 2;

app.post('/api/generate-application', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: missing API key' });
  }

  const { profile, job } = req.body;
  if (!profile || !job) {
    return res.status(400).json({ error: 'Missing profile or job data' });
  }

  const systemInstruction = `You are a helpful assistant that writes short, professional job application messages for rural Rwandan youth. Write in a warm, direct, confident tone. 3-4 sentences maximum. If language is 'kinyarwanda', write entirely in Kinyarwanda. If language is 'english', write in English. Return ONLY the application message text, no extra formatting or labels.`;

  const userPrompt = `Write a job application message for:
Applicant: ${profile.name} from ${profile.location}
Skills: ${(profile.skills || []).join(', ')}
Availability: ${profile.availability}
Language: ${profile.language}

Job:
Title: ${job.title}
Employer: ${job.employer}
Location: ${job.location}
Pay: ${job.payRate}`;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }] }],
        }),
      });

      if (response.status === 429 && attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }

      if (!response.ok) {
        const errBody = await response.text();
        console.error(`Gemini API error (${response.status}):`, errBody);
        return res.status(502).json({ error: `Gemini API failed: ${response.status}` });
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        return res.status(502).json({ error: 'Empty response from Gemini' });
      }

      return res.json({ text: text.trim() });
    } catch (err) {
      console.error('Gemini fetch error:', err);
      if (attempt === MAX_ATTEMPTS) {
        return res.status(500).json({ error: 'Failed to reach Gemini API' });
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
});

app.listen(PORT, () => {
  console.log(`Akazi Connect API running on http://localhost:${PORT}`);
});
