import { schemaComposer } from 'graphql-compose';
import { validateFeedType } from './validateFeedType';

describe('validateFeedType util', () => {
	test('Should throw an error if the feed `type` is invalid', () => {
		const options = {
			schemaComposer,
			feed: {
				feedGroup: 'user',
				type: 'invalid_feed_type',
			}
		}
		expect(() => validateFeedType(options.feed.type)).toThrow(/Unrecognized Feed Type • Choose either `flat` `aggregated` or `notification`/);
	});	
})