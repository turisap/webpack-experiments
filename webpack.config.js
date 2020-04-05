const path = require("path");
const DashboardPlugin = require("webpack-dashboard/plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const resolveModule = (relPath) => path.resolve(process.cwd(), relPath);

const ROUTES = {
  appEntry: resolveModule("src/index.js"),
  appBuilt: resolveModule("build"),
  appPublic: resolveModule("public"),
};

const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;

module.exports = function ({ mode }) {
  const DEV_MODE = mode === "development";
  const PROD_MODE = mode === "production";

  const getStyleLoaders = () => {
    const loaders = [
      DEV_MODE && require.resolve("style-loader"),
      PROD_MODE && {
        loader: MiniCssExtractPlugin.loader,
      },

      { loader: require.resolve("css-loader") },
      {
        loader: "postcss-loader",
        options: {
          ident: "postcss_opt",
          plugins: () => [
            require("postcss-flexbugs-fixes"),
            require("postcss-preset-env")({
              stage: 3,
              autoprefixer: {
                flex: true,
              },
            }),
            require("cssnano")(),
          ],
        },
      },
    ].filter(Boolean);

    return loaders;
  };

  return {
    mode,

    bail: PROD_MODE,

    // TODO add cache param after whole configuration
    devtool: PROD_MODE ? "source-map" : DEV_MODE && "eval-source-map",

    entry: ROUTES.appEntry,

    output: {
      path: PROD_MODE ? ROUTES.appBuilt : undefined,

      filename: PROD_MODE ? "js/[name].[contenthash].js" : "js/bundle.js",

      // chunkFilename: PROD_MODE
      //   ? "js/[name].[contenthash].chunk.js"
      //   : "js/[name].chunk.js",

      publicPath: ROUTES.appPublic,

      // for web workers
      globalObject: "this",
    },

    optimization: {
      minimize: PROD_MODE,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            output: {
              comments: true,
            },
          },

          parallel: true,

          sourceMap: true,
        }),
      ],
    },

    plugins: [
      new DashboardPlugin(),

      PROD_MODE &&
        new MiniCssExtractPlugin({
          filename: "css/[name].[contenthash:8].css",
          // chunkFilename: "css/[name].[contenthash:8].chunk.css",
        }),

      // TODO find out why this plugin removes source maps for prod
      PROD_MODE &&
        new OptimizeCssAssetsPlugin({
          cssProcessor: require("cssnano"),
          cssProcessorPluginOptions: {
            preset: ["default", { discardComments: { removeAll: true } }],
          },
        }),
    ].filter(Boolean),

    module: {
      strictExportPresence: true,

      rules: [
        {
          test: cssRegex,
          use: getStyleLoaders(),
        },
      ],
    },
  };
};
