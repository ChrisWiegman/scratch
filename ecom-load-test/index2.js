const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Emitted when the DOM is parsed and ready (without waiting for resources)
    page.once('domcontentloaded', () => console.info('✅ DOM is ready'));

    // Emitted when the page is fully loaded
    page.once('load', () => console.info('✅ Page is loaded'));

    // Emitted when the page attaches a frame
    page.on('frameattached', () => console.info('✅ Frame is attached'));

    // Emitted when a frame within the page is navigated to a new URL
    page.on('framenavigated', () => console.info('👉 Frame is navigated'));

    // Emitted when a script within the page uses `console.timeStamp`
    page.on('metrics', data => console.info(`👉 Timestamp added at ${data.metrics.Timestamp}`));

    // Emitted when a script within the page uses `console`
    //page.on('console', message => console[message.type()](`👉 ${message.text()}`));

    // Emitted when the page emits an error event (for example, the page crashes)
    page.on('error', error => console.error(`❌ ${error}`));

    // Emitted when a script within the page has uncaught exception
    page.on('pageerror', error => console.error(`❌ ${error}`));

    // Emitted when a script within the page uses `alert`, `prompt`, `confirm` or `beforeunload`
    page.on('dialog', async dialog => {
        console.info(`👉 ${dialog.message()}`);
        await dialog.dismiss();
    });

    // Emitted when a new page, that belongs to the browser context, is opened
    page.on('popup', () => console.info('👉 New page is opened'));

    // Emitted when the page produces a request
    page.on('request', request => console.info(`👉 Request: ${request.url()}`));

    // Emitted when a request, which is produced by the page, fails
    page.on('requestfailed', request => console.info(`❌ Failed request: ${request.url()}`));

    // Emitted when a request, which is produced by the page, finishes successfully
    page.on('requestfinished', request => console.info(`👉 Finished request: ${request.url()}`));

    // Emitted when a response is received
    page.on('response', response => console.info(`👉 Response: ${response.url()}`));

    // Emitted when the page creates a dedicated WebWorker
    page.on('workercreated', worker => console.info(`👉 Worker: ${worker.url()}`));

    // Emitted when the page destroys a dedicated WebWorker
    page.on('workerdestroyed', worker => console.info(`👉 Destroyed worker: ${worker.url()}`));

    // Emitted when the page detaches a frame
    page.on('framedetached', () => console.info('✅ Frame is detached'));

    // Emitted after the page is closed
    page.once('close', () => console.info('✅ Page is closed'));

    const callId = await makeid(8);

    const url = 'https://ecom150784.wpenginedev.com/?nocache=' + callId;
    console.log(url);

    const pageResponse = await page.goto(url);
    console.log(pageResponse.headers())

    const performanceMetrics = await gatherPerformanceTimingMetrics(page);
    console.log(performanceMetrics)

    // Returns runtime metrics of the page
    const metrics = await page.metrics();
    console.info(metrics);

    //console.log((performanceMetrics.connectEnd - performanceMetrics.connectStart) / 1000)

    await browser.close();
})();

async function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function gatherPerformanceTimingMetrics(page) {
    // The values returned from evaluate() function should be JSON serializable.
    const rawMetrics = await page.evaluate(() =>
        JSON.stringify(window.performance));
    const metrics = JSON.parse(rawMetrics);
    return metrics;
}
