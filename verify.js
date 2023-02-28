const base64url = require('base64url');
const crypto = require('crypto');
const elliptic = require('elliptic');
const fs = require('fs');
var util = require('util');
let encoder = new util.TextEncoder();
const wallet = require('@trident90/ethereumjs-wallet').default;
let = ec = new elliptic.ec('secp256k1');

const keystoreFile = '/Users/trident/Temp/keystore/account-jwt'
const passwd = 'demo'

function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null,
      str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
}

async function main() {
    const jwtFile = './jwt.out'
    const jwt = fs.readFileSync(jwtFile, 'utf8');
    console.log('jwt = ', jwt);
    const jwtHeader = jwt.split('.')[0];
    const jwtPayload = jwt.split('.')[1];
    const jwtSignature = jwt.split('.')[2];  // base64url

    console.log('jwtHeader = ', jwtHeader);
    console.log('jwtHeader = ', base64url.decode(jwtHeader));
    console.log('jwtPayload = ', jwtPayload);
    console.log('jwtPayload = ', base64url.decode(jwtPayload));
    console.log('jwtSignature = ', jwtSignature);
    console.log('jwtSignature = ', Buffer.from(jwtSignature, 'base64'));


    if (fs.existsSync(keystoreFile)) {
        const myWallet = await wallet.fromV3(fs.readFileSync(keystoreFile).toString(), passwd, true);
        const ethPrivKey = myWallet.getPrivateKeyString();
        const ethPubKey = myWallet.getPublicKeyString();
        console.log('PrivateKey: ', ethPrivKey.substring(2));
        console.log('PublicKey: ', ethPubKey.substring(2));
        console.log('Address: ', myWallet.getAddressString());
        let keyPair = ec.keyFromPrivate(ethPrivKey.substring(2));
        let privKey = keyPair.getPrivate('hex');
        let pubKey = keyPair.getPublic();
        console.log(`Private key: ${privKey}`);
        console.log("Public key :", pubKey.encode("hex").substr(2));
        console.log("Public key (compressed):", pubKey.encodeCompressed("hex"));

        let msgToSign = jwtHeader + '.' + jwtPayload;
        //let msgToSign = encoder.encode(jwtHeader) + encoder.encode('.') + encoder.encode(jwtPayload);
        //let signature = ec.sign(msgToSign, privKey, 'hex', {canonical: true}).toDER();
        //let signature = ec.sign(msgToSign, privKey, 'hex', {canonical: true});
        const msgToSignHashed = crypto.createHash('sha256').update(msgToSign).digest();
        let signature = keyPair.sign(msgToSignHashed);
        console.log(`MsgtoSign: ${msgToSign}`);
        console.log(`MsgtoSignHashed: ${msgToSignHashed}`);
        console.log('Signature:', signature);
        let r = signature.r.toBuffer('be');
        let s = signature.s.toBuffer('be');
        let arr = [r, s];
        var buf = Buffer.concat(arr);
        console.log('Signature:', buf.toString('hex'));
        console.log('Signature:', buf);
        console.log('Signature:', r.toString('hex'), ',', s.toString('hex'));

        console.log();

        let validSig = ec.verify(msgToSignHashed, signature, pubKey);
        console.log("Signature valid?", validSig);
    }
}

main();