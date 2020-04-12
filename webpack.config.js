const path = require("path");
const DashboardPlugin = require("webpack-dashboard/plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const DotENVPlugin = require("dotenv-webpack");

const resolveModule = (relPath) => path.resolve(process.cwd(), relPath);

// TODO try several entry points
// TODO  and make it  with several  css files outputs as well
// TODO  as well as chunks for routes like here https://itnext.io/react-router-and-webpack-v4-code-splitting-using-splitchunksplugin-f0a48f110312
// TODO  add webpack bundle analize preset
// TODO code splitting
// TODO read about sass modules and setup loaders for them
// TODO reporting on files exceeding particular size
// TODO  add fonts loading
// TODO add images loading with urls in html
// TODO images compressiong with webpack
// TODO add cache param after whole configuration (after devtool)
const ROUTES = {
  appEntry: resolveModule("src/index.tsx"),
  appBuilt: resolveModule("build"),
  appPublic: resolveModule("public"),
  appTsConfig: resolveModule("tsconfig.json"),
  appTsReportFiles: ["src/**/*.{ts,tsx}", "!src/skip.ts"],
};

const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;
const imagesRegex = /\.(png|jpe?g|gif|svg)$/;
const scriptsRegex = /\.(js|ts|tsx)$/;

module.exports = function ({ mode }) {
  const DEV_MODE = mode === "development";
  const PROD_MODE = mode === "production";

  const getStyleLoaders = (preProcessor, sourceMap = true) => {
    const loaders = [
      {
        loader: MiniCssExtractPlugin.loader,

        options: {
          hmr: DEV_MODE,
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

    devtool: PROD_MODE ? "source-map" : "cheap-module-source-map",

    entry: ["react-hot-loader/patch", ROUTES.appEntry],

    output: {
      path: PROD_MODE ? ROUTES.appBuilt : undefined,

      filename: PROD_MODE ? "js/[name].[contenthash].js" : "js/bundle.js",

      // publicPath: ROUTES.appPublic,

      // for web workers
      globalObject: "this",
    },

    // FIXME add slitChunks webpack option for chunks loading
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
            templateContent: `
	        <html>
		      <body>
		          <div id="app"></div>
		      </body>
    		</html>
 		 `,
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

      // make typescipt builds faster
      new ForkTsCheckerWebpackPlugin({
        eslint: true,
        async: DEV_MODE,
        tsconfig: ROUTES.appTsConfig,
        // files to process and and example of a file to exclude
        reportFiles: ROUTES.appTsReportFiles,
      }),

      // load vars from .env
      new DotENVPlugin(),
    ].filter(Boolean),

    module: {
      strictExportPresence: true,

      rules: [
        {
          test: scriptsRegex,
          enforce: "pre",
          exclude: /node_modules/,
          loader: "eslint-loader",
          options: {
            formatter: require("eslint-friendly-formatter"),
          },
        },
        {
          test: scriptsRegex,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env", "@babel/preset-react"],
                plugins: [
                  "react-hot-loader/babel",
                  "@babel/plugin-proposal-object-rest-spread",
                ],
              },
            },
            {
              loader: "ts-loader",
              options: {
                reportFiles: ROUTES.appTsReportFiles,
              },
            },
          ],
        },
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
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 8192,
              },
            },
          ],
        },
      ],
    },

    devServer: {
      // shows full-screen overlay with errors
      overlay: {
        warnings: false,
        errors: true,
      },

      // enables HMR
      hot: true,
    },

    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      alias: {
        components: path.resolve(__dirname, "src/components/"),
        assets: path.resolve(__dirname, "assets"),
      },
    },

    // gives performace hints during build
    performance: {
      hints: PROD_MODE ? "error" : "warning",
    },
  };
};
