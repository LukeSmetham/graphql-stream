module.exports = {
	rootDir: ".",
	roots: ["./src"],
	testPathIgnorePatterns: ["node_modules/", "lib/"],
	transform: {
	  "^.+\\.js?$": ['babel-jest', {rootMode: "upward"}]
	},
	"coverageThreshold": {
		"global": {
			"branches": 100,
			"functions": 100,
			"lines": 100,
			"statements": 100
		}
	}
  }