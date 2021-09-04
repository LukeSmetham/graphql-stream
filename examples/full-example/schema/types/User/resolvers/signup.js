export const signup = tc => tc.mongooseResolvers
	.createOne()
	.wrap(resolver => {
		// Here we manually add the password field back to the CreateOneUserInput because we removed 
		// it from the GQL type when creating the UserTC in ../User.js
		const itc = tc.schemaComposer.getITC('CreateOneUserInput');

		itc.addFields({
			password: 'String!',
		})

		return resolver;
	})
	.clone({ name: 'signup' });