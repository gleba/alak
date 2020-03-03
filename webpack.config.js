var path = require("path");
module.exports = {
  entry: {
    'core': './core/index.js',
    'alak': './facade/index.js',
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "MyLibrary/[name].js",
    library: ["MyLibrary", "[name]"],
    libraryTarget: "umd"
  }
}
