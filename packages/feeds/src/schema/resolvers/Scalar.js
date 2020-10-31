import { DateTimeResolver, JSONResolver, JSONObjectResolver, URLResolver, UUIDResolver } from 'graphql-scalars';
import { EntitySelectorResolver } from '@graphql-stream/shared';

export default {
    DateTime: DateTimeResolver,
    EntitySelector: EntitySelectorResolver,
    ID: UUIDResolver,
    JSON: JSONResolver,
    JSONObject: JSONObjectResolver,
    URL: URLResolver,
};
