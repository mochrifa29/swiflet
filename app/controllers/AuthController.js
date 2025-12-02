import jwt from "jsonwebtoken"
import User from "../models/User.js";
import bcrypt from "bcrypt"

export const loginPage = (req, res) => {
  res.render("pages/auth/login/index", {
    title: "Login",
    layout: "layouts/auth",
    success: req.query.success || null,
    errors: {}, // object error kosong
    oldData: {},
  });
};

export const registerPage = (req, res) => {
  res.render("pages/auth/register/index", {
    title: "Register",
    layout: "layouts/auth",
    errors: {},
    oldData: {},
  });
};

export const processLogin = async (req, res) => {
  const { email, password } = req.body;
  const errors = [];

  // 1️⃣ Validasi manual dulu (tidak boleh kosong)
  if (!email || email.trim() === "") {
    errors.push("Email tidak boleh kosong");
  }
  if (!password || password.trim() === "") {
    errors.push("Password tidak boleh kosong");
  }

  if (errors.length > 0) {
    return res.render("pages/auth/login/index", {
      title: "Login",
      layout: "layouts/auth",
      errors,
      oldData: { email },
    });
  }

  // 2️⃣ Cari user
  const user = await User.findOne({ email });
  if (!user) {
    return res.render("pages/auth/login/index", {
      title: "Login",
      layout: "layouts/auth",
      errors: ["Email tidak ditemukan"],
      oldData: { email },
    });
  }

  // 3️⃣ Cek password
  const match = await user.comparePassword(password);
  if (!match) {
    return res.render("pages/auth/login/index", {
      title: "Login",
      layout: "layouts/auth",
      errors: ["Password salah"],
      oldData: { email },
    });
  }

  // 4️⃣ Buat token
  const token = jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // 5️⃣ Simpan token ke cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,   // ubah ke true jika deploy https
    sameSite: "lax",
  });

  res.redirect("/dashboard");
};



export const RegisterStore = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    return res.render("pages/auth/login/index", {
      title: "Login",
      layout: "layouts/auth",
      success: "Account created successfully",
      errors: {}, // tambahkan
      oldData: {}, // jika dipakai di form login
    }); // misal langsung ke login
  } catch (error) {
    const { password, confirm_password } = req.body;
    // ambil pesan error dari Mongoose
    const errors = {};

    //Validasi Confirm Password
    if (!confirm_password) {
      errors.confirm_password = "Confirm Password wajib diisi";
    } else if (password !== confirm_password) {
      errors.confirm_password = "Password tidak sama";
    }

    if (error.errors) {
      for (const key in error.errors) {
        errors[key] = error.errors[key].message;
      }
    } else {
      errors.general = error.message;
    }

    return res.render("pages/auth/register/index", {
      title: "Register",
      layout: "layouts/auth",
      errors,
      oldData: req.body,
    });
  }
};

export const logout = (req, res) => {
   res.clearCookie("token");
   res.redirect("/login");
};

