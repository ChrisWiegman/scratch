const {
    Cluster
} = require('puppeteer-cluster');
const helpers = require('./helpers');
const testDebugger = require('./test-debugger');

exports.executeTest = async function (testURL, concurrency = 5, wait = 0, debug = false) {

    console.log('Testing ' + testURL + ' with concurrency: ' + concurrency);

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: concurrency,
    });

    await cluster.task(async ({
        page,
        data: url
    }) => {

        testDebugger.debug(page, debug)

        const pageResponse = await page.goto(url);
        //console.log(pageResponse.headers())

        const performanceMetrics = await helpers.gatherPerformanceTimingMetrics(page);
        //console.log(performanceMetrics)

        // Returns runtime metrics of the page
        const metrics = await page.metrics();
        //console.info(metrics);

        //console.log((performanceMetrics.connectEnd - performanceMetrics.connectStart) / 1000)
    });

    for (var i = 0; i < concurrency; i++) {
        cluster.queue(testURL + '/?nocache=' + await helpers.makeid(8));
    }

    await cluster.idle();
    await cluster.close();
    console.log('Sleeping for ' + wait + 's');
    await helpers.sleep(wait * 1000);
}
