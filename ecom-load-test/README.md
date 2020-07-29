# Simple Load Tester

This is a simple load tester using Puppeteer. Give it a url and sequence and it will send concurrent requests and record the results. It also adds a "nocache" GET param so it works better on cached hosts such as WP Engine.

The rational here is that we needed a simple test that will also spider to resources on the page tested, namely AJAX calls in WordPress.

## Setup

Install `Node.js` for your machine then install the dependencies from this directory with the command below.

```bash
npm install
```
## Usage

```bash
node index.js <url> [concurency] [wait] [outputFile] [debug]
```

* **url**: The URL to test.
* **concurrency**: number of concurrent connections to make to the URL. For multiply sucessive tests separate each test's concurrency with a comma. For example, if you wish to run a test with 1 concurrent user, then 5 concurrent users, then 10 concurrent users you would specify this parameter as `1,5,10`. _default is a single test with 5 concurrent users_
* **wait**: The wait between tests in seconds. _default is 0_
* **outputfile**: The tile to save results to in csv format. _default is ./output.csv_
* **debug**: Will show a running list of all connections made as well as their results. _default is false_
