"use strict";
import {ICert} from "./ICert";
import {isIterable} from "iteration-typeguards";

/**
 * Created by zacharymartin on August 04, 2016.
 */

export interface ICAStore extends Iterable<ICert>{
  readonly length: number;
  addCert: (cert: ICert | string) => void;
  removeCert: (cert: ICert | string) => ICert | null;
  listCerts: () => ICert[];
  listCertsAsPEMStrings: () => string[];
  hasCert: (cert: ICert | string) => boolean;
  verifySigningChain: (certChain: string | ICert[] | ICert) => boolean;
}

export function isICAStore(object: any): object is ICAStore {
  if (!object || typeof object !== "object") {
    return false;
  }

  if (!isIterable(object)) {
    return false;
  }

  if (typeof object.length !== "number" ||
      object.length < 0 ||
      !Number.isInteger(object.length)) {
    return false;
  }

  if (typeof object.addCert !== "function") {
    return false;
  }

  if (typeof object.removeCert !== "function") {
    return false;
  }

  if (typeof object.listCerts !== "function") {
    return false;
  }

  if (typeof object.listCertsAsPEMStrings !== "function") {
    return false;
  }

  if (typeof object.hasCert !== "function") {
    return false;
  }

  if (typeof object.verifySigningChain !== "function") {
    return false;
  }

  return true;
}