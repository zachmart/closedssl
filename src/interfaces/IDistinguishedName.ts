"use strict";
import {IEquitable, isIEquitable} from "./IEquitable";

/**
 * Created by zacharymartin on July 16, 2016.
 */

export interface IDistinguishedName extends IEquitable {
  readonly commonName: string | null;
  readonly country: string | null;
  readonly state: string | null;
  readonly locality: string | null;
  readonly organization: string | null;
  readonly organizationalUnit: string | null;
  readonly email: string | null;
  readonly forgeSubjectAttributesArray?: {value: string, shortName: string, name: string}[]
  readonly jsonObject?: IDistinguishedName;
}

export function isIDistinguishedName(object: any): object is IDistinguishedName {
  if (typeof object !== "object") {
    return false;
  }

  if (!isIEquitable(object)) {
    return false;
  }

  if (typeof object.commonName !== "string" && object.commonName !== null){
    return false;
  }

  if (typeof object.country !== "string" && object.country !== null){
    return false;
  }

  if (typeof object.state !== "string" && object.state !== null){
    return false;
  }

  if (typeof object.locality !== "string" && object.locality !== null){
    return false;
  }

  if (typeof object.organization !== "string" && object.organization !== null){
    return false;
  }

  if (typeof object.organizationalUnit !== "string" && object.organizationalUnit !== null)
  {
    return false;
  }

  if (typeof object.email !== "string" && object.email !== null){
    return false;
  }

  if (!object.commonName &&
      !object.country &&
      !object.state &&
      !object.locality &&
      !object.organization &&
      !object.organizationalUnit &&
      !object.email) {
    return false;
  }

  return true;
}