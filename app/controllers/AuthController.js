import User from "../models/User.js";

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

export const auth = async (req, res) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email) errors.email = "Email wajib diisi";
  if (!password) errors.password = "Password wajib diisi";

  if (Object.keys(errors).length > 0) {
    return res.render("pages/auth/login/index", {
      title: "Login",
      layout: "layouts/auth",
      errors,
      oldData: req.body,
      success: null,
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      errors.general = "Email tidak terdaftar";
      return res.render("pages/auth/login/index", {
        title: "Login",
        layout: "layouts/auth",
        errors,
        oldData: req.body,
        success: null,
      });
    }

    if (password !== user.password) {
      errors.general = "Password salah";
      return res.render("pages/auth/login/index", {
        title: "Login",
        layout: "layouts/auth",
        errors,
        oldData: req.body,
        success: null,
      });
    }

    // ============================
    //      SET EXPRESS SESSION
    // ============================
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.role = user.role;


    req.session.save(() => {
        res.redirect("/dashboard");
    });
  } catch (err) {
    return res.render("pages/auth/login/index", {
      title: "Login",
      layout: "layouts/auth",
      errors: { general: "Terjadi kesalahan, coba lagi." },
      oldData: req.body,
      success: null,
    });
  }
};

export const RegisterStore = async (req, res) => {
  try {
    await User.create(req.body);

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
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

