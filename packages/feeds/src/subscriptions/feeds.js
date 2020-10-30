import { PubSubEngine } from 'graphql-subscriptions';

export class FeedsSubscription extends PubSubEngine {
	currentSubscriptionId = 0;

	subscriptions = {};

	subRefMap = {};

	constructor(client) {
		super();

		if (!client) {
			throw new Error(
				'Missing client instance when initializing FeedsSubscription.'
			);
		}

		if (!client.appId) {
			throw new Error('Missing Stream App ID - Make sure you pass it as the third argument to the Feeds Client.');
		}

		this.client = client;
	}

	publish = () => Promise.resolve();

	subscribe(triggerName, onMessage) {
		const feedParts = triggerName.split(':');

		const id = this.currentSubscriptionId++;

		const feed = this.client.feed(...feedParts);

		this.subscriptions[id] = feed.subscribe(onMessage);

		return Promise.resolve(id);
	}

	unsubscribe(id) {
		const subscription = this.subscriptions[id];

		delete this.subscriptions[id];

		subscription.unsubscribe();
	}
}
