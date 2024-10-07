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
