/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    "./frontend/src": { url: "/" },
  },
  buildOptions: {
    out: "./frontend/dist"
  },
};
