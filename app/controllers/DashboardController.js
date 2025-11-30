import User from "../models/User.js";
import Transaksi from "../models/Transaksi.js"
import Barang from '../models/Barang.js'
import Stok from '../models/Stok.js'

const total = async (grade) => {

    // 1. Ambil semua barang dengan grade tertentu
    const barang = await Barang.find({ grade: grade }, '_id'); // ambil _id saja
    const barang_Id = barang.map(b => b._id);

    // 2. Ambil stok yang sesuai barang Grade 
    const stok = await Stok.find({ barang: { $in: barang_Id } }); // asumsi field stok.barang adalah reference ke Barang

    // 3. Hitung total berat dan return
    return stok.reduce((acc, item) => acc + item.berat, 0);
}

export const dashboard = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalTransaksi = await Transaksi.countDocuments();
  const totalBarang = await Barang.countDocuments();

   const total_A = await total('Grade A');
   const total_B = await total('Grade B');
   const total_C = await total('Grade C');
  
  res.render("pages/dashboard/index", {
    title: "Dashboard",
    layout: "layouts/main",
    totalUsers,
    totalTransaksi,
    totalBarang,
    total_A,
    total_B,
    total_C
  });
};
