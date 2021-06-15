/**
 * 10000000 까지 소수의 개수를 구하려 한다.
 * 8 개의 스레드가 일을 나눠서 처리하도록 한다.
 */
const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

const min = 2;
let primes = [];

function findPrimes(start, range) {
    let isPrime = true;
    const end = start + range;
    for (let i = start; i < end; i++) {
        for (let j = min; j < Math.sqrt(end); j++) {
            if (i !== j && i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            primes.push(i);
        }
        isPrime = true;
    }
}

if (isMainThread) {
    const max = 10000000;
    const threadCount = 8;
    const threads = new Set();
    const range = Math.ceil((max - min) / threadCount);
    let start = min;
    console.time('prime');
    for (let i = 0; i < threadCount - 1; i++) {
        const wStart = start;
        threads.add(new Worker(__filename, {workerData: {start: wStart, range}}));
        start += range;
    }
    threads.add(new Worker(__filename, {
        workerData: {start, range: range + ((max - min + 1) % threadCount)}
    }));
    for (let worker of threads) {
        worker.on('error', (err) => {
            throw err;
        });
        worker.on('exit', () => {
            threads.delete(worker);
            if (threads.size === 0) {
                console.timeEnd('prime');
                console.log(primes.length);
            }
        });
        worker.on('message', (msg) => {
            primes = primes.concat(msg);
        })
    }
} else {
    findPrimes(workerData.start, workerData.range);
    parentPort.postMessage(primes);
}