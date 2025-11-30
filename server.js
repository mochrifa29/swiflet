
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import { fileURLToPath } from "url";

import mongoose from "mongoose";


import webRoutes from "./app/routes/web.js";


dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
app.use(cookieParser());
app.use(expressLayouts);
// app.set('layout', 'layouts/main');

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app", "views"));

// Static files
app.use(express.static(path.join(__dirname, "app", "public")));

// Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes
app.use("/", webRoutes);

//mongodb

try {
  await mongoose.connect(process.env.DATABASE);
  console.log("Database Connect Success");
} catch (error) {
  console.log(error);
}

app.listen(port, () => console.log(`Server berjalan di port ${port}`));
