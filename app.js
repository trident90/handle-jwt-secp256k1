const { generateKeyPair, createECDH } = require('crypto');
const ecKeyUtils = require('eckey-utils');
const jose = require('jose');
const wallet = require('ethereumjs-wallet').default;
const fs = require('fs');

const alg = 'ES256K'
const curveName = 'secp256k1'

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
  const ethPubKey = myWallet.getPublicKeyString();
  console.log('PrivateKey: ', ethPrivKey.substring(2));
  console.log('Address: ', myWallet.getAddressString());
  const ePrivKey = Buffer.from(ethPrivKey.substring(2), 'hex');
  const ePubKey = Buffer.from(ethPubKey.substring(2), 'hex');
  const pems = ecKeyUtils.generatePem({
    curveName,
    privateKey: ePrivKey,
    publicKey: ePubKey,
  });
  console.log('pems: ', pems);

  /*
  const aaa = createECDH('secp256k1');
  aaa.setPrivateKey(ePrivKey);
  let keyPair = await crypto.subtle.importKey(
    'raw',
    ePrivKey,
    { name: 'ECDSA' },
    true,
    ['sign', 'verify']
  );
  //console.log('PEM:', await aaa.
  console.log('getPrivKey: ', aaa.getPrivateKey().toString('hex'));
  console.log('getPubKey: ', aaa.getPublicKey().toString('hex'));
  */
  /*
  const keyPair = await _getKeyPair();
  console.log('publicKey: ', keyPair.publicKey.toString());
  console.log('PrivateKey: ', keyPair.privateKey.toString());
  const key = `${keyPair.privateKey.toString()}`;
  //const privKey = await jose.importPKCS8(keyPair.privateKey.toString, alg);
  */
  //console.log('key: ', ecKeyUtils.parsePem(pems).privateKey);
  //const privKey = await jose.importPKCS8(`${pems.privateKey}`, alg);
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
