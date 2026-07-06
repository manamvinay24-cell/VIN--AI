exports.handler = async function (event) {
  // Allow only POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ reply: "Method not allowed" }),
    };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "Please type a message." }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          reply: "Gemini API key is missing. Add GEMINI_API_KEY in Netlify environment variables.",
        }),
      };
    }

    const model = "gemini-2.5-flash";

    const prompt = `
You are VINAI, a friendly AI assistant inside a student career app.

Rules:
- Reply in simple English.
- Keep answers clear and beginner-friendly.
- Help with coding, resumes, internships, career, learning, and general questions.
- Do not use Telugu unless the user asks.
- Be supportive and practical.

User message: ${message}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return {
        statusCode: 500,
        body: JSON.stringify({
          reply: "AI server error. Please check your Gemini API key and try again.",
        }),
      };
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I could not generate a response.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("Function Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "Something went wrong in the AI server.",
      }),
    };
  }
};
