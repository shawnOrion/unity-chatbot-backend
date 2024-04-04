function logger(req, res, next) {
  console.log("Request Body:", req.body);
  next();
}

module.exports = logger;
