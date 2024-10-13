config.module = {
    rules: [
      {
        test: /\.ts$/,
        loader: 'webpack'
      },
      {
        test: /\.html$/,
        use: 'raw-loader'
      }
    ]
  }