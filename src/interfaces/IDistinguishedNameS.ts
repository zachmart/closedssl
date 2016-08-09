"use strict";

/**
 * Created by zacharymartin on August 09, 2016.
 */

export interface IDistinguishedNameS {
  readonly commonName: string | null;
  readonly country: string | null;
  readonly state: string | null;
  readonly locality: string | null;
  readonly organization: string | null;
  readonly organizationalUnit: string | null;
  readonly email: string | null;
}

export function isIDistinguishedNameS(object: any): object is IDistinguishedNameS {
  if (typeof object !== "object") {
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