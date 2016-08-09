"use strict";
import {V3Extension} from "./V3Extension";
import {IKeyUsage,
        POSSIBLE_USAGES,
        isIKeyUsage} from "../../interfaces/V3Extensions/IKeyUsage";
import {contains, copy} from "../../utilities/utilities"
import {IEquitable} from "../../interfaces/IEquitable";

/**
 * Created by zacharymartin on July 12, 2016.
 */



export class KeyUsage extends V3Extension implements IKeyUsage {
  private readonly _usages: string[];

  constructor(usages: string[] = POSSIBLE_USAGES) {
    super("keyUsage");
    for (let usage of usages) {
      if (!contains<string>(POSSIBLE_USAGES, usage)) {
        throw new Error(`The usage: "${usage} is not acceptable for a v3 keyUsage${""
          } extension`);
      }
    }
    
    this._usages = copy<string>(usages);
  }

  get digitalSignature(): boolean {
    return this.isValidUsage("digitalSignature");
  }

  get nonRepudiation(): boolean {
    return this.isValidUsage("nonRepudiation");
  }

  get keyEncipherment(): boolean {
    return this.isValidUsage("keyEncipherment");
  }

  get dataEncipherment(): boolean {
    return this.isValidUsage("dataEncipherment");
  }

  get keyAgreement(): boolean {
    return this.isValidUsage("keyAgreement");
  }

  get keyCertSign(): boolean {
    return this.isValidUsage("keyCertSign");
  }

  get cRLSign(): boolean {
    return this.isValidUsage("cRLSign");
  }

  get encipherOnly(): boolean {
    return this.isValidUsage("encipherOnly");
  }

  get decipherOnly(): boolean {
    return this.isValidUsage("decipherOnly");
  }

  get usages(): string[] {
    return copy<string>(this._usages);
  }
  
  public isValidUsage(usage: string): boolean{
    return contains(this._usages, usage);
  }

  get _ext(): any {
    const result: any = {};

    result.name = this._name;
    
    for (let usage of this._usages) {
      result[usage] = true;
    }
    
    return result;
  }

  equals(that: any): boolean {
    if (!isIKeyUsage(that)) {
      return false;
    }

    let thatCast: IKeyUsage = <IKeyUsage>that;
    
    for (let thisUsage of this.usages) {
      if (!contains(thatCast.usages, thisUsage)) {
        return false;
      }
    }

    for (let thatUsage of thatCast.usages) {
      if (!contains(this.usages, thatUsage)) {
        return false;
      }
    }

    return true;
  }

  [Symbol.iterator](): Iterator<string> {
    let position = 0;
    return {
      next: () => {
        return {
          value: this._usages[position++],
          done: (this._usages.length < position)
        }
      }
    }
  }
  
  static possibleUsages(): string[] {
    return POSSIBLE_USAGES;
  }
}