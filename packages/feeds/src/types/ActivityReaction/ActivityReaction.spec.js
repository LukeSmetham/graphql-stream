import { schemaComposer, ObjectTypeComposer } from 'graphql-compose';

import { createActivityReactionTC } from './ActivityReaction';

describe('ActivityReaction', () => {
	beforeAll(() => {
		schemaComposer.clear();
	});

	test('Should return an ObjectTypeComposer', () => {
		expect(createActivityReactionTC(schemaComposer)).toBeInstanceOf(ObjectTypeComposer);
	});

	test('Returned type should have the correct name', () => {
		expect(createActivityReactionTC(schemaComposer).getTypeName()).toBe('StreamActivityReaction');
	});

	test('StreamActivityReaction should contain the correct fields', () => {
		const ActivityReactionTC = createActivityReactionTC(schemaComposer);
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
		};

		const fieldNames = Object.keys(fields);

		expect(ActivityReactionTC.getFieldNames()).toEqual(fieldNames);

		Object.keys(fields).forEach(name => expect(ActivityReactionTC.getFieldTypeName(name)).toBe(fields[name]));
	});
});