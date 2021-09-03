import { schemaComposer } from 'graphql-compose';
import { collectionEntityInterfaceFields, createCollectionInterfaces } from './Collection';

describe('ActivityInterface Creation', () => {
    beforeAll(() => {
        schemaComposer.clear();
    });

    test('Creates the StreamCollectionEntityInterface', () => {
        createCollectionInterfaces(schemaComposer);
        // Run twice to ensure that the interfaces are only added once
        createCollectionInterfaces(schemaComposer);

        expect(schemaComposer.has('StreamCollectionEntityInterface')).toBe(true);
    });

    describe('StreamCollectionEntityInterface', () => {
        test('contains all the correct fields', () => {
            createCollectionInterfaces(schemaComposer);

            Object.keys(collectionEntityInterfaceFields).forEach(field => {
                const tc = schemaComposer.getIFTC('StreamCollectionEntityInterface');

                expect(tc.hasField(field)).toBe(true);
            });
        });
    });
});
