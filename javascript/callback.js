// 인자로 callback 이라는 함수를 전달한 것이다.
function work(callback) {
    setTimeout(() => {
        const start = Date.now();
        for (let i = 0; i < 10000000; i++) {

        }
        const end = Date.now();
        console.log(end - start + 'ms');
        callback(end - start);
    }, 0)
}


console.log('작업 시작!');
work((ms) => {
    console.log('작업이 끝났어요!');
    console.log(ms + 'ms 걸렸다고 해요.');
});
console.log('작업 끝!');