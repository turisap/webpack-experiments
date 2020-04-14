const path = require("path");
const DashboardPlugin = require("webpack-dashboard/plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const DotENVPlugin = require("dotenv-webpack");
const ManifestPlugin = require("webpack-manifest-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const resolveModule = (relPath) => path.resolve(process.cwd(), relPath);

// TODO code splitting
// TODO try several entry points
// TODO  and make it  with several  css files outputs as well
// TODO  as well as chunks for routes like here https://itnext.io/react-router-and-webpack-v4-code-splitting-using-splitchunksplugin-f0a48f110312
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
const fontRegex = /\.(woff|woff2|eot|ttf|otf)$/;

module.exports = function ({ mode, preset }) {
  const DEV_MODE = mode === "development";
  const PROD_MODE = mode === "production";
  const ANALIZE_MODE = preset === "analize";

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

    devtool: PROD_MODE ? "none" : "cheap-module-source-map",

    entry: ["react-hot-loader/patch", ROUTES.appEntry],

    output: {
      path: PROD_MODE ? ROUTES.appBuilt : undefined,

      filename: PROD_MODE ? "js/[name].[contenthash].js" : "js/bundle.js",

      chunkFilename: PROD_MODE
        ? "js/[name].[contenthash:8].chunk.js"
        : DEV_MODE && "js/[name].chunk.js",

      // for web workers
      globalObject: "this",
    },

    // FIXME add slitChunks webpack option for chunks loading
    optimization: {
      minimize: PROD_MODE,
      minimizer: [
        new TerserPlugin({
          //  set it to true to extract all comments into a separate file
          extractComments: false,
          terserOptions: {
            parse: {
              ecma: 8,
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

      splitChunks: {
        cacheGroups: {
          // extract react and react dom into a separate chunk
          // you can tweak it to extract other deps
          vendor: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "vendor",
            chunks: "all",
          },
        },
      },
    },

    plugins: [
      new DashboardPlugin(),

      // clean up dist directory on subsequent production builds
      new CleanWebpackPlugin(),

      ANALIZE_MODE && new BundleAnalyzerPlugin(),

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

            // to  add a favicon comment out the next line
            // favicon: "",
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

      new ManifestPlugin(),
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
        {
          test: fontRegex,
          use: "file-loader",
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
      hints: PROD_MODE ? "warning" : "warning",
      maxAssetSize: 550000,
      // filter out all source maps files from assesment
      assetFilter: function (assetFilename) {
        return !/\.map$/.test(assetFilename);
      },
    },
  };
};
