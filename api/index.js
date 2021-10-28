const app = require('express')();
const { v4 } = require('uuid');

app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

module.exports = app;


// const express = require('express');
// const {v4} = require('uuid');
// const qrcode = require('qrcode');

// const app = express();

// const AUTH0_DOMAIN = {
//     production: 'auth.streamotion.com.au',
//     staging: 'auth-staging.streamotion.com.au',
// };

// app.listen(3000, () => {
//     console.log("Server running on port 3000");
// });

// app.get("/", (req, res) => {
//     const {
//         auth0Env = 'production', // or staging
//         dark, // Dark RGBA hex color
//         deflateLevel, // Compression level for deflate, Default: 9
//         deflateStrategy, // Compression strategy for deflate, Default: 3
//         errorCorrectionLevel, // Error correction level "L", "M", "Q", "H"
//         light, // Light RGBA hex color
//         margin, // Quiet zone size
//         scale, // Scale factor
//         userCode,
//         version, // QR Code symbol version (1 - 40)
//         width, // Image width (px)
//     } = req.query;

//     const url = new URL(`https://${AUTH0_DOMAIN[auth0Env]}/activate`);

//     url.searchParams.set('user_code', userCode);

//     qrcode.toFileStream(
//         res,
//         url.toString(),
//         {
//             rendererOpts: {
//                 deflateLevel,
//                 deflateStrategy,
//             },
//             color: {
//                 dark,
//                 light,
//             },
//             scale,
//             margin,
//             width,
//         },
//         function onError(err) {
//             throw new Error()
//         }
//     );
// });

// module.exports = app;
