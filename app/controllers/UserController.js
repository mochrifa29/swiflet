import User from "../models/User.js";
import bcrypt from "bcrypt";

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

export const update = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User tidak ditemukan"
      });
    }

    // Set data tapi belum save
    user.name = name;
    user.email = email;
    user.role = role;

    if (password && password.trim() !== "") {
      user.password = password; // biarkan mongoose validasi
    }

    // Validasi mongoose
    await user.validate();

    // Hash password jika diisi
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.json({
      status: true,
      message: "User berhasil diperbarui",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.log(err);

    // Jika error validasi mongoose
    if (err.name === "ValidationError") {
      const errors = {};
      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }

      return res.status(400).json({
        status: false,
        message: "Validasi gagal",
        errors
      });
    }

    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server"
    });
  }
};




export default{index,create,store,update}


