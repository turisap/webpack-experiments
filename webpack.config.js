const path = require("path");
var DashboardPlugin = require("webpack-dashboard/plugin");

const resolveModule = (relPath) => path.resolve(process.cwd(), relPath);

const ROUTES = {
  appEntry: resolveModule("src/index.js"),
  appBuilt: resolveModule("build"),
  appPublic: resolveModule("public"),
};

module.exports = function (mode) {
  const DEV_MODE = mode === "development";
  const PROD_MODE = mode === "production";
  console.log(arguments);

  return {
    mode: PROD_MODE ? "production" : DEV_MODE && "development",

    bail: PROD_MODE,

    // TODO add cache param after whole configuration
    devtool: PROD_MODE ? "source-map" : DEV_MODE && "eval-source-map",

    entry: ROUTES.appEntry,

    output: {
      path: PROD_MODE ? ROUTES.appBuilt : undefined,

      filename: PROD_MODE
        ? "static/js/[name].[contenthash].js"
        : "static/js/bundle.js",

      chunkFilename: PROD_MODE
        ? "static/js/[name].[contenthash].chunk.js"
        : "static/js/[name].chunk.js",

      publicPath: ROUTES.appPublic,

      globalObject: "this",
    },

    plugins: [new DashboardPlugin()],
  };
};
