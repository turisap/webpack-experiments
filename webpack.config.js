const path = require("path");
const DashboardPlugin = require("webpack-dashboard/plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const resolveModule = (relPath) => path.resolve(process.cwd(), relPath);

// TODO try several entry points
// TODO  and make it  with several  css files outputs as well
// TODO  as well as chunks for routes like here https://itnext.io/react-router-and-webpack-v4-code-splitting-using-splitchunksplugin-f0a48f110312
const ROUTES = {
  appEntry: resolveModule("src/index.js"),
  appBuilt: resolveModule("build"),
  appPublic: resolveModule("public"),
};

const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;
const imagesRegex = /\.(png|jpe?g|gif|svg)$/;

module.exports = function ({ mode }) {
  const DEV_MODE = mode === "development";
  const PROD_MODE = mode === "production";

  const getStyleLoaders = (preProcessor, sourceMap = true) => {
    const loaders = [
      {
        loader: MiniCssExtractPlugin.loader,

        // TODO test it
        options: {
          // only enable hot in development
          hmr: true,
          reloadAll: true,
        },
      },

      {
        loader: require.resolve("css-loader"),
        options: {
          sourceMap,
        },
      },

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
          ],
          sourceMap,
        },
      },
    ].filter(Boolean);

    if (preProcessor) {
      loaders.push(
        // this loader is required by sass loader to resolve urls
        {
          loader: require.resolve("resolve-url-loader"),
          options: {
            sourceMap,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap,
          },
        }
      );
    }

    return loaders;
  };

  return {
    mode,

    //  exit building proccess on error
    bail: PROD_MODE,

    // TODO add cache param after whole configuration
    devtool: PROD_MODE ? "source-map" : "cheap-module-source-map",

    entry: ROUTES.appEntry,

    output: {
      path: PROD_MODE ? ROUTES.appBuilt : undefined,

      filename: PROD_MODE ? "js/[name].[contenthash].js" : "js/bundle.js",

      // publicPath: ROUTES.appPublic,

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

        // TODO find out why this plugin removes source maps for prod
        new OptimizeCssAssetsPlugin({
          cssProcessor: require("cssnano"),
          cssProcessorPluginOptions: {
            preset: ["default", { discardComments: { removeAll: true } }],
          },
        }),
      ],
    },

    plugins: [
      new DashboardPlugin(),

      new BundleAnalyzerPlugin(),

      new MiniCssExtractPlugin({
        filename: PROD_MODE
          ? "css/[name].[contenthash:8].css"
          : DEV_MODE && "css/main.css",
      }),

      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            // defer script loading
            scriptLoading: "defer",

            // TODO add a favicon
            favicon: "",
            title: "My app",
          },
          PROD_MODE && {
            minify: {
              // TODO check if it removes comments from html
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,

              // everything which comes in as  <style> or <script> ...code </script>
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
        )
      ),
    ].filter(Boolean),

    module: {
      strictExportPresence: true,

      rules: [
        {
          test: cssRegex,
          use: getStyleLoaders(),
        },
        {
          test: sassRegex,
          use: getStyleLoaders("sass-loader"),
        },
        {
          test: imagesRegex,
          use: "file-loader",
        },
      ],
    },
  };
};
