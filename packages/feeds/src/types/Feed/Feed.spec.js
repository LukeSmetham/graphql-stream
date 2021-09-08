import { schemaComposer, ObjectTypeComposer } from 'graphql-compose';
import capitalize from 'capitalize';
import { composer } from 'schema';

import { createFeedTC } from './Feed';

describe('Feed', () => {
	beforeEach(() => {
		schemaComposer.clear();
		composer.clear();
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

	test('Should throw an error if the feed `type` is invalid', () => {
		const options = {
			schemaComposer,
			feed: {
				feedGroup: 'user',
				type: 'invalid_feed_type',
			}
		}
		expect(() => createFeedTC(options)).toThrow(/Unrecognized Feed Type • Choose either `flat` `aggregated` or `notification`/);
	});
	
	test('Should throw an error if no options argument was provided', () => {
		expect(() => createFeedTC()).toThrow(/No options were provided to createFeedTC/);
	});
});