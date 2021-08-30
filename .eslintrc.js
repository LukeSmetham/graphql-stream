module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["plugin:prettier/recommended", "eslint:recommended", "get-off-my-lawn"],
  parser: "babel-eslint",
  plugins: ["prettier"],
  rules: {
    "camelcase": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": 0,
    "import/order": 0,
    "no-empty-function": 0,
    "no-process-exit": 0,
    "no-warning-comments": 0,
    "node/no-extraneous-import": 0,
    "node/no-unpublished-import": 0,
    "spaced-comment": 0,
	"sort-keys": 0
  },
};
