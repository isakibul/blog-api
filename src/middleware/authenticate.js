const authenticate = (req, _res, next) => {
  req.user = {
    id: 888,
    name: "Sakibul Islam",
  };
  next();
};

module.exports = authenticate;
