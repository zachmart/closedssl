"use strict";

/**
 * Created by zacharymartin on July 19, 2016.
 */

export interface IKeyEncryption {
  password: string;
  algorithm: "aes128" | "aes192" | "aes256" | "3des" | "des";
  legacy: boolean;
  jsonObject?: IKeyEncryption
}

export function isIKeyEncryption(object: any): object is IKeyEncryption {
  if (!object || typeof object !== "object"){
    return false;
  }

  if (!object.password || typeof object.password !== "string"){
    return false;
  }

  if (!object.algorithm || (object.algorithm !== "aes128" &&
      object.algorithm !== "aes192" &&
      object.algorithm !== "aes256" &&
      object.algorithm !== "3des" &&
      object.algorithm !== "des")){
    return false;
  }

  if (!object.legacy || typeof object.legacy !== "boolean"){
    return false;
  }

  return true;
}
