const fs = require('fs');
const base64 = require('base64url');

async function main() {
    const jwtFile = './jwt.out'
    const jwt = fs.readFileSync(jwtFile, 'utf8');
    console.log('jwt = ', jwt);
    const jwtHeaer = jwt.split('.')[0];
    const jwtPayload = jwt.split('.')[1];
    const jwtSignature = jwt.split('.')[2];

    const jwtSignatureBase64 = base64.toBase64(jwtSignature);
    console.log('jwtHeader = ', jwtHeaer);
    console.log('jwtPayload = ', jwtPayload);
    console.log('jwtSignatureBase64 = ', jwtSignatureBase64);
}

main();