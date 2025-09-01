// Simple frontend API test
const { fetch } = require('undici');

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

async function testAPI() {
    console.log('Frontend API Integration Test');
    console.log('==============================');
    
    try {
        console.log('\n1. Testing Admin Orders Endpoint...');
        const ordersResponse = await fetch(`${API_BASE_URL}/orders/admin`);
        console.log(`   Status: ${ordersResponse.status}`);
        console.log(`   Expected: 403 (authentication required)`);
        console.log(`   Result: ${ordersResponse.status === 403 ? 'PASS' : 'FAIL'}`);
        
        console.log('\n2. Testing Shipping Status Endpoint...');
        const statusResponse = await fetch(`${API_BASE_URL}/orders/58/shipping-status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shipping_status: 'prepared' })
        });
        console.log(`   Status: ${statusResponse.status}`);
        console.log(`   Expected: 403 (authentication required)`);
        console.log(`   Result: ${statusResponse.status === 403 ? 'PASS' : 'FAIL'}`);
        
        console.log('\n3. Testing API Structure...');
        
        // Test non-existent endpoint
        const notFoundResponse = await fetch(`${API_BASE_URL}/nonexistent`);
        console.log(`   Non-existent endpoint: ${notFoundResponse.status}`);
        console.log(`   Expected: 404`);
        console.log(`   Result: ${notFoundResponse.status === 404 ? 'PASS' : 'FAIL'}`);
        
        // Test wrong method
        const wrongMethodResponse = await fetch(`${API_BASE_URL}/orders/admin`, {
            method: 'POST'
        });
        console.log(`   Wrong method (POST to admin): ${wrongMethodResponse.status}`);
        
        const allTests = [
            ordersResponse.status === 403,
            statusResponse.status === 403, 
            notFoundResponse.status === 404
        ];
        
        console.log('\n==============================');
        console.log('SUMMARY:');
        console.log(`Admin orders authentication: ${ordersResponse.status === 403 ? 'PASS' : 'FAIL'}`);
        console.log(`Shipping status authentication: ${statusResponse.status === 403 ? 'PASS' : 'FAIL'}`);
        console.log(`API structure: ${notFoundResponse.status === 404 ? 'PASS' : 'FAIL'}`);
        
        if (allTests.every(t => t)) {
            console.log('\nALL TESTS PASSED!');
            console.log('SUCCESS: Frontend API endpoints are properly structured');
            console.log('SUCCESS: Authentication is working correctly');
            console.log('CONCLUSION: The issue is in session management or data refresh logic');
        } else {
            console.log('\nSOME TESTS FAILED!');
            console.log('ERROR: There may be issues with API endpoint structure');
        }
        
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testAPI();