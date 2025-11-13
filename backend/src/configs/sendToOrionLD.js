import axios from 'axios';

export async function sendToOrionLD(entity) {
    try {
        await axios.post(
            'http://localhost:1026/ngsi-ld/v1/entities',
            entity,
            { headers: { 'Content-Type': 'application/ld+json' } }
        );
        console.log('Đã gửi dữ liệu lên Orion-LD');
    } catch (err) {
        if (err.response && err.response.status === 409) {
            // Entity đã tồn tại, có thể cập nhật bằng PATCH nếu muốn
            console.log('Entity đã tồn tại trên Orion-LD');
        } else if (err.response) {
            console.error('Lỗi gửi lên Orion-LD:', err.message);
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        } else {
            console.error('Lỗi gửi lên Orion-LD:', err.message);
        }
    }
}