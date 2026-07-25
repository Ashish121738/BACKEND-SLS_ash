import ai from "../index.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await ai.models.generateContent({
     model: "gemini-3.5-flash",
      contents: message,
    });
    console.log(response);

    res.json({
      reply: response.text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
};