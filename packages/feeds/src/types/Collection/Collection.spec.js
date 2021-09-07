import { schemaComposer, ObjectTypeComposer } from 'graphql-compose';
import capitalize from 'capitalize';
import { composer } from 'schema';

import { createCollectionInterfaces } from 'interfaces/Collection';
import { createCollectionTC } from './Collection';

describe('Collection', () => {
	beforeEach(() => {
		schemaComposer.clear();
		composer.clear();
		createCollectionInterfaces(schemaComposer);
	});

	test('Should return an ObjectTypeComposer', () => {
		const options = {
			schemaComposer,
			collection: {
				name: 'post',
				fields: {
					text: 'String!',
				},
			}
		}
		expect(createCollectionTC(options)).toBeInstanceOf(ObjectTypeComposer);
	});

	test('Returned type should have the correct name', () => {
		const options = {
			schemaComposer,
			collection: {
				name: 'post',
				fields: {
					text: 'String!',
				},
			}
		}
		expect(createCollectionTC(options).getTypeName()).toBe(`Stream${capitalize(options.collection.name)}Entity`);
	});

	// test('Should include all of the correct fields for a StreamCollection Entity.', () => {
	// 	const CollectionTC = createCollectionTC(options);
		
	// 	const fields = {
	// 		id: 'StreamID!',
	// 		followers: '[StreamID!]',
	// 		following: '[StreamID!]',
	// 		followerCount: 'Int!',
	// 		followingCount: 'Int!',
	// 	}

	// 	const fieldNames = Object.keys(fields);

	// 	expect(CollectionTC.getFieldNames()).toEqual(fieldNames);

	// 	Object.keys(fields).forEach(name => expect(CollectionTC.getFieldTypeName(name)).toBe(fields[name]));
	// });

	test('Should use libs schemaComposer if none is provided in the options object.', () => {
		createCollectionInterfaces(composer);

		const options = {
			collection: {
				name: 'post',
				fields: {
					text: 'String!',
				},
			}
		};

		createCollectionTC(options);

		const typeName = `Stream${capitalize(options.collection.name)}Entity`;
		
		expect(() => schemaComposer.getOTC(typeName)).toThrow(/Cannot find ObjectTypeComposer/)
		expect(composer.getOTC(typeName)).toBeDefined()
	});

	test('Should throw an error if no options argument was provided', () => {
		expect(() => createCollectionTC()).toThrow(/No options were provided to createCollectionTC/);
	});
});