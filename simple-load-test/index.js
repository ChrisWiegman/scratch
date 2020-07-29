const runner = require('./lib/test-runner.js');
const ObjectsToCsv = require('objects-to-csv');

(async () => {

    const runtimeArgs = process.argv.slice(2);

    if (runtimeArgs.length === 0) {
        console.error('You must supply a URL to continue');
        process.exit(1);
    }

    let testURL = runtimeArgs[0];
    let testConcurencies = [5];
    let wait = 0;
    let debug = false;
    let testResults = [];
    let outputFile = './output.csv'

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

    if (runtimeArgs.length >= 4) {
        outputFile = runtimeArgs[3];
    }

    if (runtimeArgs.length === 5 && (runtimeArgs[4] === 1 || runtimeArgs[4] === 'true')) {
        debug = true;
    }

    await runClusters(testConcurencies, async (concurrency) => {
        await runner.executeTest(testURL, testResults, concurrency, wait, debug);
    })

    const csv = new ObjectsToCsv(testResults);

    // Save to file:
    await csv.toDisk(outputFile);

})();

async function runClusters(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
