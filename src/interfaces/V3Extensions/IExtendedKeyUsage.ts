"use strict";
import {IV3Extension, isIV3Extension} from "./IV3Extension";
import {isArray} from "../../utilities/utilities";

/**
 * Created by zacharymartin on July 12, 2016.
 */

export interface IExtendedKeyUsage extends IV3Extension, Iterable<string> {
  readonly serverAuth: boolean;
  readonly clientAuth: boolean;
  readonly codeSigning: boolean;
  readonly emailProtection: boolean;
  readonly timeStamping: boolean;
  usages: string[];
  isValidUsage(name: string): boolean;
}

export const COMMON_USAGES = [
  "serverAuth",
  "clientAuth",
  "codeSigning",
  "emailProtection",
  "timeStamping"
];

export function isIExtendedKeyUsage(object: any): object is IExtendedKeyUsage {
  if (!object || typeof object !== "object") {
    return false;
  }

  // test that isIV3Extension exists and name prop is equal to "keyUsage"
  if (!isIV3Extension(object) || object._name !== "extKeyUsage") {
    return false;
  }

  // test that all POSSIBLE_USAGES props exist and are booleans
  for (let usage of COMMON_USAGES) {
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

  // test that isValidUsage method exists and returns a boolean for a string
  if (!("isValidUsage" in object) || typeof object.isValidUsage("test") !== "boolean"){
    return false;
  }

  return true;
}
