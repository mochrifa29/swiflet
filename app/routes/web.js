import express from "express";
import { processLogin, RegisterStore,loginPage,registerPage,logout } from "../controllers/AuthController.js";
import UserController from "../controllers/UserController.js";
import { dashboard } from "../controllers/DashboardController.js";
import BarangController from "../controllers/BarangController.js";
import StokController from "../controllers/StokController.js";
import TransaksiController from "../controllers/TransaksiController.js";
import multer from "multer";
import auth from "../middleware/auth.js"

const upload = multer({ storage: multer.memoryStorage() });



const router = express.Router();

// halaman login
router.get("/login",loginPage);
router.post("/auth", processLogin);
router.get('/logout',logout)

// GET /register → tampilkan form
router.get("/register",registerPage);
router.post("/register", RegisterStore);

// Dashboard
router.get("/dashboard",auth,dashboard);

// User
router.get("/user",auth,UserController.index);
    
router.get("/user/create",auth,UserController.create);
router.post("/user/store",auth,UserController.store);
router.post('/user/update/:id',auth,UserController.update);



// Barang
router.get("/barang",auth,BarangController.index);
router.get("/barang/create",auth,BarangController.create);
router.post("/barang/store",auth,upload.single("foto"),BarangController.store);
router.get("/barang/delete/:id",auth,BarangController.deleteBarang);
router.post("/barang/update/:id",auth,BarangController.update );
router.get("/barang/detail/:id",auth,BarangController.detail );


// Stok
router.get("/stok",auth,StokController.index);
router.get("/stok/create",auth,StokController.create );
router.post("/stok/store",auth,StokController.store );
router.get("/stok/delete/:id",auth,StokController.deleteStok );
router.post("/stok/update/:id",auth,StokController.update);
router.patch("/stok/ready/:id",auth,StokController.updateReady);
router.get("/stok/detail/:id",auth,StokController.detail);
router.post("/stok/upload-video/:id",auth,StokController.uploadVideo);

// Hapus video
router.post("/stok/delete-video/:id",auth,StokController.deleteVideo);



// Transaksi
router.get("/transaksi",auth,TransaksiController.index);
router.get("/transaksi/create",auth,TransaksiController.create);
router.post("/transaksi/store",auth,TransaksiController.store);
router.get("/transaksi/detail/:id",auth,TransaksiController.detail)

export default router;
