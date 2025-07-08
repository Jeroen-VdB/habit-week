import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astroEslintPlugin from 'eslint-plugin-astro';
import svelteEslintPlugin from 'eslint-plugin-svelte';
import globals from 'globals';

export default tseslint.config(
	// Base configuration
	js.configs.recommended,
	...tseslint.configs.recommended,

	// Astro configuration
	...astroEslintPlugin.configs.recommended,

	// Svelte configuration
	...svelteEslintPlugin.configs['flat/recommended'],

	// Global ignores
	{
		ignores: ['dist/', '.astro/', 'node_modules/', '*.d.ts'],
	},

	// Global settings
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},

	// TypeScript files
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parserOptions: {
				project: './tsconfig.json',
			},
		},
	},

	// Svelte files
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				project: './tsconfig.json',
				extraFileExtensions: ['.svelte'],
			},
		},
	},

	// Custom rules
	{
		rules: {
			// TypeScript rules
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-explicit-any': 'warn',

			// General rules
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'prefer-const': 'error',
			'no-var': 'error',
		},
	}
);
