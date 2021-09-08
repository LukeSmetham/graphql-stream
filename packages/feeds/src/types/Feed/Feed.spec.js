import { schemaComposer, ObjectTypeComposer } from 'graphql-compose';
import capitalize from 'capitalize';
import { composer } from 'schema';

import { createActivityInterfaces } from 'interfaces/Activity';
import { createFeedTC } from './Feed';
import { ensureScalars } from 'utils/ensureScalars';
import { createActivityReactionTC } from 'types';

describe('Feed', () => {
	beforeEach(() => {
		schemaComposer.clear();
		composer.clear();

		ensureScalars(schemaComposer);
		ensureScalars(composer);
		
		createActivityInterfaces(schemaComposer);
		createActivityInterfaces(composer);
		createActivityReactionTC({ schemaComposer });
	});

	test('Should return an ObjectTypeComposer', () => {
		const options = {
			schemaComposer,
			feed: {
				feedGroup: 'user',
				type: 'flat',
				activityFields: {
					text: 'String!',
				},
			}
		}
		expect(createFeedTC(options)).toBeInstanceOf(ObjectTypeComposer);
	});

	test('Returned type should have the correct name', () => {
		const options = {
			schemaComposer,
			feed: {
				feedGroup: 'user',
				type: 'flat',
				activityFields: {
					text: 'String!',
				},
			}
		}
		expect(createFeedTC(options).getTypeName()).toBe(`Stream${capitalize(options.feed.feedGroup)}Feed`);
	});

	test('Should include all of the correct fields for a StreamFeed.', () => {
		const options = {
			schemaComposer,
			feed: {
				feedGroup: 'user',
				type: 'flat',
				activityFields: {
					text: 'String!',
				},
			}
		}
		const FeedTC = createFeedTC(options);
		
		const fields = {
			id: 'StreamID!',
			followers: '[StreamID!]',
			followersCount: 'Int!',
			following: '[StreamID!]',
			followingCount: 'Int!',
			activities: `[Stream${capitalize(options.feed.feedGroup)}Activity]`
		}

		const fieldNames = Object.keys(fields);

		expect(FeedTC.getFieldNames()).toEqual(fieldNames);

		Object.keys(fields).forEach(name => expect(FeedTC.getFieldTypeName(name)).toBe(fields[name]));
	});

	test('Should use libs schemaComposer if none is provided in the options object.', () => {
		const options = {
			feed: {
				feedGroup: 'user',
				type: 'flat',
			}
		};
		createFeedTC(options);

		expect(() => schemaComposer.getOTC('StreamUserFeed')).toThrow(/Cannot find ObjectTypeComposer/)
		expect(composer.getOTC('StreamUserFeed')).toBeDefined()
	});
	
	test('Should throw an error if no options argument was provided', () => {
		expect(() => createFeedTC()).toThrow(/No options were provided to createFeedTC/);
	});
});