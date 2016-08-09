"use strict";

/**
 * Created by zacharymartin on August 08, 2016.
 */

export interface ISerializable<T> {
  jsonObject: T;
}

export function isISerializable<T>(object: any): object is ISerializable<T> {
  if (!object) {
    return false;
  }

  if (typeof object.jsonObject !== "object") {
    return false;
  }

  return true;
}