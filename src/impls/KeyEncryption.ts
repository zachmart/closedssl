"use strict";
import {IKeyEncryption} from "../interfaces/IKeyEncryption";
import {contains} from "../utilities/utilities";

/**
 * Created by zacharymartin on July 19, 2016.
 */

const RECOGNIZED_ALGORITHMS: string[] = [
  "aes128",
  "aes192",
  "aes256",
  "3des",
  "des"
];

const DEFAULT_VALUES: {
  algorithm: "aes128" | "aes192" | "aes256" | "3des" | "des",
  legacy: boolean
} = {
  algorithm: "3des",
  legacy: false
};

export class KeyEncryption implements IKeyEncryption {
  private readonly _password: string;
  private readonly _algorithm: "aes128" | "aes192" | "aes256" | "3des" | "des";
  private readonly _legacy: boolean;

  constructor (obj: IKeyEncryption);
  constructor (password: string,
               algorithm?: "aes128" | "aes192" | "aes256" | "3des" | "des",
               legacy?: boolean);
  constructor(arg1: IKeyEncryption | string,
              algorithm: "aes128" | "aes192" | "aes256" | "3des" | "des"
                = DEFAULT_VALUES.algorithm,
              legacy: boolean = DEFAULT_VALUES.legacy) {
    if (typeof arg1 === "object") {
      this._password = arg1.password;
      this._algorithm = arg1.algorithm;
      this._legacy = arg1.legacy;
    } else if (typeof arg1 === "string") {
      this._password = arg1;
      this._algorithm = algorithm;
      this._legacy = legacy;
    }

    if (!this._password) {
      throw new Error(`Cannot construct a new KeyEncryption object with no password:${""
      } ${this.password}`);
    }

    if (typeof this._password !== "string"){
      throw new Error(`Cannot construct a new KeyEncryption object with a non-string${""
      } password, password type: ${typeof this._password}`);
    }

    if (!this._algorithm) {
      throw new Error(`Cannot construct a new KeyEncryption object with no algorithm:${""
        } ${this.algorithm}`);
    }

    if (typeof this._algorithm !== "string"){
      throw new Error(`Cannot construct a new KeyEncryption object with a non-string${""
        } algorithm, algorithm type: ${typeof this._password}`);
    }

    if (!contains(RECOGNIZED_ALGORITHMS, this._algorithm)) {
      throw new Error(`The algorithm: ${this._algorithm}, is not recognized for ${""
      }constructing a KeyEncryption object`);
    }

    if (typeof this._legacy !== "boolean"){
      throw new Error(`Cannot construct a new KeyEncryption object with a non-boolean${""
      } legacy value, type of legacy value: ${typeof this._legacy}`);
    }
  }

  get password(): string {
    return this._password;
  }

  get algorithm(): "aes128" | "aes192" | "aes256" | "3des" | "des" {
    return this._algorithm;
  }

  get legacy(): boolean {
    return this._legacy;
  }

  get jsonObject(): IKeyEncryption {
    return {
      password: this._password,
      algorithm: this._algorithm,
      legacy: this._legacy
    }
  }
}
