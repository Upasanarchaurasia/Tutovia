const http = require('http');
const https = require('https');
const net = require('net');
const { execSync } = require('child_process');

const VM_IP = '161.118.173.142';

console.log('====================================================');
console.log(`       ORACLE VM TELEMETRY & HEALTH REPORT          `);
console.log(`       Target Host: ${VM_IP}                        `);
console.log('====================================================\n');

// 1. Ping / Latency Check
console.log('--- 1. NETWORK LATENCY & REACHABILITY (PING) ---');
try {
  const pingOut = execSync(`ping -n 4 ${VM_IP}`, { encoding: 'utf8' });
  console.log(pingOut.trim());
} catch (err) {
  console.log('Ping failed or request timed out:', err.message);
}

// 2. Port Scan (22 SSH, 80 HTTP, 443 HTTPS, 5000 API)
console.log('\n--- 2. PORT HEALTH & REACHABILITY ---');
const checkPort = (host, port) => {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    socket.setTimeout(2500);

    socket.on('connect', () => {
      const latency = Date.now() - start;
      socket.destroy();
      resolve({ port, status: 'OPEN / REACHABLE', latency: latency + ' ms' });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ port, status: 'FILTERED / TIMEOUT', latency: 'N/A' });
    });

    socket.on('error', (err) => {
      socket.destroy();
      resolve({ port, status: 'CLOSED / REFUSED (' + err.code + ')', latency: 'N/A' });
    });

    socket.connect(port, host);
  });
};

// 3. HTTP Endpoint Health Check
const checkHttp = (url) => {
  return new Promise((resolve) => {
    const start = Date.now();
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          latency: (Date.now() - start) + ' ms',
          headers: res.headers,
          snippet: data.substring(0, 200).replace(/\s+/g, ' ')
        });
      });
    }).on('error', (err) => {
      resolve({ url, error: err.code || err.message, latency: (Date.now() - start) + ' ms' });
    });

    req.setTimeout(4000, () => {
      req.destroy();
      resolve({ url, error: 'TIMEOUT (4000ms)' });
    });
  });
};

(async () => {
  const ports = [22, 80, 443, 5000];
  for (const p of ports) {
    const r = await checkPort(VM_IP, p);
    console.log(`Port ${p.toString().padEnd(5)} (${p === 22 ? 'SSH' : p === 80 ? 'HTTP' : p === 443 ? 'HTTPS' : 'API Node'}): ${r.status} ${r.latency !== 'N/A' ? `(${r.latency})` : ''}`);
  }

  console.log('\n--- 3. HTTP SERVICE RESPONSES & ENDPOINTS ---');
  const endpoints = [
    `http://${VM_IP}/`,
    `http://${VM_IP}:5000/`,
    `http://${VM_IP}/api/exams`,
    `http://${VM_IP}:5000/api/exams`,
    `https://tutovia.com/`
  ];

  for (const ep of endpoints) {
    const res = await checkHttp(ep);
    if (res.error) {
      console.log(`- ${ep.padEnd(32)}: ERROR (${res.error})`);
    } else {
      console.log(`- ${ep.padEnd(32)}: HTTP ${res.status} [Latency: ${res.latency}]`);
      if (res.snippet) {
        console.log(`  Snippet: ${res.snippet.substring(0, 100)}...`);
      }
    }
  }

  console.log('\n====================================================');
})();
