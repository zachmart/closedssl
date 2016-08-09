"use strict";
import {isPosiviteInteger} from "../utilities/utilities";

/**
 * Created by zacharymartin on July 16, 2016.
 */

export interface ICertOptions {
  serial: number;
  hash: "sha1" | "sha256" | "md5";
  startDate: Date | number;
  endDate: Date | number;
  jsonObject?: ICertOptions;
}

export function isICertOptions(object: any): object is ICertOptions {
  if (!object) {
    return false;
  }

  if (!isPosiviteInteger(object.serial)) {
    return false;
  }

  if (object.hash !== "sha1" && object.hash !== "sha256" && object.hash !== "md5") {
    return false;
  }

  if (typeof object.startDate !== "number" && !(object.startDate instanceof Date)){
    return false;
  }

  if (typeof object.endDate !== "number" && !(object.endDate instanceof Date)){
    return false;
  }

  if (object.jsonObject) {
    if (!isICertOptions(object.jsonObject)) {
      return false;
    }
  }

  return true;
}

