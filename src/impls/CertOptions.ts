"use strict";
import {ICertOptions, isICertOptions} from "../interfaces/ICertOptions";
import {isPosiviteInteger} from "../utilities/utilities";

/**
 * Created by zacharymartin on August 02, 2016.
 */

const DEFAULT_DAYS = 365;
const DEFAULT_HASH: "sha1" | "sha256" | "md5" = "sha256";
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export class CertOptions implements ICertOptions {
  private readonly _serial: number;
  private readonly _hash: "sha1" | "sha256" | "md5";
  private readonly _startDate: Date;
  private readonly _endDate: Date;

  constructor(days?: number | null,
              serial?: number | null,
              hash?: "sha1" | "sha256" | "md5" | null,
              startDate?: Date | null);
  constructor(object: ICertOptions);

  constructor(arg1?: number | ICertOptions | null,
              serial?:number | null,
              hash?: "sha1" | "sha256" | "md5" | null,
              startDate?: Date | null) {
    if (isPosiviteInteger(arg1) || typeof arg1 === "undefined" || arg1 === null) {
      if (startDate instanceof Date) {
        this._startDate = startDate;
      } else if (startDate === null || typeof startDate === "undefined") {
        this._startDate = new Date();
      } else {
        throw new Error(`The CertOptions constructor argument "startDate" must be${""
        } a Date object, null, or undefined, given ${startDate}`);
      }

      let days: number;

      if (isPosiviteInteger(arg1)){
        days = <number>arg1;
      } else if (arg1 === null || typeof arg1 === "undefined") {
        days = DEFAULT_DAYS
      } else {
        throw new Error(`The CertOptions constructor argument "days" must be${""
        } a positive integer, null, or undefined, given ${arg1}`);
      }

      this._endDate = new Date(this._startDate.getTime() + (MS_PER_DAY * days));

      if (isPosiviteInteger(serial)) {
        this._serial = <number>serial;
      } else if (serial === null || typeof serial === "undefined") {
        this._serial = 1;
      } else {
        throw new Error(`The CertOptions constructor argument "serial" must be${""
        } a positive integer, null, or undefined , given ${serial}`);
      }

      if (hash === "sha1" || hash === "sha256" || hash === "md5") {
        this._hash = <"sha1" | "sha256" | "md5">hash;
      } else if (hash === null || typeof hash === "undefined") {
        this._hash = DEFAULT_HASH;
      } else {
        throw new Error(`The CertOptions constructor argument "hash" must be${""
        } equal to "sha1", "sha256", "md5", null, or undefined, given ${hash}`);
      }
    } else if (isICertOptions(arg1)) {
      this._startDate = arg1.startDate instanceof Date ?
        arg1.startDate
        :
        new Date(arg1.startDate);
      this._endDate = arg1.endDate instanceof Date ?
        arg1.endDate
        :
        new Date(arg1.endDate);
      this._serial = arg1.serial;
      this._hash = arg1.hash;
    } else {
      throw new Error(`The first argument to the CertOptions constructor should${""
      } be a positive integer for the number of days of certificate validity or${""
      } be an object conforming to the ICertOptions interface, given: ${arg1}`);
    }
  }

  get serial(): number {
    return this._serial;
  }

  get hash(): "sha1" | "sha256" | "md5" {
    return this._hash;
  }

  get startDate(): Date {
    return new Date(this._startDate.getTime());
  }

  get endDate(): Date {
    return new Date(this._endDate.getTime());
  }

  get jsonObject(): ICertOptions {
    return {
      serial: this._serial,
      hash: this._hash,
      startDate: this._startDate.getTime(),
      endDate: this._endDate.getTime()
    }
  }
}