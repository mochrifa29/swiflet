import Stok from "../models/Stok.js";
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
  const stoks = await Stok.find({ready:true}).populate('barang');
  res.render("pages/transaksi/create", {
    title: "Form Transaction",
    layout: "layouts/main",
    stoks
  });
};

function generateInvoice() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  // Ambil 4 digit terakhir dari timestamp
  const shortTime = String(Date.now()).slice(-4);

  // Hasil akhir
  return `INV-${yyyy}${mm}${dd}-${shortTime}`;
}


export const store = async (req, res) => {
   
    
       const data = req.body;


      // Kurangi stok
        for (const item of data.items) {
          const stokId = item.id;
          const stok = await Stok.findById(stokId);

           if (!stok) {
              console.log("Stok tidak ditemukan untuk ID:", stokId);
              continue;
            }

            console.log("Berat awal:", stok.berat, "Dikurangi:", item.berat);

            stok.berat -= item.berat;

            if (stok.berat < 0) stok.berat = 0;

            await stok.save();
            console.log("Berat akhir:", stok.berat)
        }

       await Transaksi.create({
            invoice:generateInvoice(),
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

export const updateStok = async (req,res) => {
  try {
        const { id, berat } = req.body;

        const stok = await Stok.findById(id);

        if (!stok) {
            return res.json({ success: false, message: "Stok tidak ditemukan" });
        }

        // Cek apakah cukup
        if (stok.berat < berat) {
            return res.json({ success: false, message: "Stok tidak cukup" });
        }

        // Kurangi
        stok.berat -= berat;

        await stok.save();

        res.json({
            success: true,
            message: "Stok berhasil dikurangi",
            data: stok
        });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Terjadi kesalahan" });
    }
}

export const detail = async(req,res) => {
   const id = req.params.id;

    try {
        // Ambil data transaksi dari database
        const transaksi = await Transaksi.findById(id) 
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


export default{index,create,store,detail,updateStok}