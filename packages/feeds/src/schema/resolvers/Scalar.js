import { DateTimeResolver, JSONResolver, JSONObjectResolver, URLResolver } from 'graphql-scalars';
import { EntitySelectorResolver } from '@graphql-stream/shared';

export default {
    DateTime: DateTimeResolver,
    JSON: JSONResolver,
    JSONObject: JSONObjectResolver,
    EntitySelector: EntitySelectorResolver,
    URL: URLResolver,
};
