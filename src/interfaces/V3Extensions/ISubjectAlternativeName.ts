"use strict";
import {IAltNameStore, isAltNameStore} from "./IAltNameStore";


/**
 * Created by zacharymartin on July 27, 2016.
 */

export interface ISubjectAlternativeName extends IAltNameStore {

}

export function isISubjectAlternativeName(object: any): object is ISubjectAlternativeName
{
  if (!isAltNameStore(object)){
    return false;
  }

  if (!object._name || object._name !== "subjectAltName") {
    return false;
  }

  return true;
}