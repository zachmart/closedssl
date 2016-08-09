"use strict";
import {IKey} from "../../lib/interfaces/IKey";

/**
 * Created by zacharymartin on July 16, 2016.
 */

export interface IKeyOptions {
  readonly numBits: number
  readonly password: string;
  readonly algorithm: "aes128" | "aes192" | "aes256" | "3des" | "des",
  readonly iterationCount: number,
  readonly saltSize: number,
  readonly legacy: boolean,
  readonly jsonObject?: IKeyOptions;
}