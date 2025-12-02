import { supabase } from "../config/supabase.js";
import Barang from "../models/Barang.js";
import Stok from "../models/Stok.js";

export const index = async (req, res) => {
  const stok = await Stok.find().populate("barang"); // ambil seluruh data
  res.render("pages/stok/index", {
    title: "Stok Barang",
    layout: "layouts/main",
    stok
  });
};

export const create = async (req, res) => {
    // ambil semua barang dari database
    const barangs = await Barang.find().sort({ nama_barang: 1 }); // optional: sort alphabet
  
    res.render("pages/stok/create", {
    title: "Form Stok Barang",
    layout: "layouts/main",
    barangs,
    errors: {},
    oldData: {}
  });
};

export const store = async (req, res) => {
  try {
     // Semua stok baru otomatis belum ready
    const data = {
      barang: req.body.barang,
      berat: req.body.berat,
      ready: false,  // default false
    };

    await Stok.create(data);
    res.redirect('/stok');
  } catch (error) {
     const errors = {};
    if (error.errors) {
      for (const key in error.errors) {
        errors[key] = error.errors[key].message;
      }
    }
     // ambil semua barang dari database
    const barangs = await Barang.find().sort({ nama_barang: 1 });
    return res.render('pages/stok/create', { 
        layout: "layouts/main",
        errors, 
        oldData: req.body,
        barangs,
    });
    
  }

};

export const updateReady = async (req,res) => {
   try {
    const { ready } = req.body;

    const stok = await Stok.findByIdAndUpdate(req.params.id, {
      ready: ready
    }).populate('barang');

    return res.json({ success: true,nama_barang: stok.barang.nama_barang, grade:stok.barang.grade });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false });
  }
}

export const deleteStok = async (req,res) => {
    try {
      const { id } = req.params;
     
      await Stok.findByIdAndDelete(id);
      res.redirect('/stok')
    } catch (error) {
      
    }
}


export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { berat } = req.body;

    const stok = await Stok.findById(id);
    if (!stok) {
      return res.status(404).json({
        status: false,
        message: "Data stok tidak ditemukan"
      });
    }

    // =========================
    // VALIDASI MANUAL BERAT
    // =========================
    if (!berat || berat === "") {
      return res.status(400).json({
        status: false,
        errors: {
          berat: "Berat wajib diisi"
        }
      });
    }

    stok.berat = berat;

    // simpan dan tangkap error mongoose
    await stok.save();

    return res.json({
      status: true,
      message: "Berhasil mengupdate stok"
    });

  } catch (err) {
    // menangkap error mongoose
    if (err.name === "ValidationError") {
      const errors = {};
      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }

      return res.status(400).json({
        status: false,
        errors
      });
    }

    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server"
    });
  }
};


export const detail = async (req, res) => {
  try {
    const stok = await Stok.findById(req.params.id)
      .populate("barang");

    if (!stok) {
      return res.redirect("/stok");
    }

    res.render("pages/stok/detail", {
      layout: "layouts/main",
      error: req.query.error,
      stok,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
    });

  } catch (error) {
    console.log(error);
    res.redirect("/stok");
  }
};

export const uploadVideo = async (req, res) => {
  try {
    const { video_url, video_path } = req.body;
    const id = req.params.id;

    await Stok.findByIdAndUpdate(id, {
      video_url,
      video_path
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Gagal menyimpan URL video" });
  }
};


// Hapus video dari Supabase + database
export const deleteVideo = async (req, res) => {
  try {
    const id = req.params.id;

    // Ambil stok dari database
    const stok = await Stok.findById(id);
    if (!stok) {
      return res.redirect(`/stok/detail/${id}?error=Stok tidak ditemukan`);
    }

    if (!stok.video_url || stok.video_url === "") {
      return res.redirect(`/stok/detail/${id}?error=Tidak ada video untuk dihapus`);
    }

    

    // Hapus file di Supabase
    const { error: supabaseError } = await supabase.storage
      .from("videos")
      .remove([stok.video_path]);

    if (supabaseError) {
      console.log(supabaseError);
      return res.redirect(`/stok/detail/${id}?error=Gagal menghapus video di server`);
    }

    // Hapus video_url di database
    await Stok.findByIdAndUpdate(id, { video_url: "" });

    res.redirect(`/stok/detail/${id}?success=Video berhasil dihapus`);

  } catch (err) {
    console.log(err);
    res.redirect(`/stok/detail/${req.params.id}?error=Terjadi error saat menghapus video`);
  }
};



export default {index,create,store,update,deleteStok,updateReady,detail,uploadVideo,deleteVideo}