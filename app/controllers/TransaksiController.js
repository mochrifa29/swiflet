import Barang from "../models/Barang.js";
import Transaksi from "../models/Transaksi.js";



export const index = async (req, res) => {

  const transaksi = await Transaksi.find();

  res.render("pages/transaksi/index", {
    title: "Data Transaction",
    layout: "layouts/main",
    transaksi
  });
};

export const create = async (req, res) => {
   // ambil semua barang dari database
  const barangs = await Barang.find().sort({ nama_barang: 1 });
  res.render("pages/transaksi/create", {
    title: "Form Transaction",
    layout: "layouts/main",
    barangs
  });
};

export const store = async (req, res) => {
   
    
       const data = req.body;

       // Ambil tanggal sekarang
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');

      // Ambil 4 digit terakhir timestamp
      const shortTime = String(Date.now()).slice(-4);

      // Buat kode invoice sederhana
      const kodeInvoice = `INV-${yyyy}${mm}${dd}-${shortTime}`;

       await Transaksi.create({
            invoice:kodeInvoice,
            nama_pembeli: data.nama_pembeli,
            items: data.items,
            total_berat: data.total_berat,
            total_belanja: data.total_belanja,
            bayar: data.bayar,
            kembalian: data.kembalian,
            keterangan : data.keterangan
       })
      res.json({ success: true })
   

    
};

export const detail = async(req,res) => {
   const id = req.params.id;

    try {
        // Ambil data transaksi dari database
        const transaksi = await Transaksi.findById(id).populate('items'); 
        if (!transaksi) return res.status(404).send('Transaksi tidak ditemukan');

        res.render('pages/transaksi/detailTransaksi', { 
            title: 'Detail Transaksi', 
            layout: "layouts/main",
            transaksi 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan server');
    }
}


export default{index,create,store,detail}