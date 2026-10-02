import os from 'os';
import fs from 'fs';
import http from 'http';
import { execSync } from 'child_process';

console.log('====================================================');
console.log('                VM HEALTH & TELEMETRY REPORT       ');
console.log('====================================================\n');

// 1. System Metadata
console.log('--- 1. SYSTEM METADATA ---');
console.log('Hostname:        ', os.hostname());
console.log('Platform/Arch:   ', os.platform(), os.arch());
console.log('OS Release:      ', os.release());
console.log('System Uptime:   ', Math.floor(os.uptime() / 86400) + ' days, ' + Math.floor((os.uptime() % 86400) / 3600) + ' hours, ' + Math.floor((os.uptime() % 3600) / 60) + ' mins');
console.log('Local Time:      ', new Date().toLocaleString());

// 2. CPU Metrics
console.log('\n--- 2. CPU METRICS ---');
const cpus = os.cpus();
console.log('CPU Model:       ', cpus[0].model);
console.log('Logical Cores:   ', cpus.length);
let totalUser = 0, totalSys = 0, totalIdle = 0;
cpus.forEach(c => {
  totalUser += c.times.user;
  totalSys += c.times.sys;
  totalIdle += c.times.idle;
});
const totalTicks = totalUser + totalSys + totalIdle;
const cpuUsage = (((totalUser + totalSys) / totalTicks) * 100).toFixed(1);
console.log('Estimated CPU Load:', cpuUsage + '%');

// 3. Memory Metrics
console.log('\n--- 3. MEMORY METRICS ---');
const totalMem = os.totalmem();
const freeMem = os.freemem();
const usedMem = totalMem - freeMem;
console.log('Total Memory:    ', (totalMem / (1024**3)).toFixed(2) + ' GB');
console.log('Used Memory:     ', (usedMem / (1024**3)).toFixed(2) + ' GB (' + ((usedMem / totalMem) * 100).toFixed(1) + '%)');
console.log('Free Memory:     ', (freeMem / (1024**3)).toFixed(2) + ' GB (' + ((freeMem / totalMem) * 100).toFixed(1) + '%)');

// 4. Disk Storage Health
console.log('\n--- 4. DISK HEALTH (C: DRIVE) ---');
try {
  const disk = fs.statfsSync('C:\\');
  const diskTotalGB = (disk.blocks * disk.bsize / (1024**3)).toFixed(2);
  const diskFreeGB = (disk.bavail * disk.bsize / (1024**3)).toFixed(2);
  const diskUsedGB = (Number(diskTotalGB) - Number(diskFreeGB)).toFixed(2);
  const diskPct = ((diskFreeGB / diskTotalGB) * 100).toFixed(1);
  console.log('Disk Total:      ', diskTotalGB + ' GB');
  console.log('Disk Used:       ', diskUsedGB + ' GB');
  console.log('Disk Available:  ', diskFreeGB + ' GB (' + diskPct + '% free)');
} catch (err) {
  console.log('Disk Check Err:  ', err.message);
}

// 5. Active Process Memory Top Consumers
console.log('\n--- 5. ACTIVE PROCESSES (TOP MEMORY USERS) ---');
try {
  const out = execSync('tasklist /FO CSV /NH', { encoding: 'utf8' });
  const lines = out.trim().split('\n');
  const procs = [];
  lines.forEach(l => {
    const parts = l.split('","').map(s => s.replace(/"/g, ''));
    if (parts.length >= 5) {
      const memKB = parseInt(parts[4].replace(/[^\d]/g, '')) || 0;
      procs.push({ name: parts[0], pid: parts[1], memMB: (memKB / 1024).toFixed(1) });
    }
  });
  procs.sort((a, b) => parseFloat(b.memMB) - parseFloat(a.memMB));
  procs.slice(0, 8).forEach(p => {
    console.log(`- ${p.name.padEnd(25)} (PID ${p.pid.padEnd(6)}): ${p.memMB.padStart(7)} MB`);
  });
} catch (e) {
  console.log('Process query error:', e.message);
}

// 6. Local Server Ports Health
console.log('\n--- 6. APPLICATION & SERVICE PORTS ---');
const checkPort = (port) => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:' + port, (res) => {
      resolve({ port, status: 'ONLINE', code: res.statusCode });
    }).on('error', (err) => {
      resolve({ port, status: 'OFFLINE', err: err.code });
    });
    req.setTimeout(1500, () => {
      req.destroy();
      resolve({ port, status: 'TIMEOUT' });
    });
  });
};

const ports = [3000, 5000, 5173, 80];
for (const p of ports) {
  const r = await checkPort(p);
  const statusText = r.status === 'ONLINE' ? `ONLINE (HTTP ${r.code})` : `OFFLINE (${r.err || 'Unreachable'})`;
  console.log(`- Port ${p.toString().padEnd(5)}: ${statusText}`);
}
console.log('\n====================================================');
