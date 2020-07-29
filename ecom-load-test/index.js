const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setCacheEnabled(false);

    const callId = await makeid(8);

    const url = 'https://ecom150784.wpenginedev.com/?nocache=' + callId;
    console.log(url);

    const pageResponse = await page.goto(url);
    console.log(pageResponse.headers().status)

    const performanceMetrics = await gatherPerformanceTimingMetrics(page);
    console.log(performanceMetrics)

    const content = await page.content();

    console.log(content.length);

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

async function gatherPerformanceTimingMetrics (page) {
    // The values returned from evaluate() function should be JSON serializable.
    const rawMetrics = await page.evaluate(() =>
        JSON.stringify(window.performance.timing));
    const metrics = JSON.parse(rawMetrics);
    return metrics;
}
