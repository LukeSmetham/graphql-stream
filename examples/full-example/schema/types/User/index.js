import UserTC from './User';
import * as resolvers from './resolvers';

Object.keys(resolvers).map(k => UserTC.addResolver(resolvers[k](UserTC)));

export default UserTC;