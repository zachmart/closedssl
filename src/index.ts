"use strict";
import {ICAStore} from "./interfaces/ICAStore";
import {Cert} from "./impls/Cert";
import {Key} from "./impls/Key";
import {IKey} from "./interfaces/IKey";
import {ICSR} from "./interfaces/ICSR";
import {CSR} from "./impls/CSR";
import {ICert} from "./interfaces/ICert";
import {IDistinguishedName} from "./interfaces/IDistinguishedName";
import {DistinguishedName} from "../lib/impls/DistinguishedName";
import {IKeyEncryption} from "../lib/interfaces/IKeyEncryption";
import {KeyEncryption} from "./impls/KeyEncryption";
import {ICertOptions} from "./interfaces/ICertOptions";
import {CertOptions} from "./impls/CertOptions";
import {IKeyUsage} from "./interfaces/V3Extensions/IKeyUsage";
import {KeyUsage} from "./impls/V3Extensions/KeyUsage";
import {IExtendedKeyUsage} from "./interfaces/V3Extensions/IExtendedKeyUsage";
import {ExtendedKeyUsage} from "./impls/V3Extensions/ExtendedKeyUsage";
import {IBasicConstraints} from "./interfaces/V3Extensions/IBasicConstraints";
import {BasicConstraints} from "./impls/V3Extensions/BasicConstraints";
import {ISubjectAlternativeName} from "./interfaces/V3Extensions/ISubjectAlternativeName";
import {SubjectAlternativeName} from "../lib/impls/V3Extensions/SubjectAlternativeName";

/**
 * Created by zacharymartin on July 11, 2016.
 */

// export generate functions object
export {generate} from "./impls/generate";

// export factory object for interface implementations of IKey, ICSR, and ICert
// constructed from PEM files
export const pemSourced = {
  key: function(keyPEM: string, password?: string): IKey {
    return new Key(keyPEM, password);
  },
  csr: function (csrPEM: string): ICSR {
    return new CSR(csrPEM);
  },
  cert: function (certPEM: string): ICert {
    return new Cert(certPEM);
  }
};

// export function to create IDistinguishedName objects
export function distinguishedName(arg?: {
  commonName?: string,
  country?: string,
  state?: string,
  locality?: string,
  organization?: string,
  organizationalUnit?: string,
  email?: string
}): IDistinguishedName {
  let result;

  if (!arg) {
    result = new DistinguishedName();
  } else {
    result = new DistinguishedName(
      arg.commonName,
      arg.country,
      arg.state,
      arg.locality,
      arg.organization,
      arg.organizationalUnit,
      arg.email
    );
  }

  return result;
}

// export function to create IKeyEncryption objects
export function keyEncryption(arg: {
  password: string,
  algorithm?: "aes128" | "aes192" | "aes256" | "3des" | "des",
  legacy?: boolean
}): IKeyEncryption {
  if (!arg || !arg.password) {
    throw new Error(`The keyEncryption factory function must at least be provided with${""
    } an object with a non-empty string "password" property`);
  }

  return new KeyEncryption(arg.password, arg.algorithm, arg.legacy);
}

// export function to create ICertOptions objects

export function certOptions(arg: {
  days?: number,
  serial?: number,
  hash?:  "sha1" | "sha256" | "md5",
  startDate?: Date
}): ICertOptions {
  let result;

  if (!arg) {
    result = new CertOptions();
  } else {
    result = new CertOptions(arg.days, arg.serial, arg.hash, arg.startDate);
  }

  return result;
}

export const v3Ext = {
  basicConstraints: function(arg?: {ca: boolean, pathLengthConstraint?: number}):
    IBasicConstraints {

    let result;

    if (!arg) {
      result = new BasicConstraints();
    } else {
      result = new BasicConstraints(arg.ca, arg.pathLengthConstraint);
    }

    return result;
  },
  keyUsage: function(usages:
                       Array<"digitalSignature" |
                             "nonRepudiation" |
                             "keyEncipherment" |
                             "dataEncipherment" |
                             "keyAgreement" |
                             "keyCertSign" |
                             "cRLSign" |
                             "encipherOnly" |
                             "decipherOnly">
            ): IKeyUsage {
    let result;

    if (!usages) {
      result = new KeyUsage();
    } else {
      result = new KeyUsage(usages);
    }

    return result;
  },
  extendedKeyUsage: function(usages: string[]): IExtendedKeyUsage {
    return new ExtendedKeyUsage(usages);
  },
  subjectAlternativeName: function(
    altNames: Array<string |
                    {value: string, type: "URI" | "IP" | "DNS" | "EMAIL" | "OTHER"}>):
    ISubjectAlternativeName {
    return new SubjectAlternativeName(altNames);
  }
};


// export interfaces and interface type-guards
export {
  IBasicConstraints,
  isIBasicConstraints
} from "./interfaces/V3Extensions/IBasicConstraints";
export {
  IExtendedKeyUsage,
  isIExtendedKeyUsage
} from "./interfaces/V3Extensions/IExtendedKeyUsage";
export {
  IIssuerAlternativeName,
  isIIssuerAlternativeName
} from "./interfaces/V3Extensions/IIssuerAlternativeName";
export {
  IKeyUsage,
  isIKeyUsage
} from "./interfaces/V3Extensions/IKeyUsage";
export {
  ISubjectAlternativeName,
  isISubjectAlternativeName
} from "./interfaces/V3Extensions/ISubjectAlternativeName";
export {
  IV3Extension,
  isIV3Extension
} from "./interfaces/V3Extensions/IV3Extension";
export {
  ICAStore,
  isICAStore
} from "./interfaces/ICAStore";
export {
  ICert,
  isICert
} from "./interfaces/ICert";
export {
  ICSR,
  isICSR
} from "./interfaces/ICSR";
export {
  IDistinguishedName,
  isIDistinguishedName
} from "./interfaces/IDistinguishedName";
export {
  IKey,
  isIKey
} from "./interfaces/IKey";
export {
  IKeyEncryption,
  isIKeyEncryption
} from "./interfaces/IKeyEncryption";
export {
  ICertOptions,
  isICertOptions
} from "./interfaces/ICertOptions";