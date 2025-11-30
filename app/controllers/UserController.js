import User from "../models/User.js";


export const index = async (req, res) => {
  try {
    const users = await User.find(); // ambil seluruh data
    res.render("pages/user/index", {
      title: "Data Users",
      layout: "layouts/main",
      users, // kirim ke ejs
      errors: {},
      oldData: {},
    });
  } catch (error) {
    res.send(error.message);
  }
};

export const create = (req,res) => {
   res.render("pages/user/create", {
      title: "Data Users",
      layout: "layouts/main",
      errors: {},
      oldData: {}
    });
}

export const store = async (req, res) => {

  try {
   
     await User.create(req.body);
     res.redirect('/user');
  } catch (error) {
     const errors = {};
    if (error.errors) {
      for (const key in error.errors) {
        errors[key] = error.errors[key].message;
      }
    } else {
      errors.general = error.message;
    }

    return res.render('pages/user/create', { 
        layout: "layouts/main",
        errors, 
        oldData: req.body
    });
  }
 
  // try {
  //   const { email, password,name } = req.body;
  //   const errors = {};

  //   // Validasi input
  //   if (!name) errors.name = "Name wajib diisi";
  //   if (!email) errors.email = "Email wajib diisi";
  //   if (!password) errors.password = "Password wajib diisi";

  //   // Cek jika email sudah terdaftar
  //   if (email) {
  //     const existingUser = await User.findOne({ email });
  //     if (existingUser) errors.email = "Email sudah digunakan";
  //   }

  //   // Jika ada error, render ulang form dengan pesan error
  //   if (Object.keys(errors).length > 0) {
  //     return res.render('pages/user/create', { 
  //       layout: "layouts/main",
  //       errors, 
  //       oldData: { name,email } // agar field email tetap terisi
  //     });
  //   }

   

  //   // Simpan user baru
  //   const user = new User({
  //     email,
  //     password
  //   });

  //   await user.save();

  //   // Redirect ke list user atau halaman sukses
  //   res.redirect('/user'); 

  // } catch (error) {
  //   console.error(error);
  //   res.send("Terjadi kesalahan: " + error.message);
  // }
};

export default{index,create,store}


