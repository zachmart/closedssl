"use strict";
import {IDistinguishedName} from "../interfaces/IDistinguishedName";
import {IV3Extension} from "../interfaces/V3Extensions/IV3Extension";
import {ICSR, isICSR} from "../interfaces/ICSR";
import {DistinguishedName} from "./DistinguishedName";
import {forgeCSROrCertToV3ExtensionArray} from "../utilities/v3ExtUtil";
import {checkRadix} from "../utilities/utilities";
const forge = require("node-forge");

/**
 * Created by zacharymartin on July 23, 2016.
 */


export class CSR implements ICSR {
  private readonly _publicKeyPEM: string;
  private readonly _numBits: number;
  private readonly _pem: string;
  private readonly _subject: IDistinguishedName;
  private readonly _v3Extensions: IV3Extension[];
  private readonly _hash:  "sha1" | "sha256" | "md5";
  private readonly _challengePassword: string | null;
  private readonly _unstructuredName: string | null;

  constructor(csrPEM: string);
  constructor(object: ICSR);

  constructor(arg: string | ICSR) {
    if (isICSR(arg)) {
      this._publicKeyPEM = arg.publicKeyPEM;
      this._numBits = arg.numBits;
      this._pem = arg.pem;
      this._subject = arg.subject;
      this._v3Extensions = arg.v3Extensions;
      this._hash = arg.hash;
      this._challengePassword = arg.challengePassword;
      this._unstructuredName = arg.unstructuredName;
    } else if (typeof arg === "string") {
      let forgeCSR: any;

      try {
        forgeCSR = forge.pki.certificationRequestFromPem(arg, true, true);
      } catch (error) {
        throw new Error(`Could not construct CSR from given pem string "${arg}"${"\n"
        }issue: ${error.message}`);
      }
      this._publicKeyPEM = forge.pki.publicKeyToPem(forgeCSR.publicKey);
      this._numBits = forgeCSR.publicKey.n.bitLength();
      this._pem = arg;
      this._subject = DistinguishedName.forgeCSROrCertToIDN(forgeCSR, "subject");
      this._v3Extensions = forgeCSROrCertToV3ExtensionArray(forgeCSR);
      this._hash = forgeCSR.md.algorithm;

      if (forgeCSR.getAttribute({name: "challengePassword"})) {
        this._challengePassword
          = forgeCSR.getAttribute({name: "challengePassword"}).value;
      } else {
        this._challengePassword = null;
      }

      if (forgeCSR.getAttribute({name: "unstructuredName"})) {
        this._unstructuredName = forgeCSR.getAttribute({name: "unstructuredName"}).value;
      } else {
        this._unstructuredName = null;
      }

    } else {
      throw new Error(`The CSR constructor argument "${arg}" is not acceptable`);
    }
  }

  get publicKeyPEM(): string {
    return this._publicKeyPEM;
  }

  get numBits(): number {
    return this._numBits;
  }

  get pem(): string {
    return this._pem;
  }

  get subject(): IDistinguishedName {
    return this._subject;
  }

  get v3Extensions(): IV3Extension[] {
    return this._v3Extensions;
  }

  get hash(): "sha1" | "sha256" | "md5" {
    return this._hash;
  }

  get challengePassword(): string | null {
    return this._challengePassword;
  }

  get unstructuredName(): string | null {
    return this._unstructuredName;
  }

  modulus(radix: number = 16): string {
    checkRadix(radix);
    const forgePublicKey = forge.pki.publicKeyFromPem(this._publicKeyPEM);
    return forgePublicKey.n.toString(radix);
  }

  publicExponent(radix: number = 16): string {
    checkRadix(radix);
    const forgePublicKey = forge.pki.publicKeyFromPem(this._publicKeyPEM);
    return forgePublicKey.e.toString(radix);
  }

  fingerprint(hash: "sha1" | "sha256" | "sha384" | "sha512" | "md5" = "sha1"): string {
    let md: any;
    const forgeCSR = forge.pki.certificationRequestFromPem(this._pem, true, true);

    switch (hash) {
      case "sha1":
        md = forge.md.sha1.create();
        break;
      case "sha256":
        md = forge.md.sha256.create();
        break;
      case "sha384":
        md = forge.md.sha384.create();
        break;
      case "sha512":
        md = forge.md.sha512.create();
        break;
      case "md5":
        md = forge.md.md5.create();
        break;
      default:
        throw new Error(`Unrecognized message digest hash algorithm: ${hash}`);
    }

    const result = md
      .update(forge.asn1.toDer(forge.pki.certificationRequestToAsn1(forgeCSR)).getBytes())
      .digest()
      .toHex();

    return result;
  }
}

// const csr = `-----BEGIN CERTIFICATE REQUEST-----\r
// MIIE0TCCArkCAQAwgYsxCzAJBgNVBAYTAlVTMRYwFAYDVQQIEw1NYXNzYWNodXNl\r
// dHRzMQ8wDQYDVQQHEwZCb3N0b24xETAPBgNVBAoTCFRlc3QgT3JnMQ0wCwYDVQQL\r
// EwRVbml0MRcwFQYDVQQDEw5aYWNoYXJ5IE1hcnRpbjEYMBYGCSqGSIb3DQEJARYJ\r
// emFAZmguY29tMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsB8hX35+\r
// hi98J8xtbfgkZ5+MyDAvJXwJrxRQfUPgHFSMEfdy3kJ/bAmAvt3FiV1MucKCMlCz\r
// cmNAmq96MuK84nfcWj3Og0h9XzisE0PyTh1HZByIyV0l1NvtwKFxmGoMUgnMwY1e\r
// 5zsWfbMiH2eLmT1wrz0BORpiyepbO+mFfRUH8U4XdYeE0ZFOaCp3yG074kbsVoWO\r
// ORs1rolPq5bt7m2XmkuntyUScUa8WJLvO8Dl/gfRziBNtFnNkVNutUYjP8p1t0VS\r
// JXpd0AYJ2/MZPII2lRg0jD675cKkUJ78dCg5gKY2CdLrQGvEGGgxeYUyWbM15Nyg\r
// U7o7gPDUtrpAxsPevmcI0RHuODgXVU5zySKP+kdYArTV79n/uQyRdyg/x1eN7rNe\r
// 0CMrveWmn8XQzy6mz9aQN4PAcU4bdEcaANn9DjlshgHM2JMAJFA3uDPPOUbjyy7s\r
// eQMIWwHBwyMFljqEWy7Ug9d1eOzBetqxmoKq6eAEnMc4jnYrp272fRxyc/ssSBu2\r
// 5P8/QtoQP121OdgBwQyVfwgXFWZ4uQ12zFtcaihuTtltoWeLv0r/4HhieFfZ7R6V\r
// x/xRInbwRBCmFUDkcAQnuT3Zg7D8nbcit4Y17YfPC4mXPkfbAjTUsTrkqtJ0ZcZW\r
// g4prAZT49U+I1fZuQ5RpKMwP2F0Bb0/ZAF8CAwEAAaAAMA0GCSqGSIb3DQEBBQUA\r
// A4ICAQCsQxESqfEHmBj8KGH55hVFY5m4hkW6RSiGHta1neikpXi2q3w84G6ThAwt\r
// sn40Ri4PWxh8BwFSP5Z3Kyo/zGX32L/WmK0HjR7kgl+LDqx1mJJVQ7M8rIYA0WDA\r
// NJxyRt5MULLaxkYFdsXZ5/xBCcmAujG49K7YRTWdKXiF2GhJCTcD14V33//rgWWP\r
// 476qlzV7SSSzw7Pdus60QVEt/VjA1jDXihw1qJI/a0s/JgU28CJwUCPjmfADe3ye\r
// +h+ZQfKw5pF0ZcbZEDVV09L8h/RGBffbzE0eHYeKVisjMYN6Hu9oZRlCe7iQDRJa\r
// UAny+vGWVmnit0JLGE0o3Py/dzFHfVr4Ywwsws+LVmknJcUAkX5ZHJDhvJkFeVkQ\r
// BAVpQASMjNBgLGF124MWvX/I9V7GROv2Bp0erQ4u6sTBvLWUg/KnzEEZ/p4oVdEP\r
// G7+XI7F+6/J0vMevV+wufINRYXK3xAgHkYkEHO68QF6cYOcNjePYPJwzn1m7xDk3\r
// JMUoGEJPJbYXNMpioytB6MBsU4y5wD5+dehKyRwcU4QNqJE20IhWegeXhxFoW4DA\r
// 4MrH8G+m00Ot4mJqA22cFA9lE54VIFh7mnjHSZ+lm495+xUGUAtfSaqKqBXUwPQt\r
// nUVgA+DnRM38cZAnxDx5tumGbee8NrDGzw21JvaIoEsbwxbrQw==\r
// -----END CERTIFICATE REQUEST-----\r
// `;
//
// const csrObj = new CSR(csr);
//
// console.log(csrObj.jsonObject);
// console.log(isICSR(csrObj));
// console.log("fingerprint sha1:", csrObj.fingerprint("sha1"));
// console.log("fingerprint sha256:", csrObj.fingerprint("sha256"));
// console.log("fingerprint sha384:", csrObj.fingerprint("sha384"));
// console.log("fingerprint sha512:", csrObj.fingerprint("sha512"));
// console.log("fingerprint md5:", csrObj.fingerprint("md5"));