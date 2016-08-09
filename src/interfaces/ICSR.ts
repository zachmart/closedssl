"use strict";
import {IDistinguishedName, isIDistinguishedName} from "../interfaces/IDistinguishedName";
import {IV3Extension, isIV3Extension} from "./V3Extensions/IV3Extension";

/**
 * Created by zacharymartin on July 16, 2016.
 */

export interface ICSR {
  readonly publicKeyPEM: string;
  readonly numBits: number;
  readonly pem: string;
  readonly subject: IDistinguishedName;
  readonly v3Extensions: IV3Extension[];
  readonly hash:  "sha1" | "sha256" | "md5";
  readonly challengePassword: string | null;
  readonly unstructuredName: string | null;
  modulus: (radix: number) => string;
  publicExponent: (radix: number) => string;
  fingerprint: (hash?: "sha1" | "sha256" | "sha384" | "sha512" | "md5") => string;
}

export function isICSR(object: any): object is ICSR {
  if (!object || typeof object !== "object") {
    return false;
  }

  if (!object.publicKeyPEM || typeof object.publicKeyPEM !== "string") {
    return false;
  }

  if (!object.numBits || typeof object.numBits !== "number"){
    return false;
  }

  if (!object.pem || typeof object.pem !== "string") {
    return false;
  }

  if (!isIDistinguishedName(object.subject)){
    return false;
  }

  if (!object.v3Extensions || !Array.isArray(object.v3Extensions)){
    return false;
  }

  for (let element of object.v3Extensions){
    if (!isIV3Extension(element)){
      return false;
    }
  }

  if (!object.hash || (object.hash !== "sha1" &&
      object.hash !== "sha256" &&
      object.hash !== "sha384" &&
      object.hash !== "sha512" &&
      object.hash !== "md5")){
    return false;
  }

  if (object.challengePassword !== null && typeof object.challengePassword !== "string"){
    return false;
  }

  if (object.unstructuredName !== null && typeof object.unstructuredName !== "string"){
    return false;
  }

  if (typeof object.modulus !== "function" || typeof object.modulus() !== "string"){
    return false;
  }

  if (typeof object.publicExponent !== "function" ||
      typeof object.publicExponent !== "string"){
    return false;
  }

  if (typeof object.fingerprint !== "function" ||
    typeof object.fingerprint("sha1") !== "string" ||
    typeof object.fingerprint("sha256") !== "string" ||
    typeof object.fingerprint("sha384") !== "string" ||
    typeof object.fingerprint("sha512") !== "string" ||
    typeof object.fingerprint("md5") !== "string") {
    return false;
  }

  return true;
}
