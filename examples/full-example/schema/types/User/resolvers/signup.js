import mongoose from 'mongoose';

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
	.wrapResolve(next => async rp => {
		const exists = await mongoose.model('User').find({
			email: rp.args.record.email,
		}).lean()

		if (exists) {
			throw new Error('An account with this email already exists.')
		}

		return next(rp);
	})
	.clone({ name: 'signup' });