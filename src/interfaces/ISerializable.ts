"use strict";

/**
 * Created by zacharymartin on August 08, 2016.
 */

export interface ISerializable<T> {
  serialize: T;
}

export function isISerializable<T>(object: any): object is ISerializable<T> {
  if (!object) {
    return false;
  }

  if (typeof object.serialize !== "function") {
    return false;
  }

  return true;
}