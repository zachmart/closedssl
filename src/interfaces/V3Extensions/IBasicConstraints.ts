"use strict";
import {IV3Extension, isIV3Extension} from "./IV3Extension";

/**
 * Created by zacharymartin on July 12, 2016.
 */

export interface IBasicConstraints extends IV3Extension {
  readonly ca: boolean;
  readonly pathLengthConstraint: number | null;
}

export function isIBasicConstraints(object: any) {
  // test that isIV3Extension and _name prop is equal to "keyUsage"
  if (!isIV3Extension(object) || object._name !== "basicConstraints") {
    return false;
  }

  if (typeof object.ca !== "boolean") {
    return false;
  }

  if (typeof object.pathLengthConstraint !== "number"
    && object.pathLengthConstraint !== null) {
    return false;
  }

  return true;
}