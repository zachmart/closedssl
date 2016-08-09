"use strict";
import {IV3Extension, isIV3Extension} from "./IV3Extension";
import {IAlternativeName} from "./IAlternativeName";
import {isIterable} from "../IterationInterfaceTypeGuards";

/**
 * Created by zacharymartin on July 12, 2016.
 */

export interface IAltNameStore extends IV3Extension, Iterable<string> {
  readonly length: number;
  readonly altNames: string[];
}

export function isAltNameStore(object: any): object is IAltNameStore {
  if (!object || typeof object !== "object") {
    return false;
  }

  // test that isIV3Extension
  if (!isIV3Extension(object)) {
    return false;
  }

  // test that isIterable
  if (!isIterable(object)){
    return false;
  }

  if (typeof object.length !== "number" || object.length < 0) {
    return false;
  }

  if (!object.altNames || !Array.isArray(object.altNames)){
    return false;
  }

  // test that prop altNames is an array of all strings
  for (let element of object.altNames) {
    if (typeof element !== "string") {
      return false;
    }
  }

  return true;
}
