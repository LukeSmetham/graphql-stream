import { createFeedsContext } from '../../packages/feeds/lib/context';

const { STREAM_KEY, STREAM_SECRET, STREAM_ID } = process.env;

const createContext = () => ({
    stream: createFeedsContext(STREAM_KEY, STREAM_SECRET, STREAM_ID),
});

export default createContext;
