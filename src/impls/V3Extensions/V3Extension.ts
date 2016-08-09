"use strict";
import {IV3Extension} from "../../interfaces/V3Extensions/IV3Extension";


/**
 * Created by zacharymartin on July 12, 2016.
 */

export abstract class V3Extension implements IV3Extension {
  private readonly __name: string;

  constructor(name: string){
    this.__name = name;
  }

  get _name(): string {
    return this.__name;
  }

  abstract get _ext(): {};

  abstract equals(that: any): boolean;
}

