const { Article } = require("../../model");

const findAll = async ({
  page = 1,
  limit = 5,
  sortType = "dsc",
  sortKey = "updatedAt",
  search = "",
}) => {
  const sortStr = `${sortType === "dsc" ? "-" : ""}${sortKey}`;
  const articles = await Article.find({
    title: { $regex: search, $options: "i" },
  })
    .sort(sortStr)
    .skip(page * limit - limit)
    .limit(limit);
  return articles;
};

module.exports = { findAll };
