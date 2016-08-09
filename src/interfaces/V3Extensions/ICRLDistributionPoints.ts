"use strict";
import {IAltNameStore, isAltNameStore} from "./IAltNameStore";

/**
 * Created by zacharymartin on July 27, 2016.
 */

export interface ICRLDistributionPoints extends IAltNameStore {

}

export function isICRLDistributionPoints(object: any): object is ICRLDistributionPoints
{
  if (!isAltNameStore(object)){
    return false;
  }

  if (!object._name || object._name !== "cRLDistributionPoints") {
    return false;
  }

  return true;
}