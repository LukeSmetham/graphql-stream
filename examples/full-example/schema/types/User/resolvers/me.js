export const me = tc => tc.mongooseResolvers
	.findById()
	.removeArg('_id')
	.wrapResolve(next => rp => {
		const { user } = rp.context;

		rp.args._id = user;
		
		return next(rp);
	}).clone({ name: 'me' });