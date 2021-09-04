import mongoose from 'mongoose';
import bcrypt from 'mongoose-bcrypt';
import { composeMongoose } from 'graphql-compose-mongoose';

const UserSchema = new mongoose.Schema({
	avatar: {
		type: String,
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		bcrypt: true,
	},
});

UserSchema.plugin(bcrypt);

const UserModel = mongoose.model('User', UserSchema);

export default composeMongoose(UserModel);