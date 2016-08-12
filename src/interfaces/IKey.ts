"use strict";
import {IKeyEncryption, isIKeyEncryption} from "./IKeyEncryption";


/**
 * Created by zacharymartin on July 16, 2016.
 */

export interface IKey {
  privatePEM: string;
  publicPEM: string;
  numBits: number;
  encryption: IKeyEncryption | null;
  isEncrypted: boolean;
  modulus: (radix?: number) => string;
  publicExponent: (radix?: number) => string;
  privateExponent: (radix?: number) => string;
  prime1: (radix?: number) => string;
  prime2: (radix?: number) => string;
  exponent1: (radix?: number) => string;
  exponent2: (radix?: number) => string;
  coefficient: (radix?: number) => string;
  passwordEncrypt: (encryption: IKeyEncryption) => IKey;
  passwordDecrypt: () => IKey;
}

export function isIKey(object: any): object is IKey {
  if (!object || typeof object !== "object"){
    return false;
  }

  if (!object.privatePEM || typeof object.privatePEM !== "string"){
    return false;
  }

  if (!object.publicPEM || typeof object.publicPEM !== "string"){
    return false;
  }

  if (!object.numBits || typeof object.numBits !== "number"){
    return false;
  }

  if (object.encryption !== null && !isIKeyEncryption(object.encryption)){
    return false;
  }

  if (typeof object.isEncrypted !== "boolean") {
    return false;
  }

  if (typeof object.modulus !== "function" || typeof object.modulus() !== "string"){
    return false;
  }

  if (typeof object.publicExponent !== "function" ||
      typeof object.publicExponent() !== "string"){
    return false;
  }

  if (typeof object.privateExponent !== "function" ||
      typeof object.privateExponent() !== "string"){
    return false;
  }

  if (typeof object.prime1 !== "function" || typeof object.prime1() !== "string"){
    return false;
  }

  if (typeof object.prime2 !== "function" || typeof object.prime2() !== "string"){
    return false;
  }

  if (typeof object.exponent1 !== "function" || typeof object.exponent1() !== "string"){
    return false;
  }

  if (typeof object.exponent2 !== "function" || typeof object.exponent2() !== "string"){
    return false;
  }

  if (typeof object.coefficient !== "function" ||
      typeof object.coefficient() !== "string"){
    return false;
  }

  if (object.passwordEncrypt) {
    if (typeof object.passwordEncrypt !== "function") {
      return false;
    }
  }

  if (object.passwordDecrypt) {
    if (typeof object.passwordDecrypt !== "function") {
      return false;
    }
  }

  return true;
}