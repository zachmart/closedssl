"use strict";
import {Igenerate} from "../interfaces/Igenerate";
import {IKeyEncryption, isIKeyEncryption} from "../interfaces/IKeyEncryption";
import {IKey, isIKey} from "../interfaces/IKey";
import {Key} from "./Key";
import {KeyEncryption} from "./KeyEncryption";
import {IDistinguishedName, isIDistinguishedName} from "../interfaces/IDistinguishedName";
import {IV3Extension, isIV3Extension} from "../interfaces/V3Extensions/IV3Extension";
import {ICSR, isICSR} from "../interfaces/ICSR";
import {DistinguishedName} from "./DistinguishedName";
import {CSR} from "./CSR";
import {BasicConstraints} from "./V3Extensions/BasicConstraints";
import {ICert, isICert} from "../interfaces/ICert";
import {ICertOptions, isICertOptions} from "../interfaces/ICertOptions";
import {Cert} from "./Cert";
import {isPosiviteInteger} from "../utilities/utilities";
import {CertOptions} from "./CertOptions";
import {ICAStore} from "../interfaces/ICAStore";
import {CAStore} from "./CAStore";
var forge = require("node-forge");

/**
 * Created by zacharymartin on July 28, 2016.
 */

export const generate: Igenerate = {
  privateKey: privateKey,
  privateKeySync: privateKeySync,
  csr: csr,
  csrSync: csrSync,
  cert: cert,
  certSync: certSync,
  caStore: function(caCerts?: Array<ICert | string>): ICAStore {
    return new CAStore(caCerts);
  }
};

function privateKey(numBits: number = 2048,
                    encryption?: IKeyEncryption | null,
                    publicExponent: number = 65537):
Promise<IKey> {

  if (!isPosiviteInteger(numBits)) {
    return Promise.reject(new Error(`private key generation requires a positive ${""
      }number numBits argument, given: ${numBits}`));
  }

  if (encryption && !isIKeyEncryption(encryption)){
    return Promise.reject(new Error(`private key generation requires that the ${""
      }encryption argument conform to the IKeyEncryption interface, given:
      ${encryption}`));
  }

  if (!isPosiviteInteger(publicExponent)){
    return Promise.reject(Error(`private key generation requires that the ${""
      }public exponent argument be a positive integer, given: ${publicExponent}`));
  }

  return new Promise<IKey>((resolve, reject) => {
    forge.pki.rsa.generateKeyPair({bits: numBits,
                                   workers: -1,
                                   e: publicExponent
                                  },
        (error, keypair) => {
      if (error) {
        reject(error);
      } else {
        let result: IKey;
        let unEncryptedPrivateKeyPEM
          = forge.pki.privateKeyToPem(keypair.privateKey);
        let unEncryptedKey = new Key(unEncryptedPrivateKeyPEM);
        if (encryption){
          result = unEncryptedKey.passwordEncrypt(encryption);
        } else {
          result = unEncryptedKey;
        }
        resolve(result);
      }
    });
  });
}

function privateKeySync(numBits: number = 2048,
                        encryption?: IKeyEncryption | null,
                        publicExponent: number = 65537): IKey {
  if (!isPosiviteInteger(numBits)) {
    new Error(`private key generation requires a positive ${""
      }number numBits argument, given: ${numBits}`);
  }

  if (encryption && !isIKeyEncryption(encryption)){
    new Error(`private key generation requires that the ${""
      }encryption argument conform to the IKeyEncryption interface, given:
      ${encryption}`);
  }

  if (!isPosiviteInteger(publicExponent)){
    new Error(`private key generation requires that the ${""
    }public exponent argument be a positive integer, given: ${publicExponent}`);
  }

  let result: IKey;
  let keypair = forge.pki.rsa.generateKeyPair({bits: numBits, e: publicExponent});
  let unEncryptedPrivateKeyPEM = forge.pki.privateKeyToPem(keypair.privateKey);
  let unEncryptedKey = new Key(unEncryptedPrivateKeyPEM);
  if (encryption){
    result = unEncryptedKey.passwordEncrypt(encryption);
  } else {
    result = unEncryptedKey;
  }
  return result;
}

function csr(subject?: IDistinguishedName,
             v3Extensions?: IV3Extension[] | null,
             key?: IKey | {numBits: number, encryption?: IKeyEncryption} | null,
             hash: "sha1" | "sha256" | "md5" = "sha256",
             challengePassword?: string,
             unstructuredName?: string):
Promise<{csr: ICSR, key: IKey}> {

  if (!subject) {
    subject = new DistinguishedName();
  } else if (!isIDistinguishedName(subject)) {
    console.error("v3Exts async ==> ", v3Extensions);
    return Promise.reject(new Error(`The generate csr function can only receive${""
      } objects that conform to the IDistinguishedName interface for the subject${""
      } argument, given: ${subject}`));
  }

  let v3ExtensionsCheck = _checkV3Extensions(v3Extensions);

  if (v3ExtensionsCheck === null) {
    return Promise.reject(new Error(`The generate csr function can only receive ${""
      } arrays of objects that conform to the IV3Extension interface for the${""
      } v3Extensions argument, given: ${v3Extensions}`));
  } else {
    v3Extensions = v3ExtensionsCheck;
  }

  let keyPromise: Promise<IKey>;

  if (!key) {
    keyPromise =  privateKey();
  } else if (isIKey(key)) {
    keyPromise = Promise.resolve(key);
  } else if (typeof key === "object" && isPosiviteInteger(key.numBits)) {
    if (!key.encryption || isIKeyEncryption(key.encryption)) {
      keyPromise = privateKey(key.numBits, key.encryption);
    } else {
      return Promise.reject(new Error(`The generate csr function can only receive${""
        } objects that conform to the IKey interface or objects that contain a positive${
        ""} integer "numBits" property and an IKeyEncryption "encryption" property,${""
        } given: ${key}`));
    }
  } else {
    return Promise.reject(new Error(`The generate csr function can only receive${""
      } objects that conform to the IKey interface or objects that contain a positive${
      ""} integer "numBits" property and an IKeyEncryption "encryption" property,${""
      } given: ${key}`));
  }

  if (hash !== "sha1" && hash !== "sha256" && hash !== "md5"){
    return Promise.reject(new Error(`The generate csr function can only receive${""
    } the strings "sha1", "sha256", or "md5" for the hash${""
    } argument, given: ${hash}`));
  }

  if (challengePassword && typeof challengePassword !== "string"){
    return Promise.reject(new Error(`The generate csr function can only receive${""
    } a challenge password parameter in string form, given: ${challengePassword}`));
  }

  if (unstructuredName && typeof unstructuredName !== "string"){
    return Promise.reject(new Error(`The generate csr function can only receive${""
      } an unstructured name parameter in string form, given: ${unstructuredName}`));
  }

  return new Promise<{csr: ICSR, key: IKey}>((resolve, reject) => {
    keyPromise.then((keyFromPromise: IKey) => {
      let forgePrivateKey: any;
      let forgePublicKey: any;

      if (keyFromPromise.isEncrypted) {
        let decryptedKey = (new Key(keyFromPromise)).passwordDecrypt();

        forgePrivateKey = forge.pki.privateKeyFromPem(decryptedKey.privatePEM);
        forgePublicKey = forge.pki.publicKeyFromPem(decryptedKey.publicPEM);
      } else {
        forgePrivateKey = forge.pki.privateKeyFromPem(keyFromPromise.privatePEM);
        forgePublicKey = forge.pki.publicKeyFromPem(keyFromPromise.publicPEM);
      }

      let forgeCSR = forge.pki.createCertificationRequest();
      forgeCSR.publicKey = forgePublicKey;
      forgeCSR.setSubject((<DistinguishedName>subject).forgeSubjectAttributesArray);

      let forgeExtensions: any[] = [];
      for (let ext of <IV3Extension[]>v3Extensions) {
        forgeExtensions.push(ext._ext);
      }

      forgeCSR.addAttribute({
        name: "extensionRequest",
        extensions: forgeExtensions
      });

      if (challengePassword) {
        forgeCSR.addAttribute({
          name: "challengePassword",
          value: challengePassword
        });
      }

      if (unstructuredName) {
        forgeCSR.addAttribute({
          name: "unstructuredName",
          value: unstructuredName
        });
      }

      let md: any;

      switch (hash) {
        case "sha1":
          md = forge.md.sha1.create();
          break;
        case "sha256":
          md = forge.md.sha256.create();
          break;
        case "md5":
          md = forge.md.md5.create();
          break;
        default:
          throw new Error(`Unrecognized message digest hash algorithm: ${hash}`);
      }

      forgeCSR.sign(forgePrivateKey, md);
      let csrPEM: string = forge.pki.certificationRequestToPem(forgeCSR);

      resolve({csr: (new CSR(csrPEM)), key: keyFromPromise})
    });
  });
}

function csrSync(subject?: IDistinguishedName,
             v3Extensions: IV3Extension[] = [],
             key?: IKey | {numBits: number, encryption?: IKeyEncryption} | null,
             hash: "sha1" | "sha256" | "md5" = "sha256",
             challengePassword?: string,
             unstructuredName?: string):
{csr: ICSR, key: IKey} {

  if (!subject) {
    subject = new DistinguishedName();
  } else if (!isIDistinguishedName(subject)) {
    throw new Error(`The generate csr function can only receive${""
      } objects that conform to the IDistinguishedName interface for the subject${""
      } argument, given: ${subject}`);
  }

  let v3ExtensionsCheck = _checkV3Extensions(v3Extensions);

  if (v3ExtensionsCheck === null) {
    console.error("v3Exts sync==> ", v3Extensions, v3ExtensionsCheck);
    throw new Error(`The generate csr function can only receive ${""
      } arrays of objects that conform to the IV3Extension interface for the${""
      } v3Extensions argument, given: ${v3Extensions}`);
  } else {
    v3Extensions = v3ExtensionsCheck;
  }

  let keyPromise: Promise<IKey>;

  if (!key) {
    key =  privateKeySync();
  } else if (typeof key === "object" && isPosiviteInteger(key.numBits)) {
    if (!key.encryption || isIKeyEncryption(key.encryption)) {
      key = privateKeySync(key.numBits, (key.encryption ? key.encryption : undefined));
    } else {
      throw new Error(`The generate csr function can only receive${""
        } objects that conform to the IKey interface or objects that contain a positive${
        ""} integer "numBits" property and an IKeyEncryption "encryption" property,${""
        } given: ${key}`);
    }
  } else {
    throw new Error(`The generate csr function can only receive${""
      } objects that conform to the IKey interface or objects that contain a positive${""
      } integer "numBits" property and an IKeyEncryption "encryption" property, given: ${
      key}`);
  }

  if (hash !== "sha1" && hash !== "sha256" && hash !== "md5"){
    throw new Error(`The generate csr function can only receive${""
      } the strings "sha1", "sha256", or "md5" for the hash${""
      } argument, given: ${hash}`);
  }

  if (challengePassword && typeof challengePassword !== "string"){
    throw new Error(`The generate csr function can only receive${""
      } a challenge password parameter in string form, given: ${challengePassword}`);
  }

  if (unstructuredName && typeof unstructuredName !== "string"){
    throw new Error(`The generate csr function can only receive${""
      } an unstructured name parameter in string form, given: ${unstructuredName}`);
  }

  let forgePrivateKey: any;
  let forgePublicKey: any;

  if (key.isEncrypted) {
    let decryptedKey = (new Key(key)).passwordDecrypt();

    forgePrivateKey = forge.pki.privateKeyFromPem(decryptedKey.privatePEM);
    forgePublicKey = forge.pki.publicKeyFromPem(decryptedKey.publicPEM);
  } else {
    forgePrivateKey = forge.pki.privateKeyFromPem(key.privatePEM);
    forgePublicKey = forge.pki.publicKeyFromPem(key.publicPEM);
  }

  let forgeCSR = forge.pki.createCertificationRequest();
  forgeCSR.publicKey = forgePublicKey;
  forgeCSR.setSubject((<DistinguishedName>subject).forgeSubjectAttributesArray);

  let forgeExtensions: any[] = [];
  for (let ext of <IV3Extension[]>v3Extensions) {
    forgeExtensions.push(ext._ext);
  }

  forgeCSR.addAttribute({
    name: "extensionRequest",
    extensions: forgeExtensions
  });

  if (challengePassword) {
    forgeCSR.addAttribute({
      name: "challengePassword",
      value: challengePassword
    });
  }

  if (unstructuredName) {
    forgeCSR.addAttribute({
      name: "unstructuredName",
      value: unstructuredName
    });
  }

  let md: any;

  switch (hash) {
    case "sha1":
      md = forge.md.sha1.create();
      break;
    case "sha256":
      md = forge.md.sha256.create();
      break;
    case "md5":
      md = forge.md.md5.create();
      break;
    default:
      throw new Error(`Unrecognized message digest hash algorithm: ${hash}`);
  }

  forgeCSR.sign(forgePrivateKey, md);
  let csrPEM: string = forge.pki.certificationRequestToPem(forgeCSR);

  return {csr: (new CSR(csrPEM)), key: key};
}



function cert(
  csrOrSubject?: ICSR | string | {subject: IDistinguishedName, key?: string | IKey | null} | null,
  signer?: {cert: ICert, key: IKey} | IKey | null,
  v3Extensions?: IV3Extension[] | null,
  options?: ICertOptions | null):
Promise<{key: IKey | null, csr: ICSR, cert: ICert}> {

  // _cert arguments to be determined from args given to this function
  let subj: IDistinguishedName;
  let subjPublicKeyPEM: string;
  let issuerDN: IDistinguishedName;
  let issuerKey: IKey;
  let v3Ext: IV3Extension[];

  let v3ExtensionsCheck = _checkV3Extensions(v3Extensions);

  if (v3ExtensionsCheck === null) {
    return Promise.reject(new Error(`The generate cert function can only receive ${""
      } arrays of objects that conform to the IV3Extension interface for the${""
      } v3Extensions argument, given: ${v3Extensions}`));
  } else {
    v3Ext = v3ExtensionsCheck;
  }

  if (options === null || typeof options === "undefined") {
    options = new CertOptions();
  } else if (!isICertOptions(options)) {
    Promise.reject(new Error(`The generate cert function argument "options" must${""
    } adhere to the ICertOptions interface`));
  }

  let keyAndCSRPromise: Promise<{csr: ICSR, key: IKey | null}>;

  if (isICSR(csrOrSubject)) {
    keyAndCSRPromise = Promise.resolve({csr: csrOrSubject, key: null});
  } else if (!csrOrSubject) {
    keyAndCSRPromise = csr();
  } else if (typeof csrOrSubject === "string") {
    try {
      keyAndCSRPromise = Promise.resolve({csr: new CSR(csrOrSubject), key: null});
    } catch(error) {
      return Promise.reject(new Error(`Could not parse generate cert function arg${""
      } csrOrSubject: ${csrOrSubject}`));
    }
  } else if (isIDistinguishedName(csrOrSubject.subject)){

    if (typeof csrOrSubject.key === "string") {
      let key: IKey;
      try {
        key = new Key(csrOrSubject.key);
      } catch (error) {
        return Promise.reject(new Error(`Generate cert function could not parse${""
        } subject key pem string: ${csrOrSubject.key}`));
      }
      keyAndCSRPromise = csr(csrOrSubject.subject, v3Ext, key);
    } else if (isIKey(csrOrSubject.key) || !csrOrSubject.key) {
      keyAndCSRPromise = csr(csrOrSubject.subject, v3Ext, csrOrSubject.key);
    } else {
      return Promise.reject(new Error(`The generate cert function argument${""} 
      "csrOrSubject" did not have a correctly formatted "key" property, given: ${
        csrOrSubject.key}`));
    }
  } else {
    return Promise.reject(new Error(`The generate cert function argument${""} 
      "csrOrSubject" did not have a correctly formatted "subject" property, given: ${
      csrOrSubject.subject}`));
  }

  return new Promise<{key: IKey | null, csr: ICSR, cert: ICert}>((resolve, reject) => {
    keyAndCSRPromise.then((keyAndCSR) => {
      subj = keyAndCSR.csr.subject;
      subjPublicKeyPEM = keyAndCSR.csr.publicKeyPEM;

      if (signer === null || typeof signer === "undefined") {
        if (!keyAndCSR.key) {
          reject(new Error(`The generate cert function cannot self-sign a certificate${""
          } if the given "csrOrSubject" argument is only a CSR without a signing${""
          } key, please provide a signing key as the "signer" argument`));
        } else {
          issuerDN = keyAndCSR.csr.subject;
          issuerKey = keyAndCSR.key;
        }
      } else if (isIKey(signer)) {
        issuerDN = keyAndCSR.csr.subject;
        issuerKey = signer;
      } else if (isICert(signer.cert) && isIKey(signer.key)) {
        issuerDN = signer.cert.subject;
        issuerKey = signer.key;
      } else {
        reject(new Error(`The generate cert function was given a "signer" argument${""
        } in an incorrect format, given: ${signer}`));
      }

      let cert = _cert(
        subj,
        subjPublicKeyPEM,
        issuerDN,
        issuerKey,
        v3Ext,
        <ICertOptions> options
      );

      resolve({cert: cert, csr: keyAndCSR.csr, key: keyAndCSR.key});
    })
  });
}

function certSync(
  csrOrSubject?: ICSR | string | {subject: IDistinguishedName, key?: string | IKey | null} | null,
  signer?: {cert: ICert, key: IKey} | IKey | null,
  v3Extensions?: IV3Extension[] | null,
  options?: ICertOptions | null):
{key: IKey | null, csr: ICSR, cert: ICert} {

  // _cert arguments to be determined from args given to this function
  let subj: IDistinguishedName;
  let subjPublicKeyPEM: string;
  let issuerDN: IDistinguishedName;
  let issuerKey: IKey;
  let v3Ext: IV3Extension[];

  let v3ExtensionsCheck = _checkV3Extensions(v3Extensions);

  if (v3ExtensionsCheck === null) {
    throw new Error(`The generate cert function can only receive ${""
      } arrays of objects that conform to the IV3Extension interface for the${""
      } v3Extensions argument, given: ${v3Extensions}`);
  } else {
    v3Ext = v3ExtensionsCheck;
  }

  if (options === null || typeof options === "undefined") {
    options = new CertOptions();
  } else if (!isICertOptions(options)) {
    throw new Error(`The generate cert function argument "options" must${""
      } adhere to the ICertOptions interface`);
  }

  let keyAndCSR: {csr: ICSR, key: IKey | null};

  if (isICSR(csrOrSubject)) {
    keyAndCSR = {csr: csrOrSubject, key: null};
  } else if (!csrOrSubject) {
    keyAndCSR = csrSync();
  } else if (typeof csrOrSubject === "string") {
    try {
      keyAndCSR = {csr: new CSR(csrOrSubject), key: null};
    } catch(error) {
      throw new Error(`Could not parse generate cert function arg${""
        } csrOrSubject: ${csrOrSubject}`);
    }
  } else if (isIDistinguishedName(csrOrSubject.subject)){

    if (typeof csrOrSubject.key === "string") {
      let key: IKey;
      try {
        key = new Key(csrOrSubject.key);
      } catch (error) {
        throw new Error(`Generate cert function could not parse subject key pem${""
          } string: ${csrOrSubject.key}`);
      }
      keyAndCSR = csrSync(csrOrSubject.subject, v3Ext, key);
    } else if (isIKey(csrOrSubject.key) || !csrOrSubject.key) {
      keyAndCSR = csrSync(csrOrSubject.subject, v3Ext, csrOrSubject.key);
    } else {
      throw new Error(`The generate cert function argument${""} 
      "csrOrSubject" did not have a correctly formatted "key" property, given: ${
        csrOrSubject.key}`);
    }
  } else {
    throw new Error(`The generate cert function argument${""} 
      "csrOrSubject" did not have a correctly formatted "subject" property, given: ${
      csrOrSubject.subject}`);
  }

  subj = keyAndCSR.csr.subject;
  subjPublicKeyPEM = keyAndCSR.csr.publicKeyPEM;

  if (signer === null || typeof signer === "undefined") {
    if (!keyAndCSR.key) {
      throw new Error(`The generate cert function cannot self-sign a certificate${""
        } if the given "csrOrSubject" argument is only a CSR without a signing${""
        } key, please provide a signing key as the "signer" argument`);
    } else {
      issuerDN = keyAndCSR.csr.subject;
      issuerKey = keyAndCSR.key;
    }
  } else if (isIKey(signer)) {
    issuerDN = keyAndCSR.csr.subject;
    issuerKey = signer;
  } else if (isICert(signer.cert) && isIKey(signer.key)) {
    issuerDN = signer.cert.subject;
    issuerKey = signer.key;
  } else {
    throw new Error(`The generate cert function was given a "signer" argument${""
      } in an incorrect format, given: ${signer}`);
  }

  let cert = _cert(
    subj,
    subjPublicKeyPEM,
    issuerDN,
    issuerKey,
    v3Ext,
    <ICertOptions> options
  );

  return {cert: cert, csr: keyAndCSR.csr, key: keyAndCSR.key};
}


function _cert(
  subject: IDistinguishedName,
  publicKeyPEM: string,
  issuer: IDistinguishedName,
  issuerKey: IKey,
  v3Extensions: IV3Extension[],
  options: ICertOptions
): ICert {
  const cert = forge.pki.createCertificate();
  cert.serialNumber = options.serial.toString(16);
  cert.validity.notBefore = options.startDate instanceof Date ?
    options.startDate
    :
    new Date(options.startDate);
  cert.validity.notAfter = options.endDate instanceof Date ?
    options.endDate
    :
    new Date(options.endDate);
  cert.setSubject(subject.forgeSubjectAttributesArray);
  cert.setIssuer(issuer.forgeSubjectAttributesArray);

  let forgeExtensions: any[] = [];
  for (let ext of v3Extensions) {
    forgeExtensions.push(ext._ext);
  }
  cert.setExtensions(forgeExtensions);
  cert.publicKey = forge.pki.publicKeyFromPem(publicKeyPEM);

  let md: any;
  let hash = options.hash;

  switch (hash) {
    case "sha1":
      md = forge.md.sha1.create();
      break;
    case "sha256":
      md = forge.md.sha256.create();
      break;
    case "md5":
      md = forge.md.md5.create();
      break;
    default:
      throw new Error(`Unrecognized message digest hash algorithm: ${hash}`);
  }

  let decryptedIssuerKey: IKey;
  if (issuerKey.isEncrypted) {
    decryptedIssuerKey = issuerKey.passwordDecrypt();
  } else {
    decryptedIssuerKey = issuerKey;
  }

  cert.sign(forge.pki.privateKeyFromPem(decryptedIssuerKey.privatePEM), md);

  return new Cert(forge.pki.certificateToPem(cert));
}

function _checkV3Extensions(v3ExtensionsCandidate: any): IV3Extension[] | null {

  if (v3ExtensionsCandidate === null || typeof v3ExtensionsCandidate === "undefined"){
    return [];
  } else if (!Array.isArray(v3ExtensionsCandidate)) {
    return null;
  } else {
    for (let element of v3ExtensionsCandidate) {
      if (!isIV3Extension(element)) {
        return null;
      }
    }

    return v3ExtensionsCandidate;
  }
}







let encryption = new KeyEncryption("pass-gas", "3des", true);

// console.time("time async");
// generate.privateKey(2048, encryption).then((key) => {
//   console.timeEnd("time async");
//   console.log("key:", key);
// }, (error) => {
//   console.log("error:", error);
// });

// console.time("time sync");
// console.log("key:", generate.privateKeySync(2048, encryption));
// console.timeEnd("time sync");
//
// console.log("doin other stuff");

// generate.csr(new DistinguishedName("Zach", "CO"),
//   [new BasicConstraints(true, 5)],
//   {numBits: 512, encryption: encryption},
//   "sha256"
// ).then((certReq) => {
//   console.log("certReq:", certReq);
// }, (error) => {
//   console.log("error:", error);
// });

// console.log(generate.csrSync(new DistinguishedName("Zach", "CO"),
//   [new BasicConstraints(true, 5)],
//   {numBits: 512, encryption: encryption},
//   "sha256",
//   "cp",
//   "usn"
// ));
