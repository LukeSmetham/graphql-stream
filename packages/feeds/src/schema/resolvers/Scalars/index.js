import { DateTimeResolver, JSONResolver, JSONObjectResolver, URLResolver } from 'graphql-scalars';
import FeedSelector from './FeedSelector';

export default {
    DateTime: DateTimeResolver,
    JSON: JSONResolver,
    JSONObject: JSONObjectResolver,
	URL: URLResolver,
	FeedSelector,
};
