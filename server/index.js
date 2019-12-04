require("dotenv").config();
const express = require("express");
const { postgraphile } = require("postgraphile");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();

const PORT = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

app.use(express.static(path.join(__dirname, "..", "build")));

app.get("/", (req, res) => {
  console.log("GET /");
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

const video = require("./api/video");
app.use("/api/video", video);

const postgraphileOptions = {
  subscriptions: true,
  watchPg: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  ignoreIndexes: false,
  showErrorStack: "json",
  extendedErrors: ["hint", "detail", "errcode"],
  appendPlugins: [require("@graphile-contrib/pg-simplify-inflector")],
  exportGqlSchemaPath: "schema.graphql",
  graphiql: true,
  enhanceGraphiql: true,
  allowExplain(req) {
    // TODO: customise condition!
    return true;
  },
  enableQueryBatching: true,
  legacyRelations: "omit",
  pgSettings(req) {
    /* TODO */
  }
};

app.use(postgraphile(process.env.DATABASE_URL, "public", postgraphileOptions));
app.listen(PORT, () => console.log(`api-server listening on port ${PORT}`));
