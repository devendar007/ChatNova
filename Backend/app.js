import express from "express";
import morgan from 'morgan';
import  userRoutes from "./routes/user.routes.js"
import aiRoutes from "./routes/ai.routes.js"
import projectRoutes from "./routes/project.routes.js"
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
connectDB();
const app=express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/users',userRoutes);
app.use('/projects',projectRoutes);
app.use("/ai", aiRoutes)
export default app;