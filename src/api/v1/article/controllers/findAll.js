const articleService = require("../../../../lib/article");

const findAll = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const shortType = req.query.shortType || "dsc";
  const shortBy = req.query.shortBy || "updatedAt";
  const search = req.query.search || "";

  try {
    const article = await articleService.findAll({
      page,
      limit,
      shortType,
      shortBy,
      search,
    });
    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};

module.exports = findAll;
