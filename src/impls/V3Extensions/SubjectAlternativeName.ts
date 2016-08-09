"use strict";
import {AltNameStore} from "./AltNameStore";
import {IAlternativeName} from "../../interfaces/V3Extensions/IAlternativeName";
import {ISubjectAlternativeName} from "../../interfaces/V3Extensions/ISubjectAlternativeName";

/**
 * Created by zacharymartin on July 27, 2016.
 */

export class SubjectAlternativeName
extends AltNameStore
implements ISubjectAlternativeName {

  constructor(altNames: Array<string |
                        {value: string, type: "URI" | "IP" | "DNS" | "EMAIL" | "OTHER"}>){

    super("subjectAltName", altNames);
  }

}