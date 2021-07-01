// Controllo se il ruolo dell'utente loggato è valet
module.exports = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == "valet") return next();

  return res.status(401).json({ error: "not autorized" });
};
