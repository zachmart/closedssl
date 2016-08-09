"use strict";
import {AltNameStore} from "./AltNameStore";
import {ICRLDistributionPoints} from "../../interfaces/V3Extensions/ICRLDistributionPoints";

/**
 * Created by zacharymartin on July 27, 2016.
 */

export class CRLDistributionPoints extends AltNameStore implements ICRLDistributionPoints
{
  constructor(altNames: Array<string |
                        {value: string, type: "URI" | "IP" | "DNS" | "EMAIL" | "OTHER"}>){
    super("cRLDistributionPoints", altNames);
  }
}