const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

const tenancyId = 'ocid1.tenancy.oc1..aaaaaaaa5uaav5qgmvqt2of3iabz5fsb6ptucrgxasjpgzunybyta3426b3q';
const userId = 'ocid1.user.oc1..aaaaaaaalmphbxagf7spp6xcrpdjgbwxvxpkxt47tpyn3irkm22t6mfrukdq';
const fingerprint = '33:f0:26:a2:19:20:27:b2:e2:7a:94:f9:d6:e8:76:33';
const region = 'ap-mumbai-1';
const keyPath = 'C:\\Users\\Nidhi Chaurasia\\.ssh\\tutovia.pem';
const instanceId = 'ocid1.instance.oc1.ap-mumbai-1.anrg6ljrmirvkcqccnssm7toe5npzlos3fixjgzwwraxxidwp4gihpzhtc6q';

const privateKey = fs.readFileSync(keyPath, 'utf8');

function ociPost(host, targetPath, body) {
  return new Promise((resolve) => {
    const date = new Date().toUTCString();
    const bodyStr = JSON.stringify(body);
    const bodySha256 = crypto.createHash('sha256').update(bodyStr).digest('base64');
    const contentLength = Buffer.byteLength(bodyStr);
    
    const signingString = `(request-target): post ${targetPath}\ndate: ${date}\nx-content-sha256: ${bodySha256}\ncontent-type: application/json\ncontent-length: ${contentLength}\nhost: ${host}`;
    
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signingString);
    const signature = sign.sign(privateKey, 'base64');
    
    const authHeader = `Signature version="1",headers="(request-target) date x-content-sha256 content-type content-length host",keyId="${tenancyId}/${userId}/${fingerprint}",algorithm="rsa-sha256",signature="${signature}"`;
    
    const options = {
      hostname: host,
      path: targetPath,
      method: 'POST',
      headers: {
        'date': date,
        'host': host,
        'x-content-sha256': bodySha256,
        'content-type': 'application/json',
        'content-length': contentLength,
        'Authorization': authHeader
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    
    req.on('error', (err) => resolve({ error: err.message }));
    req.write(bodyStr);
    req.end();
  });
}

(async () => {
  const host = `telemetry.${region}.oraclecloud.com`;
  const now = new Date();
  const startTime = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const endTime = now.toISOString();

  const queryPayload = {
    compartmentId: tenancyId,
    query: `CpuUtilization[1m]{resourceId = "${instanceId}"}.mean()`,
    startTime,
    endTime
  };

  const res = await ociPost(host, `/20180401/metrics/summarizeMetricsData?compartmentId=${tenancyId}`, queryPayload);
  console.log('Cpu Metrics Status:', res.status);
  if (res.body && res.body.length > 0) {
    const points = res.body[0].aggregatedDatapoints;
    if (points && points.length > 0) {
      const latest = points[points.length - 1];
      console.log('Latest CPU Utilization: ' + latest.value.toFixed(2) + '% at ' + latest.timestamp);
    }
  }

  // Memory metric query
  const memPayload = {
    compartmentId: tenancyId,
    query: `MemoryUtilization[1m]{resourceId = "${instanceId}"}.mean()`,
    startTime,
    endTime
  };
  const memRes = await ociPost(host, `/20180401/metrics/summarizeMetricsData?compartmentId=${tenancyId}`, memPayload);
  console.log('Memory Metrics Status:', memRes.status);
  if (memRes.body && memRes.body.length > 0) {
    const points = memRes.body[0].aggregatedDatapoints;
    if (points && points.length > 0) {
      const latest = points[points.length - 1];
      console.log('Latest Memory Utilization: ' + latest.value.toFixed(2) + '% at ' + latest.timestamp);
    }
  }
})();
