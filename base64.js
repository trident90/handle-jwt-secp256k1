//const b64 = 'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAElDamqnbyRPJv/aDYPuZ4+OE/H2IWxorSgoX+v+b5+vLFhKdnReGe3OMsQMfWiMK4pVC4nyH1718ZMc+TPzmXdQ==';
//const b64 = 'MFUwEAYHKoZIzj0CAQYFK4EEAAoDQQCUNqaqdvJE8m/9oNg+5nj44T8fYhbGitKChf6/5vn68sWEp2dF4Z7c4yxAx9aIwrilULifIfXvXxkxz5M/OZd1';
const b64_1 = 'eyJhbGciOiJFUzI1NksifQ';
const b64_2 = 'eyJ1cm46ZXhhbXBsZTpjbGFtaSI6dHJ1ZSwiaWF0IjoxNjc2MTg4MTExLCJpc3MiOiJ1cm46ZXhhbXBsZTppc3N1ZXIiLCJhdWQiOiJ1cm46ZXhhbXBsZTphdWRpZW5jZSJ9';
const b64_3 = 'AKlnFlEjiTCGa_-JJUVtx5Zh8NebwPJqSAQ30BcmQykVEm0GeJdV76LSpgS6KZXGjD4KY4oSXmsABIG5yQFlPw';

var b64out = Buffer.from(b64_1, "base64");
console.log('> ', b64out.toString('hex'));
b64out = Buffer.from(b64_2, "base64");
console.log('> ', b64out.toString('hex'));
b64out = Buffer.from(b64_3, "base64");
console.log('> ', b64out.toString('hex'));