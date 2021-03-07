const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const spawn = require("cross-spawn");
const StandaloneSingleSpaPlugin = require("standalone-single-spa-webpack-plugin");

const targetIndex = process.argv.findIndex(
  (arg) => arg === "serve" || arg === "production"
);
const target = process.argv[targetIndex] === "production" ? "build" : "serve";
if (targetIndex < 0 || targetIndex === process.argv.length - 1) {
  console.error(
    `
Must run ${target} script with directory name:

npm ${target} -- 01-vanilla-app
yarn ${target} 01-vanilla-app
pnpm ${target} -- 01-vanilla-app
`.trim()
  );
  process.exit(1);
}

let dir = process.argv[targetIndex + 1];

if (dir.endsWith("/")) {
  dir = dir.slice(0, dir.length - 1);
}

if (!fs.existsSync(path.resolve(__dirname, dir))) {
  console.error(
    `
Directory ${dir} doesn't exist.

Must run start script with directory name:

npm start -- 01-vanilla-app
yarn start 01-vanilla-app
pnpm start -- 01-vanilla-app
`.trim()
  );

  process.exit(1);
}

const directoryOptions = {
  "03-react-app": {
    standalone: "disabled",
    port: 8301,
  },
  "03-vue-app": {
    standalone: "disabled",
    port: 8302,
  },
  "04-react-navbar": {
    standalone: "disabled",
    port: 8301,
  },
  "04-react-app": {
    standalone: "disabled",
    port: 8302,
  },
  "04-vue-app": {
    standalone: "disabled",
    port: 8303,
  },
  "04-angular-app": {
    standalone: "disabled",
    port: 8304,
  },
  "05-react-app": {
    standalone: "disabled",
    port: 8301,
  },
  "05-vue-app": {
    standalone: "disabled",
    port: 8302,
  },
  "05-angular-app": {
    standalone: "disabled",
    port: 8303,
  },
  "06-settings": {
    standalone: "disabled",
    port: 8301,
  },
  "06-subscription": {
    standalone: "disabled",
    port: 8302,
  },
  "06-home": {
    standalone: "disabled",
    port: 8303,
  },
  "07-root-config": {
    port: 8300,
    format: "system",
    externals: ["vue", "single-spa"],
  },
  "07-home": {
    port: 8301,
    standalone: "disabled",
    format: "system",
    externals: ["vue", "single-spa"],
  },
  "07-navbar": {
    port: 8302,
    standalone: "disabled",
    format: "system",
    externals: ["vue", "single-spa"],
  },
};

const defaultOptions = {
  standalone: "index.html",
  port: null,
  format: null,
  externals: [],
};

module.exports = createConfig({ folder: dir });

function createConfig({ folder }) {
  const isAngular = folder.includes("angular");

  if (isAngular) {
    spawn("ngc", ["--watch"], {
      stdio: "inherit",
      cwd: path.resolve(__dirname, folder),
    });
  }

  const options = directoryOptions[folder]
    ? Object.assign({}, defaultOptions, directoryOptions[folder])
    : defaultOptions;

  const useStandalonePlugin = options.standalone !== "index.html";

  const htmlWebpackOptions = {
    inject: "body",
  };

  if (!useStandalonePlugin) {
    htmlWebpackOptions.template = path.resolve(__dirname, folder, "index.html");
  }

  const config = {
    entry: path.resolve(__dirname, `${folder}/index.js`),
    mode: "development",
    externals: options.externals,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: ["babel-loader"],
          exclude: /node_modules/,
        },
        {
          test: /\.vue$/,
          use: ["vue-loader"],
        },
        {
          test: /.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: folder,
                },
              },
            },
          ],
          include: /\.module\.css$/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
          exclude: /\.module.css$/,
        },
        {
          test: /\.html$/,
          use: ["raw-loader"],
          exclude: /node_modules/,
        },
      ],
    },
    output: {
      publicPath: "/",
      libraryTarget: options.format,
      path: path.resolve(__dirname, `dist/${folder}`),
    },
    devtool: "source-map",
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin(htmlWebpackOptions),
      useStandalonePlugin &&
        new StandaloneSingleSpaPlugin({
          appOrParcelName: folder,
          disabled: options.standalone === "disabled",
        }),
    ].filter(Boolean),
    resolve: {
      extensions: [".jsx", ".js", ".ts", ".tsx"],
      preferRelative: true,
    },
    devServer: {
      historyApiFallback: true,
      port: options.port,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  };

  return config;
}
