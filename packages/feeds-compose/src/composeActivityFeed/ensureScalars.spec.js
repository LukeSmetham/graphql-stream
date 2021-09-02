import { schemaComposer } from 'graphql-compose';
import { ensureScalars } from './ensureScalars';

describe('ensureScalars', () => {
    afterAll(() => {
        // By clearing afterAll, the Scalars will stay within the schemaComposer for the second test statement.
        schemaComposer.clear();
    });

    test('should add the necessary scalars to the schema only once.', () => {
        ensureScalars(schemaComposer);

        expect(schemaComposer.has('StreamID')).toBe(true);
        expect(schemaComposer.has('JSON')).toBe(true);
        expect(schemaComposer.has('UUID')).toBe(true);
        expect(schemaComposer.has('DateTime')).toBe(true);

        // call again to test the inverse of the conditions, Scalars should only be added if they don't already exist.
        ensureScalars(schemaComposer);

        expect(schemaComposer.has('StreamID')).toBe(true);
        expect(schemaComposer.has('JSON')).toBe(true);
        expect(schemaComposer.has('UUID')).toBe(true);
        expect(schemaComposer.has('DateTime')).toBe(true);
    });
});
