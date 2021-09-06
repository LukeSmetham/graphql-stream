export const checkCredentials = ({ credentials } = {}) => (next, source, args, context, info) => {
	if (!credentials) {
		throw new Error('Missing Stream Credentials.')
	}
	
	if (!credentials?.api_key) {
		throw new Error('Missing Stream API Key.')
	}
	
	if (!credentials?.api_secret) {
		throw new Error('Missing Stream API Secret.')
	}

    return next(source, args, context, info);
};