import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors({
  origin: "http://localhost:5500", // Change to your frontend URL when deployed
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// In-memory session (for demo)
let sessions = {};

// Google login
app.post("/auth/login", async (req, res) => {
  const { credential } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  const sessionId = Math.random().toString(36).substring(2);
  sessions[sessionId] = payload;
  res.cookie("sessionId", sessionId, { httpOnly:true });
  res.send({ success:true });
});

// Get user info
app.get("/auth/me", (req,res)=>{
  const session = sessions[req.cookies.sessionId];
  if(session) res.send(session);
  else res.send({});
});

// Logout
app.post("/auth/logout", (req,res)=>{
  delete sessions[req.cookies.sessionId];
  res.clearCookie("sessionId");
  res.send({ success:true });
});

// AI chat endpoint
app.post("/api/chat", async (req,res)=>{
  const message = req.body.message;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model:"gpt-3.5-turbo",
      messages:[{ role:"user", content: message }]
    })
  });
  const data = await response.json();
  res.json({ reply: data.choices[0].message.content });
});

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
