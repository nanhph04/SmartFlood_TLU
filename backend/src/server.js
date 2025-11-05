const express = require('express');
const app = express();
const port = 3000;

// Route cơ bản
app.get('/', (req, res) => {
    res.send('Hello Backend with Express!');
});

// Khởi động Server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});