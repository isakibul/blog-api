require("dotenv").config();
const express = require("express");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");
const OpenApiValidator = require("express-openapi-validator");

const connection = require("./db");
const Article = require("./models/Article");
const articleService = require("./services/article");

// express app
const app = express();

app.use(express.json());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(
  OpenApiValidator.middleware({
    apiSpec: "./swagger.yaml",
  })
);

app.get("/health", (_req, res) => {
  res.status(200).json({ health: "Ok" });
});

// articles
app.get("/api/v1/articles", async (req, res) => {
  // extract query params
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;

  // call article service to fetch articles
  let { totalItems, totalPage, hasNext, hasPrev, articles } =
    await articleService.findArticles({
      ...req.query,
      page,
      limit,
    });

  // const skip = page * limit - limit;
  // let resultedArticles = articles.slice(skip, skip + limit);
  // const totalItems = articles.length;
  // const totalPage = Math.ceil(totalItems / limit);

  articles = articleService.transformArticles({ articles });

  const response = {
    data: articles,
    pagination: {
      page,
      limit,
      next: 3,
      prev: 1,
      totalItems,
      totalPage,
    },
    links: {
      self: req.url,
      prev: `/articles?page=${page - 1}&limit=${limit}`,
      next: `/articles?page=${page + 1}&limit=${limit}`,
    },
  };

  if (hasPrev) {
    response.pagination.prev = page - 1;
    response.links.prev = `/articles?page=${page - 1}&limit=${limit}`;
  }

  if (hasNext) {
    response.pagination.next = page + 1;
    response.links.next = `/articles?page=${page + 1}&limit=${limit}`;
  }

  // generate necessary responses
  res.status(200).json(response);
});

app.post("/api/v1/articles", (req, res) => {
  res.status(200).json({ path: "/articles", method: "post" });
});

app.get("/api/v1/articles/:id", (req, res) => {
  res.status(200).json({ path: `/articles/${req.params.id}`, method: "get" });
});

app.put("/api/v1/articles/:id", (req, res) => {
  res.status(200).json({ path: `/articles/${req.params.id}`, method: "put" });
});

app.patch("/api/v1/articles/:id", (req, res) => {
  res.status(200).json({ path: `/articles/${req.params.id}`, method: "patch" });
});

app.delete("/api/v1/articles/:id", (req, res) => {
  res
    .status(200)
    .json({ path: `/articles/${req.params.id}`, method: "delete" });
});

// Auth
app.post("/api/v1/auth/signup", (req, res) => {
  res.status(200).json({ path: "/auth/signup", method: "post" });
});

app.post("/api/v1/auth/signin", (req, res) => {
  res.status(200).json({ path: "/auth/signin", method: "post" });
});

app.use((err, req, res, next) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.listen(4000, () => {
  console.log("listening on port 4000");
});
