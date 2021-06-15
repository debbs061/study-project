const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

// 두 개의 워커가 돌아가며, 각각 부모로부터 숫자를 받아서 100을 더해 돌려준다.
// 돌려주는 순간 워커가 종료되어 worker.on('exit') 이 실행된다.
// 워커 두 개가 모두 종료되면 job done 이 로깅된다.
if (isMainThread) {
    const threads = new Set();
    threads.add(new Worker(__filename, {
        workerData: {start: 1},
    }));
    threads.add(new Worker(__filename, {
        workerData: {start: 2},
    }));
    for (let worker of threads) {
        worker.on('message', message => console.log('from worker', message));
        worker.on('exit', () => {
            threads.delete(worker);
            if (threads.size === 0) {
                console.log('job done');
            }
        });
    }
} else { // 워커일 때
    const data = workerData;
    parentPort.postMessage(data.start + 100);
}