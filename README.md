# Load Testing Report for Express.js Server with K6

This report evaluates the performance of your Express.js server and database setup, providing clear, numeric insights into how different configurations handle load and what system resources are required for specific numbers of requests per second and minute.

---

## Test Summary

You conducted tests on a system setup using the following server and database configurations:

- **Server 1**: 1 GB RAM, 1 vCPU (DigitalOcean, $12-$25/month)
- **Server 2**: 2 GB RAM, 1 vCPU (DigitalOcean, $25/month)
- **Database 1**: 1 GB RAM, 0.25 vCPU, 22 connections (DigitalOcean, $15/month)
- **Database 2**: 4 GB RAM, 2 vCPUs, 97 connections (DigitalOcean, $60/month)

The load tests simulate various traffic levels (ranging from 300 to 40,000 requests per minute), testing both `GET` and `POST` operations on user-related data.

---

## Findings

### 1 GB Server + 1 GB Database (22 connections, 1 vCPU)

- **Ideal Load**: 
  - **2000 to 3000 requests per minute** (RPM)
  - **33 to 50 requests per second** (RPS)
- **Performance**: The server and database handle this load well, with minimal failures, and response times stay under **200ms**.
- **At Maximum Load (24,000 RPM)**:
  - **Failure rate**: 23%-24% of requests failed due to timeouts.
  - **Response time**: Average response time reaches **1.8 seconds** with high latency.
  - **Reason for Failures**: Database connection limit (22 connections) is reached quickly, causing timeouts and bottlenecks. The single vCPU also struggles to process high request volume.

### 2 GB Server + 1 GB Database (22 connections, 1 vCPU)

- **Ideal Load**:
  - **Up to 6000 requests per minute** (RPM)
  - **100 requests per second** (RPS)
- **Performance**: Handles traffic up to 6000 RPM effectively with moderate response times (under 500ms), but failures start appearing around 15,000 RPM.
- **At Maximum Load (20,000 RPM)**:
  - **Failure rate**: 23%-24% of requests failed due to database bottlenecks.
  - **Response time**: Peaks at **2-4 seconds**.
  - **Reason for Failures**: Similar to the 1 GB setup, the bottleneck comes from the database connection limit and insufficient CPU power. Although the server has more RAM, the CPU is still saturated under high load.

### 2 GB Server + 4 GB Database (97 connections, 2 vCPUs)

- **Ideal Load**:
  - **Up to 18,000 requests per minute** (RPM)
  - **300 requests per second** (RPS)
- **Performance**: This configuration can comfortably handle traffic up to 18,000 RPM with minimal failures, and response times remain stable around **1-1.5 seconds**.
- **At Maximum Load (24,000 RPM)**:
  - **Failure rate**: ~24% of requests failed, though the response time stayed around **1.7 seconds**.
  - **Reason for Failures**: The larger database handles more connections (97), but the server’s single vCPU is a limiting factor, causing CPU saturation and slower request processing times.

---

## Key Insights

### 1 GB Server + 1 GB Database

- **Ideal Load**: **2000-3000 RPM**, or **50 RPS**.
- **Beyond Ideal**: When traffic exceeds 3000 RPM, response times spike, and **around 24% of requests fail**. The bottleneck is primarily due to the **22 database connections** and **single CPU core**.

### 2 GB Server + 1 GB Database

- **Ideal Load**: **5000-6000 RPM**, or **100 RPS**.
- **Beyond Ideal**: When traffic reaches 15,000-20,000 RPM, you will start seeing **2-4 second response times**, and about **23%-24% of requests will fail**. The **single vCPU** on the server and **22 connection limit** on the database are the main issues.

### 2 GB Server + 4 GB Database

- **Ideal Load**: **15,000-18,000 RPM**, or **250-300 RPS**.
- **Beyond Ideal**: At 24,000 RPM, **24% of requests fail**, and response times increase to **1.7 seconds**. The **CPU** and **server capacity** become bottlenecks even though the database performs better with more connections.

---

## Why Requests Fail Above the Ideal Load

1. **Database Connection Limits**:
   - With a low connection limit (e.g., 22 in the 1 GB database), the database can't handle more than 22 simultaneous requests, causing delays as other requests are queued, eventually leading to timeouts.

2. **CPU Saturation**:
   - Single vCPU servers get overwhelmed under heavy load, especially at 100+ requests per second, causing slower processing and increased response times.

3. **Memory Constraints**:
   - Servers with less RAM (1 GB) start experiencing memory pressure when handling many simultaneous connections, further slowing down request processing.

---

## Recommendations

1. **Small Traffic (1000-3000 RPM)**:
   - **1 GB Server + 1 GB Database** is sufficient.
   - **Expected Throughput**: Up to **50 RPS** with minimal failures and fast response times.

2. **Moderate Traffic (3000-6000 RPM)**:
   - **2 GB Server + 1 GB Database** can handle up to **6000 RPM** effectively.
   - **Expected Throughput**: Around **100 RPS** with manageable latency.

3. **Heavy Traffic (15,000-18,000 RPM)**:
   - Use **2 GB Server + 4 GB Database** for larger loads.
   - **Expected Throughput**: Around **250-300 RPS** with low failure rates, up to 18,000 RPM.

4. **For 20,000+ RPM**:
   - **Scaling Needed**: Move to a server with **more vCPUs (4+)** and **8 GB+ RAM** and consider **horizontal scaling** using load balancers and multiple server instances.
   - **Failure Prevention**: Beyond this load, failures primarily occur due to **CPU saturation** and **database connection exhaustion**.

---

This report provides a clear understanding of the ideal load your server and database configurations can handle, along with the numeric thresholds (requests per second and minute) at which failures start to occur.

# QNA

## What causes response times to increase even when all requests return a 200 status code?

The phenomenon where **response time increases** while **all requests still get a 200 status code** (indicating success) can be explained by several factors related to system resources and how requests are processed. Here's a breakdown of why this happens:

### 1. **Server Resource Saturation**
   - When a server's **CPU** or **memory** usage approaches its limits, it still tries to process all incoming requests, but it takes longer because the system has to juggle multiple tasks with limited resources.
   - Even though the server may be successful in handling all the requests (hence, the 200 status codes), it processes them more slowly due to resource contention. For example, when the CPU is maxed out, each individual request takes more time to be processed, increasing the overall **response time**.

### 2. **Queuing Mechanism**
   - **Internal request queues** (either in the web server or application server) often accumulate when the server is under heavy load. 
   - Requests are still processed sequentially, but as more requests arrive, they have to wait in line until it's their turn to be handled. This queuing increases the overall response time while still successfully responding with a 200 status.
   - It's like waiting in line at a busy restaurant: everyone will eventually get served, but it takes longer when the place is packed.

### 3. **Network Latency and Congestion**
   - Increased traffic can lead to **network congestion** or **latency** at various points between the client and server (e.g., routers, load balancers, etc.). The server can still handle all requests and return 200s, but network delays can cause an increase in the time it takes for a request to reach the server or for the response to get back to the client.

### 4. **I/O Bound Operations**
   - If the server is performing **disk I/O** (reading/writing to disk, like logging or accessing a database), this can create bottlenecks. The server may successfully process the requests, but as more requests need to perform I/O operations, the server may become slower because I/O devices (e.g., disk or network) have limited throughput.
   - **Database query times** or disk access times may increase as more concurrent operations are performed, which slows down responses without causing failures.

### 5. **Connection Pooling**
   - Many servers and databases use **connection pooling**, where a fixed number of connections are available. Under heavy load, requests have to wait for an available connection to process their task (like database queries).
   - All requests are eventually processed (hence 200 responses), but waiting for connections to become available adds to the overall response time.

### 6. **Garbage Collection or Memory Management**
   - In applications using languages like **Node.js** (which uses JavaScript), **garbage collection** may take longer as memory usage increases, especially under load. This can lead to pauses where the application is busy cleaning up memory, which delays request processing, increasing response time without resulting in failures.

### Why All Requests Still Get a 200?
- **The server is still able to handle each request** eventually, but due to queuing, resource contention, or latency, it just takes longer to process each one.
- As long as the server can handle the load without **dropping connections** or encountering **timeout issues**, the requests will all be processed successfully, resulting in **200 status codes**.
- **200** means the request was eventually processed successfully, not necessarily that it was processed quickly.

---

### Summary:
- **Increased response time** happens because the server is **overloaded or nearing its resource limits**, leading to delays in processing requests, **but it doesn't necessarily mean failure**.
- The **200 status code** simply means the server successfully handled each request, even if it took longer than usual due to bottlenecks in CPU, memory, I/O, or network resources.

## What Does a 25 Connections Limit Mean for a Database?

If a database has a **25 connections limit**, it means the database can handle **up to 25 simultaneous connections** from clients (such as your server or application). However, there are important distinctions between **connections** and **transactions**:

### What a 25 Connection Limit Means

- **Connection**: This refers to a **persistent link** between a client (like your application) and the database. If the database allows 25 connections, that means **25 different clients (or connections)** can be active at the same time. Each connection can send one or more **queries** or **transactions**.
- **Transactions**: These are specific operations or groups of operations that are executed on the database, typically involving read or write actions (like `SELECT`, `INSERT`, `UPDATE`, etc.). A **connection** can execute multiple transactions over time.

### So, with a 25 Connection Limit:
- **It can handle up to 25 simultaneous queries or transactions at the same time**, if every connection is actively processing a transaction at a given moment.
- Once the **25 connections are in use**, new clients trying to connect must **wait until a connection is freed up**.
- A single **connection** can execute **multiple transactions sequentially**, but only one transaction per connection can be processed at a time. However, once the transaction is done, the same connection can continue to execute more queries.

### Can It Handle More Than 25 Transactions?

- **Sequential Transactions**: Yes, each connection can handle **multiple transactions** over time. So while it can only handle **25 simultaneous transactions**, it can process **many more sequentially** as connections are freed up.
- **Concurrent Transactions**: No, it cannot handle more than 25 **simultaneous** transactions at the exact same time. Once all 25 connections are busy, any additional transaction will have to wait for a free connection.

### Example Scenario

- **If you have 100 transactions to process**:
  - The database will use its 25 available connections to handle the first 25 transactions concurrently.
  - As soon as one connection finishes its transaction, the next transaction in the queue can be processed, and so on, until all 100 transactions are handled.

### Key Points

- **Connection Limit = 25 connections**: At most **25 simultaneous transactions** or queries can happen.
- **Handling More Transactions**: Over time, the database can handle many more transactions than the connection limit by processing them in **batches**, but no more than 25 at once.

### Improving Throughput

- **Connection Pooling**: Use connection pooling to efficiently manage and reuse connections, preventing the database from being overwhelmed by too many connection requests.
- **Scaling Up**: Increase the connection limit by upgrading the database resources (more CPU, RAM) to handle more simultaneous transactions if needed.
