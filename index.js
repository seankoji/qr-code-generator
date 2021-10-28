const express = require('express');
const app = express();
const product = require('./api/qr-code');

app.use(express.json());

app.use('/api/qr-code', product);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
