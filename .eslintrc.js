module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"node": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	"overrides": [
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"react"
	],
	"rules": {
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1,
				"ignoredNodes": ["ConditionalExpression"]
			}
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"never"
		],
		"react/react-in-jsx-scope": "off",
		"no-unused-vars": "off",
		"react/prop-types": "off",
		"react/display-name": "off",
		"object-curly-spacing": ["error", "always"]
	}
}
