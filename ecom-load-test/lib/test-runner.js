const {
    Cluster
} = require('puppeteer-cluster');
const helpers = require('./helpers');
const testDebugger = require('./test-debugger');

exports.executeTest = async function (testURL, testResults, concurrency = 5, wait = 0, debug = false) {

    console.log('Testing ' + testURL + ' with concurrency: ' + concurrency);

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: concurrency,
    });
    let result = {
        id: process.hrtime()[1],
        concurrency: concurrency,
        status: '',
        time: ''
    }

    await cluster.task(async ({
        page,
        data: url
    }) => {

        testDebugger.debug(page, debug)

        const cacheString = '/?nocache=' + await helpers.makeid(8);

        const pageResponse = await page.goto(url + cacheString);
        result.status = pageResponse.headers().status

        const performanceMetrics = await helpers.gatherPerformanceTimingMetrics(page);
        result.time = (performanceMetrics.timing.loadEventEnd - performanceMetrics.timing.connectStart) / 1000

        testResults.push(result);

    });

    for (var i = 0; i < concurrency; i++) {
        cluster.queue(testURL);
    }

    await cluster.idle();
    await cluster.close();
    console.log('Sleeping for ' + wait + 's');
    await helpers.sleep(wait * 1000);

}
