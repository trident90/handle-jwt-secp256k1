const { generateKeyPair } = require("crypto");
const jose = require("jose");

const alg = "ES256K"

const _getKeyPair = async () => {
  return new Promise((resolve, reject) => {
    generateKeyPair("ec", {
      namedCurve: "secp256k1",
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" }
    }, (err, publicKey, privateKey) => {
      if (err) return reject(err);
      resolve({publicKey, privateKey});
    });
  });
};

async function main() {
  const keyPair = await _getKeyPair();
  console.log("publicKey: ", keyPair.publicKey.toString());
  console.log("PrivateKey: ", keyPair.privateKey.toString());
  const key = `${keyPair.privateKey.toString()}`;
  //const privKey = await jose.importPKCS8(keyPair.privateKey.toString, alg);
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
//console.log("PrivateKey is : ", privateKey.toString());
/*
console.log(privKey.toString());
        } else {
            console.log("Error is: ", err);
        }});

/*
const jwt = require("jsonwebtoken");


const secret = secp256k1.generateKeys();

const token = jwt.sign({ data: "jwt payload" }, secret, { algorithm: "ES256" });

const decoded = jwt.verify(token, secret, { algorithms: ["ES256"] }, (err, decoded) => {
  if (err) {
    console.error("JWT verification failed", err);
  } else {
    console.log("JWT verification succeeded", decoded);
  }
});
*/
