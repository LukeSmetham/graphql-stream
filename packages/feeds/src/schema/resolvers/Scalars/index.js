import { DateTimeResolver, JSONResolver, JSONObjectResolver, URLResolver } from 'graphql-scalars';
import { StreamSelectorResolver } from '@graphql-stream/shared';

export default {
    DateTime: DateTimeResolver,
    FeedSelector: StreamSelectorResolver,
    JSON: JSONResolver,
    JSONObject: JSONObjectResolver,
    URL: URLResolver,
};
