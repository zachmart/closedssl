"use strict";
import {IEquitable, isIEquitable} from "../IEquitable";

/**
 * Created by zacharymartin on July 12, 2016.
 */

export interface IV3Extension extends IEquitable {
  readonly _name: string;
  readonly _ext: {};
}

export function isIV3Extension(object: any): object is IV3Extension {
  // test that object is an IEquitable
  if (!(isIEquitable(object))){
    return false;
  }
  
  // test that _name prop exists and is a string
  if (!("_name" in object) || typeof object._name !== "string") {
    return false;
  }

  // test that _ext prop exists and is an object
  if (!("_ext" in object) || typeof object._ext !== "object") {
    return false;
  }
  
  return true;
}
