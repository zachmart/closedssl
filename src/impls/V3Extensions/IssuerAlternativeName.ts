"use strict";
import {AltNameStore} from "./AltNameStore";
import {IIssuerAlternativeName} from "../../interfaces/V3Extensions/IIssuerAlternativeName";

/**
 * Created by zacharymartin on July 27, 2016.
 */

export class IssuerAlternativeName extends AltNameStore implements IIssuerAlternativeName{

  constructor(altNames: Array<string |
                        {value: string, type: "URI" | "IP" | "DNS" | "EMAIL" | "OTHER"}>){
    super("issuerAltName", altNames);
  }
}