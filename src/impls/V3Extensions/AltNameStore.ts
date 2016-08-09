"use strict";
import * as validator from "validator";
import {IAlternativeName} from "../../interfaces/V3Extensions/IAlternativeName";
import {IAltNameStore, isAltNameStore} from "../../interfaces/V3Extensions/IAltNameStore";
import {AlternativeName} from "./AlternativeName";
import {copy, contains} from "../../utilities/utilities";
import {V3Extension} from "../../impls/V3Extensions/V3Extension";

/**
 * Created by zacharymartin on July 13, 2016.
 */

export abstract class AltNameStore extends V3Extension implements IAltNameStore{
  private _altNames: IAlternativeName[];
  private _length: number;
  
  constructor(name: string,
              altNames: Array<string |
                        {value: string, type: "URI" | "IP" | "DNS" | "EMAIL" | "OTHER"}>){
    super(name);

    if (!Array.isArray(altNames)) {
      throw new Error(`The altNames parameter must be a string array for the ${""
      }AltNameStore constructor, given:\n${altNames}`);
    }

    this._altNames = [];
    this._length = 0;

    for (let name of altNames) {
      if (typeof name !== "string"
          && (typeof name.value !== "string" ||
              name.type !== "URI" ||
              name.type !== "IP" ||
              name.type !== "DNS" ||
              name.type !== "EMAIL" ||
              name.type !== "OTHER")){
        throw new Error(`The altNames parameter must be an array containing strings or${""
        } objects with a valid value and type property for the${""
        } AltNameStore constructor, given:\n${altNames}`);
      }

      if (typeof name.value === "string"){
        this._altNames.push(new AlternativeName(name.type, name.value));
      } else {
        let type: "URI" | "IP" | "DNS" | "EMAIL" | "OTHER";

        const dnOpt = {
          require_tld: false,
          allow_underscores: false,
          allow_trailing_dot: true
        };

        if (validator.isIP(name)) {
          type = "IP";
        } else if (validator.isFQDN(name, dnOpt)) {
          type = "DNS";
        } else if (name.charAt(0) === "*" &&                      // wildcard case
          validator.isFQDN(name.substring(2), dnOpt)){
          type = "DNS";
        } else if (validator.isURL(name)) {
          type = "URI";
        } else if (validator.isEmail(name)) {
          type = "EMAIL";
        } else {
          type = "OTHER";
        }

        this._altNames.push(new AlternativeName(type, name));
      }

      this._length++;
    }
  }

  get length(): number {
    return this._length;
  }

  get altNames(): string[]{
    const result: string[] = [];

    for (let element of this._altNames){
      result.push(element.value);
    }

    return result;
  }

  get _ext(): any[] {
    const result: any[] = [];

    for (let element of this._altNames){
      result.push(element._ext)
    }

    return result;
  }

  [Symbol.iterator](): Iterator<string> {
    let position = 0;
    return {
      next: () => {
        return {
          value: this._altNames[position++].value,
          done: (this._length < position)
        }
      }
    }
  }

  equals(that: any): boolean {
    if (!isAltNameStore(that)) {
      return false;
    }

    if (this._name !== that._name) {
      return false;
    }

    for (let thisElement of this.altNames) {
      if (!contains(that.altNames, thisElement)){
        return false;
      }
    }

    for (let thatElement of that.altNames) {
      if (!contains(this.altNames, thatElement)){
        return false;
      }
    }

    return true;
  }
}