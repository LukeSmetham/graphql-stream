import { DateTimeResolver, JSONResolver, JSONObjectResolver, URLResolver } from 'graphql-scalars';
import { StreamSelectorResolver } from '@graphql-stream/shared';

export default {
    DateTime: DateTimeResolver,
    JSON: JSONResolver,
    JSONObject: JSONObjectResolver,
    StreamSelector: StreamSelectorResolver,
    URL: URLResolver,
};
