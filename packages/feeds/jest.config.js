module.exports = {
	rootDir: ".",
	roots: ["./src"],
	testPathIgnorePatterns: ["node_modules/", "lib/"],
	transform: {
	  "^.+\\.js?$": ['babel-jest', {rootMode: "upward"}]
	},
  }