/**
 * Test script to verify frontend API integration
 * Run this with: node test_api_integration.js
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Mock axios-like function using fetch
async function apiCall(method, url, data = null) {
    const options = {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        console.log(`API ${method.toUpperCase()} ${url}`);
        if (data) console.log(`Data:`, data);
        
        const response = await fetch(url, options);
        const responseData = await response.text();
        
        console.log(`Status: ${response.status}`);
        console.log(`Response: ${responseData.substring(0, 200)}${responseData.length > 200 ? '...' : ''}`);
        
        return {
            status: response.status,
            data: responseData,
            json: async () => JSON.parse(responseData)
        };
    } catch (error) {
        console.error(`ERROR:`, error.message);
        return null;
    }
}

async function testAdminOrdersEndpoint() {
    console.log('\nTesting Admin Orders Endpoint');
    console.log('=' * 50);
    
    // Test GET /orders/admin (should require auth)
    const response = await apiCall('GET', `${API_BASE_URL}/orders/admin`);
    
    if (response && response.status === 403) {
        console.log('✅ Admin orders endpoint correctly requires authentication');
        return true;
    } else {
        console.log('❌ Admin orders endpoint authentication not working as expected');
        return false;
    }
}

async function testShippingStatusEndpoint() {
    console.log('\n🧪 Testing Shipping Status Endpoint');
    console.log('=' * 50);
    
    const orderId = 58; // Using the order we created in backend test
    const testData = { shipping_status: 'prepared' };
    
    // Test PUT /orders/{id}/shipping-status (should require auth)
    const response = await apiCall('PUT', `${API_BASE_URL}/orders/${orderId}/shipping-status`, testData);
    
    if (response && response.status === 403) {
        console.log('✅ Shipping status endpoint correctly requires authentication');
        return true;
    } else {
        console.log('❌ Shipping status endpoint authentication not working as expected');
        return false;
    }
}

async function testApiStructure() {
    console.log('\n🧪 Testing API Structure');
    console.log('=' * 50);
    
    // Test various endpoints to verify they exist
    const endpoints = [
        { method: 'GET', path: '/orders/admin', expectedStatus: 403 },
        { method: 'PUT', path: '/orders/1/shipping-status', expectedStatus: 403 },
        { method: 'GET', path: '/nonexistent', expectedStatus: 404 },
    ];
    
    let allCorrect = true;
    
    for (const endpoint of endpoints) {
        const response = await apiCall(endpoint.method, `${API_BASE_URL}${endpoint.path}`, 
            endpoint.method === 'PUT' ? { shipping_status: 'test' } : null);
        
        if (response && response.status === endpoint.expectedStatus) {
            console.log(`✅ ${endpoint.method} ${endpoint.path} - Status ${endpoint.expectedStatus} as expected`);
        } else {
            console.log(`❌ ${endpoint.method} ${endpoint.path} - Expected ${endpoint.expectedStatus}, got ${response?.status || 'error'}`);
            allCorrect = false;
        }
    }
    
    return allCorrect;
}

// Test the specific API integration used by the frontend
async function testFrontendApiIntegration() {
    console.log('\n🧪 Testing Frontend API Integration (AdminOrdersView pattern)');
    console.log('=' * 50);
    
    // Simulate the exact API calls made by AdminOrdersView.vue
    console.log('\n1. Testing loadOrders() equivalent...');
    const loadOrdersResponse = await apiCall('GET', `${API_BASE_URL}/orders/admin`);
    
    console.log('\n2. Testing updateOrderShippingStatus() equivalent...');
    const orderId = 58;
    const updateResponse = await apiCall('PUT', `${API_BASE_URL}/orders/${orderId}/shipping-status`, {
        shipping_status: 'prepared'
    });
    
    // Both should return 403 (authentication required) if endpoints exist
    const loadOrdersCorrect = loadOrdersResponse && loadOrdersResponse.status === 403;
    const updateCorrect = updateResponse && updateResponse.status === 403;
    
    console.log('\n📊 Frontend API Integration Results:');
    console.log(`   loadOrders equivalent: ${loadOrdersCorrect ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   updateOrderShippingStatus equivalent: ${updateCorrect ? '✅ PASS' : '❌ FAIL'}`);
    
    return loadOrdersCorrect && updateCorrect;
}

async function runTests() {
    console.log('🚀 Frontend API Integration Test Suite');
    console.log('=' * 60);
    
    try {
        // Test individual components
        const adminOrdersTest = await testAdminOrdersEndpoint();
        const shippingStatusTest = await testShippingStatusEndpoint(); 
        const apiStructureTest = await testApiStructure();
        const frontendIntegrationTest = await testFrontendApiIntegration();
        
        console.log('\n' + '=' * 60);
        console.log('📊 FINAL TEST SUMMARY:');
        console.log('=' * 60);
        console.log(`🔐 Admin orders authentication:     ${adminOrdersTest ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`📦 Shipping status authentication:  ${shippingStatusTest ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`🏗️  API structure:                   ${apiStructureTest ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`🎯 Frontend integration:            ${frontendIntegrationTest ? '✅ PASS' : '❌ FAIL'}`);
        
        const allTestsPassed = adminOrdersTest && shippingStatusTest && apiStructureTest && frontendIntegrationTest;
        
        console.log('\n' + '=' * 60);
        if (allTestsPassed) {
            console.log('🎉 ALL TESTS PASSED!');
            console.log('✅ Frontend API endpoints are correctly structured');
            console.log('✅ Authentication is properly enforced');
            console.log('✅ The issue is likely in session management or data refresh');
        } else {
            console.log('❌ SOME TESTS FAILED!');
            console.log('❌ There may be structural issues with the API endpoints');
        }
        
    } catch (error) {
        console.error('💥 Test suite failed with error:', error);
    }
}

// Check if we're in Node.js environment  
if (typeof module !== 'undefined' && module.exports) {
    // Running in Node.js
    const { fetch } = require('undici');
    global.fetch = fetch;
    runTests();
} else if (typeof window !== 'undefined') {
    // Running in browser
    console.log('🌐 Running in browser environment');
    runTests();
} else {
    console.error('❌ Unknown environment');
}