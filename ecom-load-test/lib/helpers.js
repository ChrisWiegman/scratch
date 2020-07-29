exports.sleep = async function (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

exports.makeid = async function (length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.gatherPerformanceTimingMetrics = async function (page) {
    // The values returned from evaluate() function should be JSON serializable.
    const rawMetrics = await page.evaluate(() =>
        JSON.stringify(window.performance));
    const metrics = JSON.parse(rawMetrics);
    return metrics;
}
