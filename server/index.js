require("dotenv").config();
const express = require("express");
const path = require("path");
const { postgraphile } = require("postgraphile");
const app = express();
const PORT = 4000;

const postgraphileOptions = {
  subscriptions: true,
  watchPg: true,
  jwtTokenIdentifier: "public.jwt_token",
  jwtSecret: "foobar",
  defaultRole: "anonymous",
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  ignoreIndexes: false,
  showErrorStack: "json",
  extendedErrors: ["hint", "detail", "errcode"],
  appendPlugins: [require("@graphile-contrib/pg-simplify-inflector")],
  exportGqlSchemaPath: "schema.graphql",
  exportSchemaJson: "schema.json",
  sortExport: true,
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
  },
  jwtTokenIdentifier: "public.jwt_token"
};

app.use(postgraphile(process.env.DATABASE_URL, "public", postgraphileOptions));

app.use(express.static(path.join(__dirname, "..", "build")));

app.get("/", (req, res) => {
  console.log("GET /");
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(PORT, () => console.log(`api-server listening on port ${PORT}`));

