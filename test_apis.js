const BASE_URL = 'http://localhost:5000/api';

async function testAPIs() {
  console.log("🚀 Starting API Testing (Port 5000)...\n");

  const endpoints = [
    { name: 'Home Route', url: 'http://localhost:5000/' },
    { name: 'Public Categories', url: `${BASE_URL}/categories` },
    { name: 'Public Subcategories', url: `${BASE_URL}/subcategories` },
    { name: 'Public Services', url: `${BASE_URL}/services` }
  ];

  for (let ep of endpoints) {
    try {
      const res = await fetch(ep.url);
      const data = await res.json();
      if (res.ok && data.success) {
        console.log(`✅ [${ep.name}] - SUCCESS (${res.status})`);
      } else {
        console.log(`❌ [${ep.name}] - FAILED (${res.status}): ${JSON.stringify(data)}`);
      }
    } catch (err) {
      console.log(`❌ [${ep.name}] - ERROR: ${err.message}`);
    }
  }

  // Admin endpoints (should be 401 without auth)
  try {
    const res = await fetch(`${BASE_URL}/admin/approved-providers`);
    const data = await res.json();
    const statusText = res.ok ? 'SUCCESS' : 'FAILED';
    console.log(`✅ [Admin Providers Auth Check] - Authentication Check (${res.status}) - ${statusText}`);
  } catch (err) {
    console.log(`❌ [Admin Providers Auth Check] - ERROR: ${err.message}`);
  }

  process.exit();
}

testAPIs();
