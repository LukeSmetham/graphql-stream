import { schemaComposer } from 'graphql-compose';
import { activityInterfaceFields, groupedActivityInterfaceFields, createActivityInterfaces } from './Activity';

describe('ActivityInterface Creation', () => {
    beforeAll(() => {
        schemaComposer.clear();
    });

    test('Creates the StreamActivityInterface & StreamGroupedActivityInterface type on the schemaComposer', () => {
        createActivityInterfaces(schemaComposer);
        // Run twice to ensure that the interfaces are only added once
        createActivityInterfaces(schemaComposer);

        expect(schemaComposer.has('StreamActivityInterface')).toBe(true);
        expect(schemaComposer.has('StreamGroupedActivityInterface')).toBe(true);
    });

    describe('StreamActivityInterface', () => {
        test('contains all the correct fields', () => {
            createActivityInterfaces(schemaComposer);

            Object.keys(activityInterfaceFields).forEach(field => {
                const tc = schemaComposer.getIFTC('StreamActivityInterface');

                expect(tc.hasField(field)).toBe(true);
            });
        });
    });

    describe('StreamGroupedActivityInterface', () => {
        test('contains all the correct fields', () => {
            createActivityInterfaces(schemaComposer);

            Object.keys(groupedActivityInterfaceFields).forEach(field => {
                const tc = schemaComposer.getIFTC('StreamGroupedActivityInterface');

                expect(tc.hasField(field)).toBe(true);
            });
        });
    });
});
