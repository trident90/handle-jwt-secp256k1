const { generateKeyPair } = require('crypto');
const jose = require('jose');
const wallet = require('ethereumjs-wallet').default;
const fs = require('fs');
const KeyEncoder = require('key-encoder').default;

const alg = 'ES256K'

const keystoreFile = '/Users/trident/Temp/keystore/account-1'
const passwd = 'demo'

const _getKeyPair = async () => {
  return new Promise((resolve, reject) => {
    generateKeyPair('ec', {
      namedCurve: 'secp256k1',
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    }, (err, publicKey, privateKey) => {
      if (err) return reject(err);
      resolve({publicKey, privateKey});
    });
  });
};

async function main() {
  const myWallet = await wallet.fromV3(fs.readFileSync(keystoreFile).toString(), passwd, true);
  const ethPrivKey = myWallet.getPrivateKeyString();
  console.log('PrivateKey: ', ethPrivKey.substring(2));
  console.log('Address: ', myWallet.getAddressString());
  var keyEncoder = new KeyEncoder('secp256k1');
  console.log('PrivateKey: ', keyEncoder.encodePrivate(ethPrivKey.substring(2), 'raw', 'pem'));

  /*
  const keyPair = await _getKeyPair();
  console.log('publicKey: ', keyPair.publicKey.toString());
  console.log('PrivateKey: ', keyPair.privateKey.toString());
  const key = `${keyPair.privateKey.toString()}`;
  //const privKey = await jose.importPKCS8(keyPair.privateKey.toString, alg);
  */
  const key = `${keyEncoder.encodePrivate(ethPrivKey.substring(2), 'raw', 'pem')}`;
  console.log('key: ', key);
  const privKey = await jose.importPKCS8(key, alg);
  const jwt = await new jose.SignJWT( {'urn:example:clami': true })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .sign(privKey);
  console.log(jwt);

  const pubKey = await jose.importSPKI(`${keyPair.publicKey.toString()}`, alg);
//  const { payload, protectedHeader } = await jose.jwtVerify(jwt, pubKey, {
//    issuer: 'urn:example:issuer',
//    audience: 'urn:example:audience',
//  });
  const { payload, protectedHeader } = await jose.jwtVerify(jwt, pubKey);
  console.log(protectedHeader);
  console.log(payload);
}

main();
