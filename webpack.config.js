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
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
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
      title: "Requests Demo",
      filename: "index.html",
      template: "src/client/index.html",
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
