import { PubSubEngine } from 'graphql-subscriptions';
import jwt from 'jsonwebtoken';
import { StreamID } from 'scalars/StreamID/StreamID';
import { FeedSubscription } from './subscription';

describe('subscription', () => {
	test('should extend the PubSubEngine class from graphql-subscriptions', () => {
		const credentials = {
			api_key: 'STREAM_KEY',
			api_secret: 'STREAM_SECRET',
			app_id: 'STREAM_ID',
		};

		const Subscriber = new FeedSubscription(credentials);
		
		expect(Subscriber).toBeInstanceOf(PubSubEngine);
	});

	test('Should throw an error if no credentials are provided to the constructor', () => {
		expect(() => new FeedSubscription()).toThrow(/Missing Stream Feeds credentials when initializing FeedsSubscription./)
	});
	
	test('Should throw an error if no app_id is present in the provided credentials', () => {
		expect(() => 
			new FeedSubscription({
				api_key: 'STREAM_API_KEY',
				api_secret: 'STREAM_API_SECRET',
			})
		).toThrow(/Missing Stream App ID - Make sure you pass it with your credentials in order to enable subscriptions./)
	});

	test('the subscribe method should add a subscription to the `subscriptions` property with a valid id, token and faye subscription.', () => {
		const credentials = {
			api_key: 'STREAM_KEY',
			api_secret: 'STREAM_SECRET',
			app_id: 'STREAM_ID',
		};

		const Subscriber = new FeedSubscription(credentials);
		
		const feedId = new StreamID('user:1');
		const onMessage = jest.fn();

		const expectedId = `site-${credentials.app_id}-feed-${feedId.together}`;
		const expectedToken = jwt.sign({
			resource: '*',
			action: '*',
			feed_id: feedId.together,
		}, credentials.api_secret);

		Subscriber.subscribe(feedId.together, onMessage).then(id => expect(id).toBe(expectedId));

		const subscription = Subscriber.subscriptions[`/${expectedId}`];
		expect(subscription).toBeDefined();
		expect(subscription.token).toBe(expectedToken);
		expect(subscription.userId).toBe(expectedId);
		expect(subscription.fayeSubscription).toBeDefined();
	});
	
	test('the unsubscribe method should remove a subscription from the `subscriptions` property by its id.', () => {
		const credentials = {
			api_key: 'STREAM_KEY',
			api_secret: 'STREAM_SECRET',
			app_id: 'STREAM_ID',
		};

		const Subscriber = new FeedSubscription(credentials);
		
		const feedId = new StreamID('user:1');
		const onMessage = jest.fn();

		const expectedId = `site-${credentials.app_id}-feed-${feedId.together}`;

		Subscriber.subscribe(feedId.together, onMessage).then(id => expect(id).toBe(expectedId));

		expect(Subscriber.subscriptions[`/${expectedId}`]).toBeDefined();
		
		const cancel = jest.fn();
		Subscriber.subscriptions[`/${expectedId}`] = {
			...Subscriber.subscriptions[`/${expectedId}`],
			fayeSubscription: {
				cancel, // Mock the cancel method manually, could potentially mock Faye entirely, but this was quicker for now
			}
		}
		Subscriber.unsubscribe(expectedId);

		expect(Subscriber.subscriptions[`/${expectedId}`]).not.toBeDefined();
		expect(cancel).toHaveBeenCalledTimes(1);
	});
})