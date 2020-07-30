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

    await cluster.task(async ({
        page,
        data: url
    }) => {

        let result = {
            concurrency: concurrency,
            time: ''
        }

        testDebugger.debug(page, debug)

        await page.setDefaultNavigationTimeout(60000);

        const cacheString = '/?nocache=' + await helpers.makeid(8);

        const pageResponse = await page.goto(url + cacheString);

        if (pageResponse.headers().status == 200) {

            const performanceMetrics = await helpers.gatherPerformanceTimingMetrics(page);
            result.time = (performanceMetrics.timing.loadEventEnd - performanceMetrics.timing.connectStart) / 1000

            testResults.push(result);

        }
    });

    for (var i = 0; i < concurrency; i++) {
        cluster.queue(testURL);
    }

    await cluster.idle();
    await cluster.close();
    console.log('Sleeping for ' + wait + 's');
    await helpers.sleep(wait * 1000);

}
