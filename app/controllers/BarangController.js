import { supabase } from "../config/supabase.js";
import Barang from "../models/Barang.js";


export const index = async (req, res) => {

   const barang = await Barang.find(); // ambil seluruh data
    res.render("pages/barang/index", {
      title: "Data Barang",
      layout: "layouts/main",
      barang
    });
};

export const create = (req, res) => {
  res.render("pages/barang/create", {
    title: "Form Barang",
    layout: "layouts/main",
    errors: {},
    oldData: {}
  });
};

export const store = async (req, res) => {
  try {
    let imageUrl = null;
    const file = req.file;
    const fileName = `barang/${Date.now()}-${file.originalname}`;
    // Upload file jika ada
    if (file) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) throw new Error("Upload gagal: " + uploadError.message);

      console.log("Upload sukses:", uploadData);

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
      console.log("Public URL:", imageUrl);
    }

    // Simpan ke database
    await Barang.create({
      ...req.body,
      foto: imageUrl,
      fileName: fileName // untuk delete nanti
    });

    res.redirect("/barang");
  } catch (error) {
    console.error("Terjadi error:", error);

    const errors = {};
    if (error.errors) {
      for (const key in error.errors) {
        errors[key] = error.errors[key].message;
      }
    } else {
      errors.general = error.message;
    }

    return res.render("pages/barang/create", {
      layout: "layouts/main",
      errors,
      oldData: req.body,
    });
  }
};


export const update = async (req, res) => {

    try {
    const { id } = req.params;
    const { nama_barang} = req.body;

    const updateData = {};
    if (nama_barang) updateData.nama_barang = nama_barang;

    await Barang.findByIdAndUpdate(id, updateData);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
}

export const deleteBarang = async (req, res) => {
  try {
    const { id } = req.params;
    const barang = await Barang.findById(id);
    
    if (barang && barang.fileName) {
      const { data, error } = await supabase.storage
        .from("images")
        .remove([barang.fileName]); // HARUS sama persis dengan fileName saat upload

      if (error) {
        console.error("Gagal hapus file di Supabase:", error);
      } else {
        console.log("File Supabase dihapus:", data);
      }
    }
    // Hapus MongoDB
    await Barang.findByIdAndDelete(id);
    res.redirect('/barang');
  } catch (error) {
    console.error("Error delete barang:", error);
    res.redirect('/barang');
  }
};

export const detail = async (req,res) => {
  const barang = await Barang.findById(req.params.id);
  if (!barang) return res.status(404).send('Barang tidak ditemukan');
  res.render('pages/barang/detail', 
     { 
        layout: "layouts/main",
        barang, 
        title: `Detail ${barang.nama_barang}`
     }
    );
}





export default {index,create,store,update,deleteBarang,detail}
