import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
dotenv.config();      

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods : ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Content-Length", "X-Requested-With"],

  optionsSuccessStatus: 200,
};
app.use(express.json())
app.use(cors(corsOptions));
app.use(cookieParser())
export const prisma = new PrismaClient();

app.use("/api/auth",authRoutes);

app.get('/',(req,res) =>{
res.send("hello world!");
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// the most important thing is to load all the enviroement varaiable
process.on("SIGINT",async()=>{
  await prisma.$disconnect();
  process.exit();
})