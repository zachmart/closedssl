"use strict";
import {IAltNameStore, isAltNameStore} from "./IAltNameStore";

/**
 * Created by zacharymartin on July 27, 2016.
 */

export interface IIssuerAlternativeName extends IAltNameStore {

}

export function isIIssuerAlternativeName(object: any): object is IIssuerAlternativeName {
  if (!isAltNameStore(object)) {
    return false;
  }

  if (!object._name || object._name !== "issuerAltName") {
    return false;
  }

  return true;
}