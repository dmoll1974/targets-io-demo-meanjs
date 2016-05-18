import Monyt, {
    RequestCountMetrics,
    ErrorCountMetrics,
    MemoryMetrics,
    GarbageCollectionMetrics,
    EventLoopLagMetrics,
    GraphiteSender
} from 'monyt';

const interval = 15000; //default is 30000(ms)

const senders = [new GraphiteSender({
    host: 'graphite',
    port: '2003' //port of plaintext protocol
})];

const metricses = [
    new RequestCountMetrics(),
    new ErrorCountMetrics(),
    new MemoryMetrics(),
    new GarbageCollectionMetrics(),
    new EventLoopLagMetrics()
];

const monitor = new Monyt({
    interval,
    prefix: `node.mean.`, //This could be server hostname or application name or clusterId and etc.
    senders,
    metricses
});

export default monitor;
