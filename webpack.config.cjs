const path = require("path");
const htmlPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");

const commonConfig = {
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
      },
      {
        test: /\.html$/,
        use: ["raw-loader"],
        exclude: /index.html/,
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                loadPaths: [path.resolve(__dirname, "src/common")],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "assets",
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      "@common": path.resolve(__dirname, "src/common"),
      "@client": path.resolve(__dirname, "src/client"),
      "@server": path.resolve(__dirname, "src/server"),
    },
  },
};

const clientConfig = {
  entry: {
    main: path.resolve(__dirname, "src/client/index.ts"),
  },
  output: {
    path: path.resolve(__dirname, "dist/public"),
    filename: "[name].[contenthash].js",
    clean: true,
  },
  plugins: [
    new htmlPlugin({
      title: "Waifu Picker",
      filename: "index.html",
      template: "./src/client/index.html",
      favicon: "./src/client/assets/favicon.ico",
    }),
  ],
};

const serverConfig = {
  entry: {
    server: path.resolve(__dirname, "src/server/server.ts"),
  },
  target: "node",
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
};

module.exports = [
  merge(commonConfig, clientConfig),
  merge(commonConfig, serverConfig),
];
