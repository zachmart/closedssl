"use strict";
import {IKey} from "../interfaces/IKey";
import {IKeyEncryption} from "../interfaces/IKeyEncryption";
import {KeyEncryption} from "./KeyEncryption";
import {checkRadix} from "../utilities/utilities";
const forge = require("node-forge");

/**
 * Created by zacharymartin on July 19, 2016.
 */

function isValidPrivateKeyPEM(privateKeyPEM: string): boolean {
  const msg: any = forge.pem.decode(privateKeyPEM)[0];

  return (msg.type === 'ENCRYPTED PRIVATE KEY' ||
  msg.type === 'PRIVATE KEY' ||
  msg.type === 'RSA PRIVATE KEY')
}


function isEncrypted(privateKeyPEM: string): boolean {
  const msg: any = forge.pem.decode(privateKeyPEM)[0];

  return (msg.procType && msg.procType.type === 'ENCRYPTED') ||
    (msg.type === 'ENCRYPTED PRIVATE KEY');
}

function isLegacyEncrypted(privateKeyPEM: string): boolean {
  if (isEncrypted(privateKeyPEM)){
    const msg: any = forge.pem.decode(privateKeyPEM)[0];

    return (msg.procType !== null && msg.procType.type === 'ENCRYPTED');
  } else {
    return false;
  }
}

function getEncryptionAlgorithm(privateKeyPEM: string):
"aes128" | "aes192" | "aes256" | "3des" | "des" | "not-supported" | null {
  if (isValidPrivateKeyPEM(privateKeyPEM) && isEncrypted(privateKeyPEM)){
    const msg: any = forge.pem.decode(privateKeyPEM)[0];

    if (isLegacyEncrypted(privateKeyPEM)){

      const algorithmDecode = {
        "DES-CBC": "des",
        "DES-EDE3-CBC": "3des",
        "AES-128-CBC": "aes128",
        "AES-192-CBC": "aes192",
        "AES-256-CBC": "aes256"
      };

      return algorithmDecode[msg.dekInfo.algorithm] ?
        algorithmDecode[msg.dekInfo.algorithm]
        :
        "not-supported";
    } else {
      const encryptedPrivateKeyValidator = {
        name: 'EncryptedPrivateKeyInfo',
        tagClass: forge.asn1.Class.UNIVERSAL,
        type: forge.asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: 'EncryptedPrivateKeyInfo.encryptionAlgorithm',
          tagClass: forge.asn1.Class.UNIVERSAL,
          type: forge.asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: 'AlgorithmIdentifier.algorithm',
            tagClass: forge.asn1.Class.UNIVERSAL,
            type: forge.asn1.Type.OID,
            constructed: false,
            capture: 'encryptionOid'
          }, {
            name: 'AlgorithmIdentifier.parameters',
            tagClass: forge.asn1.Class.UNIVERSAL,
            type: forge.asn1.Type.SEQUENCE,
            constructed: true,
            captureAsn1: 'encryptionParams'
          }]
        }, {
          // encryptedData
          name: 'EncryptedPrivateKeyInfo.encryptedData',
          tagClass: forge.asn1.Class.UNIVERSAL,
          type: forge.asn1.Type.OCTETSTRING,
          constructed: false,
          capture: 'encryptedData'
        }]
      };

      const PBES2AlgorithmsValidator = {
        name: 'PBES2Algorithms',
        tagClass: forge.asn1.Class.UNIVERSAL,
        type: forge.asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: 'PBES2Algorithms.keyDerivationFunc',
          tagClass: forge.asn1.Class.UNIVERSAL,
          type: forge.asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: 'PBES2Algorithms.keyDerivationFunc.oid',
            tagClass: forge.asn1.Class.UNIVERSAL,
            type: forge.asn1.Type.OID,
            constructed: false,
            capture: 'kdfOid'
          }, {
            name: 'PBES2Algorithms.params',
            tagClass: forge.asn1.Class.UNIVERSAL,
            type: forge.asn1.Type.SEQUENCE,
            constructed: true,
            value: [{
              name: 'PBES2Algorithms.params.salt',
              tagClass: forge.asn1.Class.UNIVERSAL,
              type: forge.asn1.Type.OCTETSTRING,
              constructed: false,
              capture: 'kdfSalt'
            }, {
              name: 'PBES2Algorithms.params.iterationCount',
              tagClass: forge.asn1.Class.UNIVERSAL,
              type: forge.asn1.Type.INTEGER,
              onstructed: true,
              capture: 'kdfIterationCount'
            }]
          }]
        }, {
          name: 'PBES2Algorithms.encryptionScheme',
          tagClass: forge.asn1.Class.UNIVERSAL,
          type: forge.asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: 'PBES2Algorithms.encryptionScheme.oid',
            tagClass: forge.asn1.Class.UNIVERSAL,
            type: forge.asn1.Type.OID,
            constructed: false,
            capture: 'encOid'
          }, {
            name: 'PBES2Algorithms.encryptionScheme.iv',
            tagClass: forge.asn1.Class.UNIVERSAL,
            type: forge.asn1.Type.OCTETSTRING,
            constructed: false,
            capture: 'encIv'
          }]
        }]
      };

      const capture: any = {};

      if (!forge.asn1.validate(forge.asn1.fromDer(msg.body),
                               encryptedPrivateKeyValidator,
                               capture,
                               [])){
        return "not-supported";
      }
      const oid = forge.asn1.derToOid(capture.encryptionOid);
      const params = capture.encryptionParams;

      if (oid === forge.pki.oids["pkcs5PBES2"]) {
        const algorithmDecode = {
          "desCBC": "des",
          "des-EDE3-CBC": "3des",
          "aes128-CBC": "aes128",
          "aes192-CBC": "aes192",
          "aes256-CBC": "aes256"
        };

        const captureA: any = {};
        forge.asn1.validate(params, PBES2AlgorithmsValidator, captureA, []);
        const checkOid = forge.asn1.derToOid(captureA.kdfOid);
        const compareOid = forge.asn1.derToOid(captureA.encOid);

        if (checkOid !== forge.pki.oids['pkcs5PBKDF2']) {
          return "not-supported";
        }

        return algorithmDecode[forge.pki.oids[compareOid]] ?
          algorithmDecode[forge.pki.oids[compareOid]]
          :
          "not-supported";

      } else if (oid === forge.pki.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]) {
        return "3des";
      } else {
        console.log("not-supported");
      }

      return "3des";
    }
  } else {
    return null;
  }
}


export class Key implements IKey {
  private _privatePEM: string;
  private _publicPEM: string;
  private _numBits: number;
  private _encryption: IKeyEncryption | null;

  constructor(privatePEM: string, password?: string);
  constructor(object: IKey);

  constructor(arg: string | IKey, password?: string){
    if (typeof arg === "string") {
      let privateKey: any;
      let publicKey: any;

      if (isValidPrivateKeyPEM(arg)){
        if (isEncrypted(arg)) {
          if (!password) {
            throw new Error(`No password provided for encrypted private key`);
          } else {
            let algorithm = getEncryptionAlgorithm(arg);

            if (algorithm === "not-supported" || algorithm === null) {
              throw new Error("Unsupported password based encryption algorithm");
            } else {
              privateKey = forge.pki.decryptRsaPrivateKey(arg, password);
              this._encryption = new KeyEncryption({
                password: password,
                algorithm: <"aes128" | "aes192" | "aes256" | "3des" | "des">algorithm,
                legacy: isLegacyEncrypted(arg)
              }) ;
            }
          }
        } else {
          if (password) {
            throw new Error("Password provided for an un-encrypted private key");
          }
          privateKey = forge.pki.privateKeyFromPem(arg);
          this._encryption = null;
        }
      } else {
        throw new Error(`Invalid private key PEM file:\n${arg}`);
      }

      publicKey = forge.pki.setRsaPublicKey(privateKey.n, privateKey.e);

      this._privatePEM = arg;
      this._publicPEM = forge.pki.publicKeyToPem(publicKey);
      this._numBits = privateKey.n.bitLength();

    } else {
      this._privatePEM = arg.privatePEM;
      this._publicPEM = arg.publicPEM;
      this._numBits = arg.numBits;
      this._encryption = arg.encryption ? new KeyEncryption(arg.encryption) : null;
    }
  }

  get privatePEM(): string {
    return this._privatePEM;
  }

  get publicPEM(): string {
    return this._publicPEM;
  }

  get numBits(): number {
    return this._numBits;
  }

  get encryption(): IKeyEncryption | null {
    return this._encryption;
  }

  get isEncrypted(): boolean {
    return this._encryption !== null;
  }

  modulus(radix: number): string {
    checkRadix(radix);
    let forgePrivateKey = forge.pki.privateKeyFromPem(this._privatePEM);
    return forgePrivateKey.n.toString(radix);
  }

  publicExponent(radix: number): string {
    checkRadix(radix);
    let forgePrivateKey = forge.pki.privateKeyFromPem(this._privatePEM);
    return forgePrivateKey.e.toString(radix);
  }

  privateExponent(radix: number): string {
    checkRadix(radix);
    let forgePrivateKey = forge.pki.privateKeyFromPem(this._privatePEM);
    return forgePrivateKey.d.toString(radix);
  }

  prime1(radix: number): string {
    checkRadix(radix);
    let forgePrivateKey = forge.pki.privateKeyFromPem(this._privatePEM);
    return forgePrivateKey.p.toString(radix);
  }

  prime2(radix: number): string {
    checkRadix(radix);
    let forgePrivateKey = forge.pki.privateKeyFromPem(this._privatePEM);
    return forgePrivateKey.q.toString(radix);
  }

  exponent1(radix: number): string {
    checkRadix(radix);
    let forgePrivateKey = forge.pki.privateKeyFromPem(this._privatePEM);
    return forgePrivateKey.dP.toString(radix);
  }

  exponent2(radix: number): string {
    checkRadix(radix);
    let forgePrivateKey = forge.pki.privateKeyFromPem(this._privatePEM);
    return forgePrivateKey.dQ.toString(radix);
  }

  coefficient(radix: number): string {
    checkRadix(radix);
    let forgePrivateKey = forge.pki.privateKeyFromPem(this._privatePEM);
    return forgePrivateKey.qInv.toString(radix);
  }

  passwordEncrypt(encryption: IKeyEncryption): IKey {
    let unEncryptedForgeKey: any;
    let encryptedPEM: string;

    if (this._encryption) {
      unEncryptedForgeKey = forge.pki.decryptRsaPrivateKey(this._privatePEM,
                                                           this._encryption.password);
    } else {
      unEncryptedForgeKey = forge.pki.privateKeyFromPem(this._privatePEM);
    }

    encryptedPEM = forge.pki.encryptRsaPrivateKey(unEncryptedForgeKey,
                                                  encryption.password,
                                                  {
                                                    algorithm: encryption.algorithm,
                                                    count: 2048,
                                                    saltSize: 8,
                                                    legacy: encryption.legacy
                                                  });

    return new Key(encryptedPEM, encryption.password);
  }

  passwordDecrypt(): IKey {
    let unEncryptedForgeKey: any;

    if (this._encryption) {
      unEncryptedForgeKey = forge.pki.decryptRsaPrivateKey(this._privatePEM,
                                                      this._encryption.password);
    } else {
      unEncryptedForgeKey = this._privatePEM;
    }

    return new Key(forge.pki.privateKeyToPem(unEncryptedForgeKey));
  }
}

