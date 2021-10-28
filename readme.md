Usage

Install dependencies
    `npm i`

Run the service in express
    `node index.mjs`

Query Params:
    auth0Env 'staging' or 'production'
    userCode auth0 user code to append

    dark hex code for "dark" parts of QR code
    light hex code for "light" parts of QR code

    deflateLevel (numeric)
    deflateStrategy (numeric)
    errorCorrectionLevel (numeric)
    margin tolerance area around code
    scale scaling factor (width overrides if provided)
    version QR code version (numeric)
    width pixel width of image

http://localhost:3000/?light=CCCCCC&dark=f00
