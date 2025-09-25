import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    // Expect messages and optionally file_ids in request body
    const body = {
      model: "gpt-4.1",
      messages: req.body.messages,
      file_ids: req.body.file_ids || ["file-77Q2EgefNdvACeoyUvdai7", "file-WbkEvbRuJ1iETjr6VqqNVA", "file-6byQnrsSmtuzzf6JL85NAD", "file-YS4B3LDZNr9xpvBdPmXKvM", "file-7PKACPMC5kTdMNEa6yHuBM"], // 👈 support dynamic file_ids
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2", // required for file search
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () =>
  console.log("✅ Server running on http://localhost:3000")
);
