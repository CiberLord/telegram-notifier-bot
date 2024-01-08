module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: 'xo',
	overrides: [
		{
			env: {
				node: true,
			},
			files: [
				'.eslintrc.{js,cjs}',
			],
			parserOptions: {
				sourceType: 'script',
			},
		},
		{
			extends: [
				'xo-typescript',
			],
			files: [
				'*.ts',
				'*.tsx',
			],
			rules: {
				'@typescript-eslint/naming-convention': 'off',
				'@typescript-eslint/object-curly-spacing': ['error', 'always'],
				'@typescript-eslint/parameter-properties': 'off',
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'@typescript-eslint/no-unsafe-argument': 'off',
				'@typescript-eslint/no-unsafe-call': 'off',
				'@typescript-eslint/no-unsafe-return': 'off',
				'@typescript-eslint/consistent-type-definitions': [
					'error',
					'interface',
				],
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'arrow-body-style': ['error', 'always'],
		'object-curly-spacing': ['error', 'always'],
		'arrow-parens': ['error', 'always'],
		'no-constructor-return': 'off',
		camelcase: 'off',
	},
};
