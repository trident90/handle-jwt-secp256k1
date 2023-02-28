const { generateKeyPair, createECDH } = require('crypto');
const ecKeyUtils = require('eckey-utils');
const jose = require('jose');
const wallet = require('@trident90/ethereumjs-wallet').default;
const fs = require('fs');
const Web3 = require('web3');
var KeyEncoder = require('@tradle/key-encoder').default, keyEncoder = new KeyEncoder('secp256k1');


const alg = 'ES256K'
const curveName = 'secp256k1'

//const keystoreFile = '/Users/trident/Temp/keystore/account-1'
const keystoreFile = '/Users/trident/Temp/keystore/account-jwt'
const passwd = 'demo'

const _getKeyPair = async () => {
  return new Promise((resolve, reject) => {
    generateKeyPair('ec', {
      namedCurve: 'secp256k1',
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      //privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    }, (err, publicKey, privateKey) => {
      if (err) return reject(err);
      resolve({publicKey, privateKey});
    });
  });
};

async function main() {
  let privKeyPEM = null;
  let pubKeyPEM = null;

  if (fs.existsSync(keystoreFile)) {
    const myWallet = await wallet.fromV3(fs.readFileSync(keystoreFile).toString(), passwd, true);
    const ethPrivKey = myWallet.getPrivateKeyString();
    const ethPubKey = myWallet.getPublicKeyString();
    console.log('PrivateKey: ', ethPrivKey.substring(2));
    console.log('PublicKey: ', ethPubKey.substring(2));
    console.log('Address: ', myWallet.getAddressString());
    const ePrivKey = Buffer.from(ethPrivKey.substring(2), 'hex');
    const ePubKey = Buffer.from(ethPubKey.substring(2), 'hex');
    //let key = await keyEncoder.encodePrivate(keyPair.privateKey.export({type: 'sec1', format: 'pem'}), 'pem', 'raw');
    privKeyPEM = await keyEncoder.encodePrivate(ethPrivKey.substring(2), 'raw', 'pem', 'pkcs8');
    pubKeyPEM = await keyEncoder.encodePublic(ethPubKey.substring(2), 'raw', 'pem');
    console.log(privKeyPEM);
    console.log(pubKeyPEM);
  } else  {
    const keyPair = await _getKeyPair();
    console.log('publicKey: ', keyPair.publicKey.toString());
    console.log('PrivateKey: ', keyPair.privateKey.export({type:'pkcs8', format:'pem'}));

    let key = await keyEncoder.encodePrivate(keyPair.privateKey.export({type: 'sec1', format: 'pem'}), 'pem', 'raw');
    console.log('typeof: ', typeof key, ', key: ', key);
    const ePrivKey = Buffer.from(key, 'hex');
    const myWallet = await wallet.fromPrivateKey(ePrivKey);
    const keystore = await myWallet.toV3String('demo');
    console.log('keystore: ', keystore);
    fs.writeFileSync(keystoreFile, keystore);
    privKeyPEM = keyPair.privateKey.export({type: 'pkcs8', format: 'pem'});
    console.log(keyPair.privateKey.type)
    pubKeyPEM = keyPair.publicKey.toString();
  }
  const privKey = await jose.importPKCS8(privKeyPEM, alg);

  const jwt = await new jose.SignJWT( {'urn:example:claim': true })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .sign(privKey);
  console.log('jwt: ', jwt);

  const jwtFile = './jwt.out'
  fs.writeFileSync(jwtFile, jwt)

  const pubKey = await jose.importSPKI(pubKeyPEM, alg);
  const { payload, protectedHeader } = await jose.jwtVerify(jwt, pubKey);
  console.log(protectedHeader);
  console.log(payload);
}

main();
