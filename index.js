const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// API proxy
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:8080',
    changeOrigin: true,
}));

// Static files
app.use(express.static(path.join(__dirname, 'src', 'frontend', 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
