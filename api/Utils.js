function requireUser(req, res, next) {
  if (!req.user) {
    console.log("USER ", req.user);
    res.status(401);
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
      error: "error",
    });
  }
  next();
}

module.exports = {
  requireUser,
};
