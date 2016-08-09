"use strict";

/**
 * Created by zacharymartin on July 12, 2016.
 */

export interface IAlternativeName {
  readonly type: "URI" | "IP" | "DNS" | "EMAIL" | "OTHER";
  readonly value: string;
  readonly _ext?: any;
}

export function isIAlternativeName(object: any): object is IAlternativeName {
  if (!object || typeof object !== "object"){
    return false;
  }

  if (!object.type || (object.type !== "URI" &&
                       object.type !== "IP" &&
                       object.type !== "DNS" &&
                       object.type !== "EMAIL" &&
                       object.type !== "OTHER")){
    return false;
  }

  if (!object.value || typeof object.value !== "string") {
    return false;
  }

  return true;
}