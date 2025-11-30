// middleware/roleMiddleware.js

export const roleMiddleware = (allowed = []) => (req, res, next) => {
  const roles = [].concat(allowed); // pastikan selalu array
  const userRole = req.session.role;

  if (!roles.includes(userRole)) {
    return res.status(403).render("pages/errors/403", {
      title: "Forbidden",
      layout: "layouts/main",
    });
  }

  next();
};
