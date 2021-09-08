import { schemaComposer, ObjectTypeComposer } from 'graphql-compose';
import { composer } from 'schema';
import { ensureScalars } from 'utils/ensureScalars';

import { createActivityReactionTC } from './ActivityReaction';

describe('ActivityReaction', () => {
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
		expect(createActivityReactionTC(options)).toBeInstanceOf(ObjectTypeComposer);
	});

	test('Returned type should have the correct name', () => {
		expect(createActivityReactionTC(options).getTypeName()).toBe('StreamActivityReaction');
	});

	test('StreamActivityReaction should contain the correct fields', () => {
		const ActivityReactionTC = createActivityReactionTC(options);
		const fields = {
			id: 'ID!',
			kind: 'String!',
			activity_id: 'ID!',
			created_at: 'DateTime!',
			updated_at: 'DateTime!',
			user_id: 'String!',
			data: 'JSON',
			target_feeds: '[StreamID!]',
			target_feeds_extra_data: 'JSON',
			childReactions: '[StreamActivityReaction]'
		};

		const fieldNames = Object.keys(fields);

		expect(ActivityReactionTC.getFieldNames()).toEqual(fieldNames);

		Object.keys(fields).forEach(name => expect(ActivityReactionTC.getFieldTypeName(name)).toBe(fields[name]));
	});

	test('Should use libs schemaComposer if none is provided in the options object.', () => {
		const options = {};
		createActivityReactionTC(options);

		expect(() => schemaComposer.getOTC('StreamActivityReaction')).toThrow(/Cannot find ObjectTypeComposer/)
		expect(composer.getOTC('StreamActivityReaction')).toBeDefined()
	});
	
	test('Should throw an error if no options argument was provided', () => {
		expect(() => createActivityReactionTC()).toThrow(/No options were provided to createActivityReactionTC/);
	});
});