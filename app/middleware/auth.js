import jwt from "jsonwebtoken"

export function auth(req, res, next) {
  const token = req.cookies.token; // ambil token dari cookie

  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // simpan data user
    next();
  } catch (err) {
    return res.redirect("/login");
  }
}

export default auth