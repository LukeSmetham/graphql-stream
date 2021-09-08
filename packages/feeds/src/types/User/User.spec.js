import { schemaComposer, ObjectTypeComposer } from 'graphql-compose';
import { composer } from 'schema';
import { ensureScalars } from 'utils/ensureScalars';

import { createUserTC } from './User';

describe('User', () => {
	beforeEach(() => {
		schemaComposer.clear();
		composer.clear();

		ensureScalars(schemaComposer);
		ensureScalars(composer);
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

	test('Should use libs schemaComposer if none is provided in the options object.', () => {
		const options = {};
		createUserTC(options);

		expect(() => schemaComposer.getOTC('StreamUser')).toThrow(/Cannot find ObjectTypeComposer/)
		expect(composer.getOTC('StreamUser')).toBeDefined()
	});
	
	test('Should throw an error if no options argument was provided', () => {
		expect(() => createUserTC()).toThrow(/No options were provided to createUserTC/);
	});
});