import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

console.log("Wavo AI Gateway LIVE");

// SAFE MODELS ONLY
const MODELS = {
  GPT: "openai/gpt-4o-mini",
  CLAUDE: "anthropic/claude-3.5-sonnet",
  DEEPSEEK: "deepseek/deepseek-chat"
};

// SIMPLE ROUTER (NO OVERCOMPLICATION)
function selectModel(prompt) {
  const p = prompt.toLowerCase();

  if (p.includes("debug") || p.includes("error") || p.includes("fix")) {
    return MODELS.DEEPSEEK;
  }

  if (p.includes("architecture") || p.includes("design")) {
    return MODELS.CLAUDE;
  }

  if (p.includes("clean") || p.includes("refactor")) {
    return MODELS.CLAUDE;
  }

  return MODELS.GPT;
}

// OPENROUTER CALL
async function callOpenRouter(model, prompt) {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model,
      messages: [
        {
          role: "system",
          content: "You are a senior software engineer. Return clean production code."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Wavo"
      }
    }
  );

  return res.data.choices[0].message.content;
}

// MAIN ENDPOINT
app.post("/ai/run", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const model = selectModel(prompt);
    const output = await callOpenRouter(model, prompt);

    res.json({
      model,
      output
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});