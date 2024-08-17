import { Groq as RinaAI } from "groq-sdk";

const GROQ_API = import.meta.env.VITE_GROQ;
const groq = new RinaAI({
  apiKey: GROQ_API,
  dangerouslyAllowBrowser: true,
});

export const requestToRinaAI = async (content) => {
  const reply = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content,
      },
    ],
    model: "llama3-70b-8192",
  });
  console.log("API Response:", reply); // Tambahkan log untuk memeriksa struktur respons
  // Menambahkan total token ke respons
  return {
    aiResponse: reply.choices[0].message.content,
    usage: reply.usage || {}, // Pastikan usage adalah objek meskipun tidak ada data
  };
};
