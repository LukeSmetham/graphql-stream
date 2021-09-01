import { schemaComposer } from 'graphql-compose';
import { ensureScalars } from '../ensureScalars';

describe('ensureScalars', () => {
    beforeEach(() => {
        schemaComposer.clear();
    });

    test('should add the necessary scalars to the schema.', () => {
        ensureScalars(schemaComposer);

        expect(schemaComposer.has('StreamID')).toBe(true);
        expect(schemaComposer.has('JSON')).toBe(true);
        expect(schemaComposer.has('UUID')).toBe(true);
        expect(schemaComposer.has('Date')).toBe(true);
    });
});
