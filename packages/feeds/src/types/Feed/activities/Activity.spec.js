import { schemaComposer, ObjectTypeComposer } from 'graphql-compose';
import capitalize from 'capitalize';

import { createActivityTC, createGroupedActivityTC } from './Activity';
import { createActivityInterfaces, activityInterfaceFields, groupedActivityInterfaceFields } from 'interfaces/Activity';

const baseOptions = {
	schemaComposer,
};

describe('Activities', () => {
	describe('Activity', () => {
		beforeAll(() => {
			schemaComposer.clear();
			createActivityInterfaces(schemaComposer);
		});

		const options = {
			...baseOptions,
			feed: {
				feedGroup: 'user',
				type: 'flat',
				activityFields: {
					text: 'String!',
				},
			}
		}

		test('Should return an ObjectTypeComposer', () => {
			expect(createActivityTC(options)).toBeInstanceOf(ObjectTypeComposer);
		});
	
		test('Returned type should have the correct name', () => {
			expect(createActivityTC(options).getTypeName()).toBe(`Stream${capitalize(options.feed.feedGroup)}Activity`);
		});

		test('Should include all of the base Activity fields, and any fields defined in the field config.', () => {
			const ActivityTC = createActivityTC(options);
			
			const fields = {
				...activityInterfaceFields,
				...(options.feed.activityFields || {}),
			}

			const fieldNames = Object.keys(fields);

			expect(ActivityTC.getFieldNames()).toEqual(fieldNames);

			Object.keys(fields).forEach(name => expect(ActivityTC.getFieldTypeName(name)).toBe(fields[name].type ?? fields[name]));
		});

		test('Should error if `options` parameter isn\t present / doesn\'t contain any feed config.', () => {
			expect(() => {
				createActivityTC();
			}).toThrow(/No feed config provided/)
		});
	});

	describe('GroupedActivity', () => {
		beforeAll(() => {
			schemaComposer.clear();
			createActivityInterfaces(schemaComposer);
		});

		test('Should only return an ObjectTypeComposer if the feed type is `aggregated` or `notification`', () => {
			let ActivityTC;

			// Aggregated
			const aggregatedOptions = {
				...baseOptions,
				feed: {
					feedGroup: 'timeline',
					type: 'aggregated',
				}
			};
			ActivityTC = createActivityTC(aggregatedOptions);
			expect(createGroupedActivityTC(ActivityTC, aggregatedOptions)).toBeInstanceOf(ObjectTypeComposer);

			// Notification
			const notificationOptions = {
				...baseOptions,
				feed: {
					feedGroup: 'notification',
					type: 'notification',
				}
			};
			ActivityTC = createActivityTC(notificationOptions);
			expect(createGroupedActivityTC(ActivityTC, notificationOptions)).toBeInstanceOf(ObjectTypeComposer);

			// Flat
			const flatOptions = {
				...baseOptions,
				feed: {
					feedGroup: 'user',
					type: 'flat',
				}
			};
			ActivityTC = createActivityTC(flatOptions);
			expect(createGroupedActivityTC(ActivityTC, flatOptions)).not.toBeDefined();
		});
	
		test('Returned type should have the correct name', () => {
			const options = {
				...baseOptions,
				feed: {
					feedGroup: 'timeline',
					type: 'aggregated',
				}
			};
			const ActivityTC = createActivityTC(options);
			expect(createGroupedActivityTC(ActivityTC, options).getTypeName()).toBe(`Stream${capitalize(options.feed.feedGroup)}ActivityGroup`);
		});

		test('Should include all of the base GroupedActivity fields, and any fields defined in the field config.', () => {
			const options = {
				...baseOptions,
				feed: {
					feedGroup: 'timeline',
					type: 'aggregated',
				}
			};

			const ActivityTC = createActivityTC(options);
			const GroupedActivityTC = createGroupedActivityTC(ActivityTC, options);

			const fields = {
				id: 'ID!',
				activities: '[StreamActivity]',
				...groupedActivityInterfaceFields,
			}

			const fieldNames = Object.keys(fields);

			expect(GroupedActivityTC.getFieldNames()).toEqual(fieldNames);

			Object.keys(fields).forEach(name => expect(GroupedActivityTC.getFieldTypeName(name)).toBe(fields[name].type ?? fields[name]));
		});

		test('Should error if `options` parameter isn\t present / doesn\'t contain any feed config.', () => {
			expect(() => {
				const options = {
					...baseOptions,
					feed: {
						feedGroup: 'timeline',
						type: 'aggregated',
					}
				};
				const ActivityTC = createActivityTC(options);
				createGroupedActivityTC(ActivityTC);
			}).toThrow(/No feed config provided/)
		});
	});
})