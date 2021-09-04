import { createToken } from "../utils/createToken";

export const token = tc => tc.schemaComposer.createResolver({
	name: 'getToken',
	kind: 'query',
	type: 'String',
	projection: {
		_id: true,
	},
	resolve: ({
		source,
		context,
	}) => {
		// Check the authed user is the same user that is being queried
		// This allows users to only see their own token
		if (context.user === source._id.toString()) {
			return createToken(source)
		}

		return null;
	}
})