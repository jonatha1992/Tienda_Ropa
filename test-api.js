// Test script to verify frontend-backend API communication
const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v1';

async function testEndpoints() {
  console.log('🔄 Testing Frontend-Backend API Communication...\n');
  
  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      url: `${BASE_URL.replace('/api/v1', '')}/health`,
      expectAuth: false
    },
    {
      name: 'Admin Shipping Statistics',
      method: 'GET', 
      url: `${BASE_URL}/admin/shipping/statistics`,
      expectAuth: true
    },
    {
      name: 'Admin Shipping Providers',
      method: 'GET',
      url: `${BASE_URL}/admin/shipping/providers`, 
      expectAuth: true
    },
    {
      name: 'Orders with Customer Info (Admin)',
      method: 'GET',
      url: `${BASE_URL}/orders/admin`,
      expectAuth: true
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`${test.method} ${test.url}`);
      
      const response = await axios({
        method: test.method,
        url: test.url,
        timeout: 5000,
        validateStatus: function (status) {
          // Accept both success and auth error responses for testing
          return status < 500;
        }
      });

      if (response.status === 200) {
        console.log('✅ SUCCESS: Endpoint responding correctly');
        if (response.data) {
          console.log(`   Response keys: ${Object.keys(response.data).join(', ')}`);
        }
      } else if (response.status === 401 && test.expectAuth) {
        console.log('⚠️  AUTH REQUIRED: Endpoint exists but needs authentication');
      } else if (response.status === 403) {
        console.log('⚠️  PERMISSION DENIED: Endpoint exists but needs admin role');
      } else if (response.status === 404) {
        console.log('❌ NOT FOUND: Endpoint does not exist');
      } else {
        console.log(`⚠️  STATUS ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ CONNECTION REFUSED: Backend server not running');
      } else if (error.code === 'ETIMEDOUT') {
        console.log('❌ TIMEOUT: Backend server not responding');
      } else {
        console.log(`❌ ERROR: ${error.message}`);
      }
    }
    
    console.log(''); // Add spacing
  }
  
  console.log('🏁 API Communication Test Complete');
}

testEndpoints().catch(console.error);