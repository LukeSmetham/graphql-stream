export const me = tc => tc.mongooseResolvers
	.findById()
	.removeArg('_id')
	.wrapResolve(next => rp => {
		const { user } = rp.context;
		console.log(user);
		rp.args._id = user;
		
		return next(rp);
	}).clone({ name: 'me' });