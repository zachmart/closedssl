"use strict";
import {IAlternativeName} from "../../interfaces/V3Extensions/IAlternativeName";

/**
 * Created by zacharymartin on July 12, 2016.
 */

const TYPE_INT_MAP = {
  "OTHER": 0,
  "EMAIL": 1,
  "DNS": 2,
  "URI": 6,
  "IP": 7
};

export class AlternativeName implements IAlternativeName{
  private readonly _type: "URI" | "IP" | "DNS" | "EMAIL" | "OTHER";
  private readonly _value: string;

  // constructor A signature
  constructor(type: "URI" | "IP" | "DNS" | "EMAIL" | "OTHER", value: string);
  // constructor B signature
  constructor(object: IAlternativeName);

  constructor(arg1: "URI" | "IP" | "DNS" | "EMAIL" | "OTHER" | IAlternativeName,
              arg2?: string) {
    let constructorA = (arg1 === "URI" ||
                        arg1 === "IP" ||
                        arg1 === "DNS" ||
                        arg1 === "EMAIL" ||
                        arg1 === "OTHER");

    this._type = constructorA ? <"URI" | "IP">arg1 : (<IAlternativeName>arg1).type;
    this._value = constructorA ? <string>arg2 : (<IAlternativeName>arg1).value;
  }

  get type(): "URI" | "IP" | "DNS" | "EMAIL" | "OTHER" {
    return this._type;
  }

  get value(): string {
    return this._value;
  }

  get _ext(): any {
    if (this._type === "IP") {
      return {
        type: TYPE_INT_MAP[this._type],
        ip: this._value
      };
    } else {
      return {
        type: TYPE_INT_MAP[this._type],
        value: this._value
      };
    }
  }
}