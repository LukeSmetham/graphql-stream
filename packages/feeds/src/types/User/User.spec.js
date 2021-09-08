import { schemaComposer, ObjectTypeComposer } from 'graphql-compose';
import { ensureScalars } from 'utils/ensureScalars';

import { createUserTC } from './User';

describe('User', () => {
	beforeAll(() => {
		schemaComposer.clear();
		ensureScalars(schemaComposer);
	});

	const options = {
		schemaComposer,
	};

	test('Should return an ObjectTypeComposer', () => {
		expect(createUserTC(options)).toBeInstanceOf(ObjectTypeComposer);
	});

	test('Returned type should have the correct name', () => {
		expect(createUserTC(options).getTypeName()).toBe('StreamUser');
	});

	test('StreamUser should contain the correct fields', () => {
		const UserTC = createUserTC(options);
		const fields = {
			id: 'ID!',
			data: 'JSON',
			created_at: 'DateTime!',
			updated_at: 'DateTime!',
			token: 'JWT',
		};

		const fieldNames = Object.keys(fields);

		expect(UserTC.getFieldNames()).toEqual(fieldNames);

		Object.keys(fields).forEach(name => expect(UserTC.getFieldTypeName(name)).toBe(fields[name]));
	});
});