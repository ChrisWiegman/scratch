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
* **outputFile**: The tile to save results to in csv format. _default is ./output.csv_
* **debug**: Will show a running list of all connections made as well as their results. _default is false_

## Return Data

As this is meant to be _simple_ it creats a CSV with only 2 columns, concurrency to allow identifying which test was run and the time the test took. Note it only returns results for **successful** tests. If a test failed it is omitted. Dividing a count of each test against its concurrency will give you the success rate for a given concurrency.

## Examples:

* Perform a single test with 5 concurrent users against https://chriswiegman.com

```bash
node index.js https://chriswiegman.com
```

* Perform multiple tests against https://chriswiegman.com scaling up concurrent users from 1-50 in increments of 5. Wait for 1 minute between tests

```bash
node index.js https://chriswiegman.com 1,5,10,15,20,25,30,35,40,45,50 60
```

* Perform multiple tests against https://chriswiegman.com scaling up concurrent users from 1-50 in increments of 5. Wait for 1 minute between tests. Save the results to my-test.csv

```bash
node index.js https://chriswiegman.com 1,5,10,15,20,25,30,35,40,45,50 60 my-test.csv
```
