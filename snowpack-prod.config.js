/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  extends: './snowpack.config.js',
  optimize: {
    treeshake: true,
    bundle: true,
    minify: true,
    target: 'es2020'
  }
}
