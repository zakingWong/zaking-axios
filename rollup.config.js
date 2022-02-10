import camelCase from "lodash.camelcase";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";

const pkg = require("./package.json");

const libraryName = "zaking-axios";

export default {
  input: `lib/axios.js`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: "umd",
      sourcemap: true,
    },
    { file: pkg.module, format: "es", sourcemap: true },
  ],
  watch: {
    include: "lib/**",
  },
  plugins: [json(), commonjs(), resolve(), sourceMaps()],
};
