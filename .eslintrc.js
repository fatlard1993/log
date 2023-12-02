module.exports = {
	env: {
		es2024: true,
		node: true,
		browser: true,
	},
	globals: {
		Bun: true,
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 'latest',
	},
	extends: [
		'eslint:recommended',
		'plugin:compat/recommended',
		'plugin:unicorn/recommended',
		'plugin:import/recommended',
		'plugin:prettier/recommended',
	],
	plugins: ['compat', 'unicorn', 'write-good-comments', 'spellcheck'],
	rules: {
		'no-console': 'off',
		'no-nested-ternary': 'error',
		'no-var': 'error',
		'prefer-const': 'error',
		'comma-dangle': ['error', 'only-multiline'],
		'no-async-promise-executor': 'off',
		'no-prototype-builtins': 'off',

		'unicorn/prevent-abbreviations': [
			'error',
			{
				allowList: {
					elem: true,
					Elem: true,
					args: true,
				},
			},
		],
		'unicorn/filename-case': 'off',
		'unicorn/no-null': 'off',
		'unicorn/no-await-expression-member': 'off',
		'unicorn/no-array-for-each': 'off',
		'unicorn/prefer-spread': 'off',
		'unicorn/no-negated-condition': 'off',
		'unicorn/no-array-reduce': 'off',
		'unicorn/prefer-query-selector': 'off',
		'unicorn/prefer-node-protocol': 'off',
		'unicorn/no-this-assignment': 'off',
		'unicorn/consistent-function-scoping': 'off',
		'unicorn/numeric-separators-style': 'off',
		'unicorn/prefer-switch': 'off',
		'unicorn/prefer-dom-node-dataset': 'off',
		'unicorn/no-process-exit': 'off',

		'import/no-unresolved': [1, { ignore: ['bun', 'bun:test'] }],
		'import/no-unused-modules': [1, { unusedExports: true }],
		'import/no-useless-path-segments': 'error',
		'import/first': 'warn',
		'import/order': 'warn',

		'write-good-comments/write-good-comments': 'warn',

		'spellcheck/spell-checker': ['warn', require('./.spellcheck.cjs')],
	},
	ignorePatterns: ['node_modules'],
	overrides: [
		{
			files: ['**/*.cjs'],
			env: {
				node: true,
			},
		},
		{
			files: ['test-setup.js', '**/*.test.js'],
			env: {
				node: true,
			},
			globals: {
				Bun: true,
				container: true,
				expect: true,
				describe: true,
				test: true,
			},
		},
	],
};
