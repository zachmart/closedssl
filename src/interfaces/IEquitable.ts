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

  if (!("equals" in object)){
    return false;
  }

  // test to make sure the equals property is a function that returns boolean values
  try {
    let returnedValue = object.equals("test");
    if (typeof returnedValue !== "boolean"){
      return false;
    }
  } catch (error) {
    // object.equals was not a callable function
    return false;
  }

  return true;
}