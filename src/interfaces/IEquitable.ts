"use strict";

/**
 * Created by zacharymartin on July 13, 2016.
 */

export interface IEquitable {
  equals(that: any): boolean;
}

export function isIEquitable(object: any): object is IEquitable {
  // test to make sure arg is defined
  if (!object) {
    return false;
  }

  // test to make sure object is not numeric or boolean
  if (typeof object === "number" || typeof object === "boolean"){
    return false;
  }

  if (typeof object.equals !== "function"){
    return false;
  }

  // test to make sure the equals property is a function that returns boolean values
  if (typeof object.equals("test") !== "boolean") {
    return false;
  }

  return true;
}