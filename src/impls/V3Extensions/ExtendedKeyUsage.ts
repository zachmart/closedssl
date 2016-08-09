"use strict";
import {V3Extension} from "./V3Extension";
import {
  IExtendedKeyUsage,
  isIExtendedKeyUsage,
  COMMON_USAGES
} from "../../interfaces/V3Extensions/IExtendedKeyUsage";
import {contains, copy} from "../../utilities/utilities";

/**
 * Created by zacharymartin on July 12, 2016.
 */

export class ExtendedKeyUsage extends V3Extension 
implements IExtendedKeyUsage, Iterable<string> {
  
  private readonly _usages: string[];

  constructor(usages: string[] = COMMON_USAGES) {
    super("extKeyUsage");
    this._usages = copy(usages);
  }

  get serverAuth(): boolean {
    return this.isValidUsage("serverAuth");
  }

  get clientAuth(): boolean {
    return this.isValidUsage("clientAuth");
  }

  get codeSigning(): boolean {
    return this.isValidUsage("codeSigning");
  }

  get emailProtection(): boolean {
    return this.isValidUsage("emailProtection");
  }

  get timeStamping(): boolean {
    return this.isValidUsage("timeStamping");
  }
  
  get usages(): string[] {
    return copy<string>(this._usages);
  }

  public isValidUsage(usage: string): boolean{
    return contains(this._usages, usage);
  }

  get _ext(): any {
    const result = {};

    for (let usage of this._usages) {
      result[usage] = true;
    }

    return result;
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

  equals(that: any): boolean {
    if (!isIExtendedKeyUsage(that)) {
      return false;
    }

    // let thatCast: IExtendedKeyUsage = <IExtendedKeyUsage>that;

    for (let thisUsage of this.usages) {
      if (!contains(that.usages, thisUsage)) {
        return false;
      }
    }

    for (let thatUsage of that.usages) {
      if (!contains(this.usages, thatUsage)) {
        return false;
      }
    }

    return true;
  }

  static get commonUsages(): string[] {
    return COMMON_USAGES;
  }
}
