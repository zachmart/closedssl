"use strict";
import {IEquitable, isIEquitable} from "./IEquitable";
import {IDistinguishedNameS, isIDistinguishedNameS} from "./IDistinguishedNameS";
import {ISerializable, isISerializable} from "./ISerializable";

/**
 * Created by zacharymartin on July 16, 2016.
 */

export interface IDistinguishedName
extends IEquitable, IDistinguishedNameS, ISerializable<IDistinguishedNameS> {

  readonly forgeSubjectAttributesArray?: {value: string, shortName: string, name: string}[]
  readonly jsonObject: IDistinguishedNameS;
}

export function isIDistinguishedName(object: any): object is IDistinguishedName {
  if (!isIDistinguishedNameS(object)) {
    return false;
  }

  if (!isIEquitable(object)) {
    return false;
  }

  if (!isISerializable(object)) {
    return false;
  }

  if (!isIDistinguishedNameS(object.jsonObject)) {
    return false;
  }

  return true;
}