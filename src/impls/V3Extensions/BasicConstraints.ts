"use strict";
import {
  IBasicConstraints,
  isIBasicConstraints
} from "../../interfaces/V3Extensions/IBasicConstraints";
import {V3Extension} from "./V3Extension";

/**
 * Created by zacharymartin on July 12, 2016.
 */
type ConstructorObjArg = {
  ca: boolean, 
  pathLengthConstraint?: number | null;
};

const DEFAULT_CONSTRUCT_OBJ_ARG: ConstructorObjArg = {
  ca: false
};

export class BasicConstraints extends V3Extension implements IBasicConstraints {
  private readonly _ca: boolean;
  private readonly _pathLengthConstraint: number | null;

  // constructor A signature
  constructor(ca: boolean, pathLengthConstraint?: number);
  // constructor B signature
  constructor(obj?: {ca: boolean, pathLengthConstraint?: number | null;});

  constructor(arg1: ConstructorObjArg | boolean = DEFAULT_CONSTRUCT_OBJ_ARG,
              arg2?: number | null) {
    super("basicConstraints");
    const constructorA = typeof arg1 === "boolean";
    const certAuth: boolean = constructorA ? <boolean>arg1 : (<ConstructorObjArg>arg1).ca;
    const pathLen: number| null | undefined = constructorA ?
      arg2
      : 
      (<ConstructorObjArg>arg1).pathLengthConstraint;
    

    if (typeof pathLen === "number") {
      if (certAuth === false) {
        throw new Error(`A BasicConstraints object cannot be constructed with CA set${"" 
          } to true and a\ndefined numeric path length constraint`);
      } else if (pathLen < 0) {
        throw new Error(`A BasicConstraints object cannot be constructed with a${""
          } negative path length constraint.\nGiven path length constraint: ${pathLen}.`);
      } else if (!Number.isInteger(pathLen)) {
        throw new Error(`A BasicConstraints object cannot be constructed with a${""
          } non-integer path length constraint.\nGiven path length constraint: ${pathLen
          }.`);
      }
    }

    this._ca = certAuth;
    this._pathLengthConstraint = pathLen || null;
  }

  get ca(): boolean {
    return this._ca;
  }

  get pathLengthConstraint(): number | null {
    return this._pathLengthConstraint;
  }

  get _ext(): {} {

    let result: {} = {
      name: this._name,
      cA: this._ca
    };

    if (this._pathLengthConstraint !== null) {
      result["pathLenConstraint"] = this._pathLengthConstraint;
    }

    return result;
  }

  equals(that: any): boolean {
    if (!isIBasicConstraints(that)){
      return false;
    }

    if (this.ca !== that.ca || this.pathLengthConstraint !== that.pathLenConstraint){
      return false;
    }

    return true;
  }
}