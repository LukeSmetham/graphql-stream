import mongoose from 'mongoose';
import { createToken } from '../utils/createToken';

export const signup = tc => tc.mongooseResolvers
	.createOne()
	.wrap(resolver => {
		// Here we manually add the password field back to the CreateOneUserInput because we removed 
		// it from the GQL type when creating the UserTC in ../User.js
		const itc = tc.schemaComposer.getITC('CreateOneUserInput');

		itc.addFields({
			password: 'String!',
		});

		return resolver;
	})
	.wrapResolve(next => async rp => {
		// Check if a user already exists with the provided email address before we run the resolver.
		const exists = await mongoose.model('User').countDocuments({
			email: rp.args.record.email,
		})

		if (exists) {
			throw new Error('An account with this email already exists.')
		}
		
		const data = await next(rp);

		data.record.token = createToken(data.record)

		return data;
	})
	.clone({ name: 'signup' });