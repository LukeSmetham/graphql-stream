import UserTC from './User';
import * as resolvers from './resolvers';

Object.keys(resolvers).map(k => UserTC.addResolver(resolvers[k](UserTC)));

UserTC.addFields({
	token: 'String',
});

UserTC.addRelation('feed', {
	prepareArgs: {
		id: (source) => `user:${source._id.toString()}`
	},
	projection: { _id: true },
	resolver: () => UserTC.schemaComposer.getOTC('StreamUserFeed').getResolver('getFeed')
})

export default UserTC;