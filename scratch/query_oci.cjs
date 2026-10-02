const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

// Read OCI Config
const tenancyId = 'ocid1.tenancy.oc1..aaaaaaaa5uaav5qgmvqt2of3iabz5fsb6ptucrgxasjpgzunybyta3426b3q';
const userId = 'ocid1.user.oc1..aaaaaaaalmphbxagf7spp6xcrpdjgbwxvxpkxt47tpyn3irkm22t6mfrukdq';
const fingerprint = '33:f0:26:a2:19:20:27:b2:e2:7a:94:f9:d6:e8:76:33';
const region = 'ap-mumbai-1';
const keyPath = 'C:\\Users\\Nidhi Chaurasia\\.ssh\\tutovia.pem';

const privateKey = fs.readFileSync(keyPath, 'utf8');

function ociRequest(targetPath) {
  return new Promise((resolve, reject) => {
    const host = `iaas.${region}.oraclecloud.com`;
    const date = new Date().toUTCString();
    
    // Signing string
    const signingString = `(request-target): get ${targetPath}\ndate: ${date}\nhost: ${host}`;
    
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signingString);
    const signature = sign.sign(privateKey, 'base64');
    
    const authHeader = `Signature version="1",headers="(request-target) date host",keyId="${tenancyId}/${userId}/${fingerprint}",algorithm="rsa-sha256",signature="${signature}"`;
    
    const options = {
      hostname: host,
      path: targetPath,
      method: 'GET',
      headers: {
        'date': date,
        'host': host,
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
    
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  console.log('Querying Oracle Cloud Compute instances...');
  const res = await ociRequest(`/20160918/instances?compartmentId=${tenancyId}`);
  console.log('Status:', res.status);
  console.log('Result:', JSON.stringify(res.body || res.raw, null, 2));

  if (res.body && Array.isArray(res.body)) {
    for (const inst of res.body) {
      console.log('\n--- INSTANCE FOUND ---');
      console.log('ID:          ', inst.id);
      console.log('Display Name:', inst.displayName);
      console.log('Shape:       ', inst.shape);
      console.log('State:       ', inst.lifecycleState);
      console.log('Shape Config:', inst.shapeConfig);
      console.log('Availability Domain:', inst.availabilityDomain);
      
      // Query boot volume attachments
      const bvaRes = await ociRequest(`/20160918/bootVolumeAttachments?availabilityDomain=${encodeURIComponent(inst.availabilityDomain)}&compartmentId=${tenancyId}&instanceId=${inst.id}`);
      if (bvaRes.body && Array.isArray(bvaRes.body) && bvaRes.body.length > 0) {
        const bootVolId = bvaRes.body[0].bootVolumeId;
        console.log('Boot Volume ID:', bootVolId);
        const bvRes = await ociRequest(`/20160918/bootVolumes/${bootVolId}`);
        if (bvRes.body) {
          console.log('Boot Volume (SSD) Details:');
          console.log('  Size in GBs:    ', bvRes.body.sizeInGBs);
          console.log('  VPU Performance:', bvRes.body.vpusPerGB);
          console.log('  State:          ', bvRes.body.lifecycleState);
        }
      }
    }
  }
})();
