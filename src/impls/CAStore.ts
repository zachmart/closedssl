"use strict";
import {ICAStore} from "../interfaces/ICAStore";
import {ICert, isICert} from "../interfaces/ICert";
import {Cert} from "./Cert";

const forge = require("node-forge");
/**
 * Created by zacharymartin on August 04, 2016.
 */

function convertICertOrPEMStringToForgeCert(cert: ICert | string): any {
  let certPEM: string;
  let forgeCert: any;

  if (isICert(cert)) {
    certPEM = cert.pem;
  } else if (typeof cert === "string") {
    certPEM = cert;
  } else {
    throw new Error(``);
  }

  try {
    forgeCert = forge.pki.certificateFromPem(certPEM);
  } catch (error) {
    throw new Error(``);
  }

  return forgeCert;
}

export class CAStore implements ICAStore {
  private readonly _forgeCAStore: any;

  constructor(caCerts?: Array<ICert | string>) {
    this._forgeCAStore = forge.pki.createCaStore();

    if (Array.isArray(caCerts)) {
      for (let cert of caCerts) {
        this.addCert(cert);
      }
    } else if (caCerts !== null && typeof caCerts !== "undefined") {
      throw new Error(``);
    }
  }

  get length(): number {
    return this._forgeCAStore.listAllCertificates().length;
  }

  addCert(cert: ICert | string) {
    this._forgeCAStore.addCertificate(convertICertOrPEMStringToForgeCert(cert));
  }

  removeCert(cert: ICert | string): ICert | null {
    let result: null | ICert;

    const removedForgeCert = this._forgeCAStore.removeCertificate(
      convertICertOrPEMStringToForgeCert(cert)
    );

    if (removedForgeCert === null) {
      result = null;
    } else {
      result = new Cert(forge.pki.certificateToPem(removedForgeCert));
    }

    return result;
  }

  listCerts(): ICert[] {
    const result: ICert[] = [];

    for (let certPEMString of this.listCertsAsPEMStrings()) {
      result.push(new Cert(certPEMString));
    }

    return result;
  }

  listCertsAsPEMStrings(): string[] {
    const result: string[] = [];
    const forgeCerts: any[] = this._forgeCAStore.listAllCertificates();

    for (let forgeCert of forgeCerts) {
      result.push(forge.pki.certificateToPem(forgeCert));
    }

    return result;
  }

  hasCert(cert: ICert | string): boolean {
    const forgeCert = convertICertOrPEMStringToForgeCert(cert);

    return this._forgeCAStore.hasCertificate(forgeCert);
  }

  verifySigningChain(certChain: string | ICert[] | ICert): boolean {
    let forgeCertArray: any[] = [];

    if (typeof certChain === "string") {
      const rPEM = /\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g;
      let forgeCert: any;
      let match;

      while((match = rPEM.exec(certChain)) !== null) {
        try {
          forgeCert = forge.pki.certificateFromPem(match[0]);
        } catch (error) {
          throw new Error(``);
        }
        forgeCertArray.push(forgeCert);
      }
    } else if (Array.isArray(certChain)) {
      for (let cert of certChain) {
        if (isICert(cert)) {
          forgeCertArray.push(forge.pki.certificateFromPem(cert.pem));
        } else {
          throw new Error(``);
        }
      }
    } else if (isICert(certChain)) {
      forgeCertArray.push(forge.pki.certificateFromPem(certChain.pem));
    } else {
      throw new Error(``);
    }

    return forge.pki.verifyCertificateChain(this._forgeCAStore, forgeCertArray, true);
  }

  [Symbol.iterator](): Iterator<ICert> {
    let position = 0;
    let caArray = this.listCerts();

    return {
      next: () => {
        return {
          value: caArray[position++],
          done: (caArray.length < position)
        }
      }
    }
  }
}