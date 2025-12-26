// Script để test webhook locally
const axios = require('axios');
require('dotenv').config();

const testWebhook = async () => {
    const secret = process.env.CARD_WEBHOOK_SECRET || 'ShopGameBaoMat2025BaoMat2025Nsryon';
    const baseUrl = 'http://localhost:5000/api/webhooks/card';

    console.log('🧪 Testing Gachthe1s Webhook...\n');

    // Test 1: GET request
    console.log('Test 1: GET request to webhook endpoint');
    try {
        const response = await axios.get(`${baseUrl}?secret=${secret}`);
        console.log('✅ Status:', response.status);
    } catch (err) {
        console.log('❌ Error:', err.message);
    }

    console.log('\n---\n');

    // Test 2: POST request với dữ liệu giả
    console.log('Test 2: POST request with mock data');
    try {
        const mockData = {
            status: '1',
            amount: '100000',
            value: '80000',
            request_id: 'CARD_TEST_123456',
            message: 'Thẻ hợp lệ'
        };

        const response = await axios.post(`${baseUrl}?secret=${secret}`, mockData);
        console.log('✅ Status:', response.status);
        console.log('✅ Response:', response.data);
    } catch (err) {
        console.log('❌ Error:', err.response?.data || err.message);
    }
};

testWebhook();
