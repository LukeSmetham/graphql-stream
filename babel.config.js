module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: 'current',
				},
			},
		],
	],
	plugins: [
        ['module-resolver', { root: ['./src'] }], 
        'transform-optional-chaining', 
        '@babel/proposal-class-properties'
    ],
	comments: false,
	env: {
		production: {
			presets: [
				'minify'
			]
		}
	}
};
