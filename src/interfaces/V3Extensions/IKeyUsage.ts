"use strict";
import {IV3Extension, isIV3Extension} from "./IV3Extension";
import {isArray} from "../../utilities/utilities";
import {isIterable} from "../IterationInterfaceTypeGuards";

/**
 * Created by zacharymartin on July 12, 2016.
 */

export interface IKeyUsage extends IV3Extension, Iterable<string> {
  readonly digitalSignature: boolean;
  readonly nonRepudiation: boolean;
  readonly keyEncipherment: boolean;
  readonly dataEncipherment: boolean;
  readonly keyAgreement: boolean;
  readonly keyCertSign: boolean;
  readonly cRLSign: boolean;
  readonly encipherOnly: boolean;
  readonly decipherOnly: boolean;
  readonly usages: string[];
  isValidUsage(usage: string): boolean;
}

export const POSSIBLE_USAGES = [
  "digitalSignature",
  "nonRepudiation",
  "keyEncipherment",
  "dataEncipherment",
  "keyAgreement",
  "keyCertSign",
  "cRLSign",
  "encipherOnly",
  "decipherOnly"
];

export function isIKeyUsage(object: any): object is IKeyUsage {
  // test that isIterable
  if (!isIterable(object)){
    return false;
  }

  // test that isIV3Extension and _name prop is equal to "keyUsage"
  if (!isIV3Extension(object) || object._name !== "keyUsage") {
    return false;
  }

  // test that all POSSIBLE_USAGES props exist and are booleans
  for (let usage of POSSIBLE_USAGES) {
    if (!(usage in object) || typeof object[usage] !== "boolean") {
      return false;
    }
  }

  // test that usages prop exists, is an array, and if its length is greater than zero,
  // then its 0th element is a string
  if (!("usages" in object)    || 
      !isArray(object.usages)  ||
      !(object.usages.length === 0 || typeof object.usages[0] === "string")){
    return false;
  }
  
  // test that isValidUsage prop exists
  if (!("isValidUsage" in object)){
    return false;
  }

  // test that isValidUsage prop is a method that returns a boolean
  try {
    let returnedValue = object.isValidUsage("test");
    if (typeof returnedValue !== "boolean"){
      return false;
    }
  } catch (error) {
    // isValidUsage prop is not a callable function
    return false;
  }
  
  
  return true;
}

