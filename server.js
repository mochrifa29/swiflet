
import express from "express";
import dotenv from "dotenv";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import { fileURLToPath } from "url";

import mongoose from "mongoose";


import webRoutes from "./app/routes/web.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
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

//session
app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 jam

      // PENTING UNTUK VERCEL:
      secure: process.env.NODE_ENV === 'production', // Hanya secure=true di produksi (HTTPS)
      sameSite: 'Lax', // Membantu mengatasi masalah cross-site
    },
  })
);

// PENTING UNTUK VERCEL:
// Vercel adalah proxy. Express perlu tahu ini untuk menangani cookies yang aman.
app.set('trust proxy', 1); 

app.use((req, res, next) => {
  res.locals.user = req.session.userName || null;
  res.locals.role = req.session.role || null;
  next();
});




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
