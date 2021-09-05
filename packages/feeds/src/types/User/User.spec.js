import { schemaComposer, ObjectTypeComposer } from 'graphql-compose';

import { createUserTC } from './User';

const mockOpts = {
	schemaComposer,
	credentials: {
		api_key: 'STREAM_API_KEY',
		api_secret: 'STREAM_API_SECRET',
		app_id: 'STREAM_APP_ID',
	}	
};

describe('User', () => {
	beforeAll(() => {
		schemaComposer.clear();
	});

	test('Should return an ObjectTypeComposer', () => {
		expect(createUserTC(schemaComposer)).toBeInstanceOf(ObjectTypeComposer);
	});

	test('Returned type should have the correct name', () => {
		expect(createUserTC(schemaComposer).getTypeName()).toBe('StreamUser');
	});

	test('StreamUser should contain the correct fields', () => {
		const UserTC = createUserTC(schemaComposer);
		const fields = {
			id: 'ID!',
			data: 'JSON',
			created_at: 'DateTime!',
			updated_at: 'DateTime!',
			token: 'JWT'
		};

		const fieldNames = Object.keys(fields);

		expect(UserTC.getFieldNames()).toEqual(fieldNames);

		Object.keys(fields).forEach(name => expect(UserTC.getFieldTypeName(name)).toBe(fields[name]));
	});
});