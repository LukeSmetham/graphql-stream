import { PubSubEngine } from 'graphql-subscriptions';
import * as Faye from 'faye';
import jwt from 'jsonwebtoken';

export class FeedSubscription extends PubSubEngine {
    fayeClient;

    currentSubscriptionId = 0;

    subscriptions = {};

    subRefMap = {};

    constructor(credentials) {
        super();

        if (!credentials) {
            throw new Error('Missing Stream Feeds credentials when initializing FeedsSubscription.');
        }

        if (!credentials.app_id) {
            throw new Error('Missing Stream App ID - Make sure you pass it with your credentials in order to enable subscriptions.');
        }

        this.credentials = credentials;
        this.fayeClient = this._getFayeClient();
    }

    _getFayeAuthorization() {
        return {
            incoming: (message, callback) => {
				console.log('incoming',message);
				return callback(message)
			},
            outgoing: (message, callback) => {
                if (message.subscription && this.subscriptions[message.subscription]) {
                    const subscription = this.subscriptions[message.subscription];

                    // eslint-disable-next-line no-param-reassign
                    message.ext = {
                        user_id: subscription.userId,
                        api_key: this.credentials.api_key,
                        signature: subscription.token,
                    };

					console.log(message.ext)
                }

                callback(message);
            },
        };
    }

    _getFayeClient(timeout = 10) {
        if (!this.fayeClient) {
            this.fayeClient = new Faye.Client('https://faye-us-east.stream-io-api.com/faye', { timeout });

            const authExtension = this._getFayeAuthorization();

            this.fayeClient.addExtension(authExtension);
        }

        return this.fayeClient;
    }

    publish = () => Promise.resolve();

    subscribe(feed, onMessage) {
        const id = `site-${this.credentials.app_id}-feed-${feed}`;

        const subscription = this._getFayeClient().subscribe(`/${id}`, onMessage);

		const token = jwt.sign(
            {
                resource: '*',
                action: '*',
                feed_id: feed,
            },
            this.credentials.api_secret
        );

        this.subscriptions[`/${id}`] = {
            token,
            userId: id,
            fayeSubscription: subscription,
        };

        return Promise.resolve(id);
    }

    unsubscribe(id) {
        const subscription = this.subscriptions[`/${id}`];

        delete this.subscriptions[`/${id}`];

        subscription.fayeSubscription.cancel();
    }
}
