import UserTC from './User';
import * as resolvers from './resolvers';
import * as fields from './fields';

Object.keys(resolvers).map(k => UserTC.addResolver(resolvers[k](UserTC)));

UserTC.addFields({
	token: 'String',
})

export default UserTC;