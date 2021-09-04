export const signup = tc => tc.mongooseResolvers
	.createOne()
	.wrap(resolver => {
		const itc = tc.schemaComposer.getITC('CreateOneUserInput');

		itc.addFields({
			password: 'String!',
		})

		return resolver;
	})
	.clone({ name: 'signup' });