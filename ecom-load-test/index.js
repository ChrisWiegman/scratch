const runner = require('./lib/test-runner.js');

(async () => {

    const runtimeArgs = process.argv.slice(2);

    if (runtimeArgs.length === 0) {
        console.error('You must supply a URL to continue')
    }

    let testURL = runtimeArgs[0];
    let testConcurencies = [5];
    let wait = 0;
    let debug = false;

    if (runtimeArgs.length >= 2) {
        const concurrencyEntries = runtimeArgs[1].split(',');
        testConcurencies = [];

        concurrencyEntries.forEach(function (concurrency) {
            testConcurencies.push(parseInt(concurrency));
        });
    }

    if (runtimeArgs.length >= 3) {
        wait = parseInt(runtimeArgs[2]);
    }

    if (runtimeArgs.length === 4 && (runtimeArgs[3] === 1 || runtimeArgs[3] === 'true')) {
        debug = true;
    }

    runClusters(testConcurencies, async (concurrency) => {
        await runner.executeTest(testURL, concurrency, wait, debug);
    })

})();

async function runClusters(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
