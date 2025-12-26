// Script để test webhook locally
const axios = require('axios');

const testWebhook = async () => {
    console.log('🧪 Testing Gachthe1s Webhook...\n');

    // Test 1: GET request (kiểm tra endpoint có sống không)
    console.log('Test 1: GET request to webhook endpoint');
    try {
        const response = await axios.get('http://localhost:5000/api/webhooks/card?secret=ShopGameBaoMat2025BaoMat2025Nsryon');
        console.log('✅ Status:', response.status);
        console.log('✅ Response:', response.data);
    } catch (err) {
        console.log('❌ Error:', err.message);
    }

    console.log('\n---\n');

    // Test 2: POST request với dữ liệu giả (giống như Gachthe1s gửi)
    console.log('Test 2: POST request with mock data');
    try {
        const mockData = {
            status: '1', // 1 = thành công
            amount: '100000', // Mệnh giá thẻ
            value: '80000', // Giá trị thực nhận (sau chiết khấu)
            request_id: 'CARD_TEST_123456',
            sign: 'mock_signature',
            message: 'Thẻ hợp lệ'
        };

        const response = await axios.post(
            'http://localhost:5000/api/webhooks/card?secret=ShopGameBaoMat2025BaoMat2025Nsryon',
            mockData
        );
        console.log('✅ Status:', response.status);
        console.log('✅ Response:', response.data);
    } catch (err) {
        console.log('❌ Error:', err.response?.data || err.message);
    }

    console.log('\n---\n');

    // Test 3: POST request với secret sai (phải bị từ chối)
    console.log('Test 3: POST request with wrong secret (should fail)');
    try {
        const response = await axios.post(
            'http://localhost:5000/api/webhooks/card?secret=WRONG_SECRET',
            { test: 'data' }
        );
        console.log('❌ Should have failed but got:', response.status);
    } catch (err) {
        if (err.response?.status === 403) {
            console.log('✅ Correctly rejected with 403 Forbidden');
        } else {
            console.log('❌ Unexpected error:', err.message);
        }
    }
};

testWebhook();
