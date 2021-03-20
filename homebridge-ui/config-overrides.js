const { override, overrideDevServer } = require('customize-cra')
module.exports = {
  webpack: override(
    // usual webpack plugin
  ),
  devServer: overrideDevServer(
    // dev server plugin
    (x) => Object.assign({}, x, { hot: false })
  )
};
