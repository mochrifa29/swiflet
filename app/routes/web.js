import express from "express";
import { auth, RegisterStore,loginPage,registerPage,logout } from "../controllers/AuthController.js";
import UserController from "../controllers/UserController.js";
import { dashboard } from "../controllers/DashboardController.js";
import BarangController from "../controllers/BarangController.js";
import StokController from "../controllers/StokController.js";
import TransaksiController from "../controllers/TransaksiController.js";
import { mustLogin } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/role.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });



const router = express.Router();

// halaman login
router.get("/login",loginPage);
router.post("/auth", auth);
router.get('/logout',logout)

// GET /register → tampilkan form
router.get("/register",registerPage);
router.post("/register", RegisterStore);

// Dashboard
router.get("/dashboard",mustLogin, dashboard);

// User
router.get("/user",mustLogin,roleMiddleware('user'),UserController.index);
    
router.get("/user/create",mustLogin, UserController.create);
router.post("/user/store",mustLogin, UserController.store);


// Barang
router.get("/barang",mustLogin,BarangController.index);
router.get("/barang/create",mustLogin,BarangController.create);
router.post("/barang/store",mustLogin,upload.single("foto"),BarangController.store);
router.get("/barang/delete/:id",mustLogin,BarangController.deleteBarang);
router.post("/barang/update/:id",mustLogin,BarangController.update );
router.get("/barang/detail/:id",mustLogin,BarangController.detail );


// Stok
router.get("/stok",mustLogin, StokController.index);
router.get("/stok/create",mustLogin,StokController.create );
router.post("/stok/store",mustLogin,StokController.store );
router.get("/stok/delete/:id",mustLogin,StokController.deleteStok );
router.post("/stok/update/:id",mustLogin,StokController.update);
router.patch("/stok/ready/:id",mustLogin,StokController.updateReady);
router.get("/stok/detail/:id",mustLogin,StokController.detail);
router.post("/stok/upload-video/:id",mustLogin,upload.single("video"),StokController.uploadVideo);
// Hapus video
router.post("/stok/delete-video/:id",mustLogin,StokController.deleteVideo);



// Transaksi
router.get("/transaksi",mustLogin, TransaksiController.index);
router.get("/transaksi/create",mustLogin, TransaksiController.create);
router.post("/transaksi/store",mustLogin, TransaksiController.store);
router.get("/transaksi/detail/:id",mustLogin,TransaksiController.detail)

export default router;
