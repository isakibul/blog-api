const authenticate = (req, _res, next) => {
  req.user = {
    id: "665025deb217d97d5663bde8",
    name: "Sakibul Islam",
    email: "sakibul@gmail.com",
    role: "user",
  };
  next();
};

module.exports = authenticate;
