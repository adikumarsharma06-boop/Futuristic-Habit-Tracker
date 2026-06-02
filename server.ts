/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Safe initialize of Google Gemini API
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("Gemini Client successfully initialized server-side.");
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI client:", err);
    }
  } else {
    console.warn("GEMINI_API_KEY environment variable not detected. Serving backup local mock quotes.");
  }

  // Server-side cache to protect against Gemini API rate limits/quota exhaustion (429)
  let serverCachedQuote: { text: string; author: string } | null = null;
  let serverCachedTime: number = 0;
  const CACHE_TTL = 1000 * 60 * 60 * 4; // Cache quote for 4 hours to minimize API calls

  // --- API ROUTE: FETCH FUTURE MOTIVATIONAL QUOTES ---
  app.get("/api/gemini/quote", async (req, res) => {
    const fallbackQuotes = [
      { text: "The future is build-in-progress. Committing your actions one line at a time.", author: "Synthesizer Alpha" },
      { text: "Consistency is structural integrity. Strengthen your habits to survive the digital tide.", author: "Mainframe Core" },
      { text: "Unlocking new levels of potential requires daily calibration. Proceed with focus.", author: "Apex Chronos" },
      { text: "Your daily streak is the fuel of tomorrow's mainframe. Do not let the signal fade.", author: "Cyber Sentinel" },
      { text: "Neurons that fire together, wire together. Calibrating system synapses...", author: "Neuro-Link Oracle" }
    ];

    const forceReload = req.query.force === "true";
    const now = Date.now();

    // Serve cached quote immediately if it's fresh and force reload isn't requested
    if (serverCachedQuote && !forceReload && (now - serverCachedTime) < CACHE_TTL) {
      return res.json(serverCachedQuote);
    }

    // If Gemini client is unavailable, serve a random local quote
    if (!ai) {
      const selected = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      return res.json(selected);
    }

    try {
      let rawText = "";
      
      try {
        // Attempt primary model: gemini-3.5-flash
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: "Generate a short, exceptionally powerful, cyberpunk, futuristic, or high-tech motivational quote for a modern habit tracker app. It should inspire a developer, tech explorer, or habit designer. Do not include wordy intros, return purely JSON.",
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                text: {
                  type: Type.STRING,
                  description: "The motivational quote itself. Dynamic, bold, techy, and inspirational."
                },
                author: {
                  type: Type.STRING,
                  description: "A cool futuristic sci-fi or system-sounding writer or computer entity, like 'Neural Core Delta' or 'Synthetic Sage'."
                }
              },
              required: ["text", "author"]
            }
          }
        });
        rawText = response.text || "";
      } catch (primaryErr: any) {
        // Check if error is due to high demand, rate limits, or transient unavailability (e.g. 503, 429) to print clean cyber status logs
        const isTransientOrQuota = primaryErr?.status === 429 || primaryErr?.status === 503 ||
          String(primaryErr).includes("quota") || String(primaryErr).includes("429") || String(primaryErr).includes("503") || String(primaryErr).includes("demand");

        if (isTransientOrQuota) {
          console.info(`[Info] Gemini primary (gemini-3.5-flash) busy/unsupported. Fallback calibration active...`);
        } else {
          console.warn("[Warning] Primary model failed, calibrating fallback model...", primaryErr.message || primaryErr);
        }
        
        // Attempt fallback model: gemini-flash-latest
        const response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: "Generate a short, exceptionally powerful, cyberpunk, futuristic, or high-tech motivational quote for a modern habit tracker app. It should inspire a developer, tech explorer, or habit designer. Do not include wordy intros, return purely JSON.",
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                text: {
                  type: Type.STRING,
                  description: "The motivational quote itself. Dynamic, bold, techy, and inspirational."
                },
                author: {
                  type: Type.STRING,
                  description: "A cool futuristic sci-fi or system-sounding writer or computer entity, like 'Neural Core Delta' or 'Synthetic Sage'."
                }
              },
              required: ["text", "author"]
            }
          }
        });
        rawText = response.text || "";
      }

      if (!rawText) {
        throw new Error("Empty response from both primary and fallback Gemini models.");
      }

      const jsonRes = JSON.parse(rawText.trim());
      
      // Update our server memory cache with the new generated quote
      if (jsonRes && jsonRes.text && jsonRes.author) {
        serverCachedQuote = jsonRes;
        serverCachedTime = Date.now();
      }

      res.json(jsonRes);
    } catch (error: any) {
      const isTransientOrQuota = error?.status === 429 || error?.status === 503 ||
        String(error).includes("quota") || String(error).includes("429") || String(error).includes("503") || String(error).includes("demand") || String(error).includes("UNAVAILABLE");

      if (isTransientOrQuota) {
        console.info("[Info] Gemini busy, rate-limited or unavailable. Serving cached quote or fallback.");
      } else {
        console.warn("[Warning] Gemini quote loader experienced failure:", error.message || error);
      }
      
      // If we have any cached quote (even if expired (> 4h)), serve it as recovery rather than fallback list
      if (serverCachedQuote) {
        return res.json(serverCachedQuote);
      }

      const selected = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      res.json(selected);
    }
  });

  // --- API ROUTE: HEALTH CHECK ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: ai ? "online" : "fallback" });
  });

  // --- VITE MIDDLEWARE SETUP FOR DEV VS PRODUCTION ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
