"use strict";

import {BasicConstraints} from "../impls/V3Extensions/BasicConstraints";
import {KeyUsage} from "../impls/V3Extensions/KeyUsage";
import {ExtendedKeyUsage} from "../impls/V3Extensions/ExtendedKeyUsage";
import {SubjectAlternativeName} from "../impls/V3Extensions/SubjectAlternativeName";
import {IssuerAlternativeName} from "../impls/V3Extensions/IssuerAlternativeName";
import {CRLDistributionPoints} from "../impls/V3Extensions/CRLDistributionPoints";
import {IV3Extension} from "../interfaces/V3Extensions/IV3Extension";

/**
 * Created by zacharymartin on July 27, 2016.
 */



export function forgeCSROrCertToV3ExtensionArray(forgeCSRorCert: any): IV3Extension[] {
  const result: IV3Extension[] = [];

  let exts: any[];

  if (forgeCSRorCert.extensions) {
    exts = forgeCSRorCert.extensions;
  } else if (forgeCSRorCert.getAttribute({name: "extensionRequest"})) {
    exts = forgeCSRorCert.getAttribute({name: "extensionRequest"}).extensions;
  } else {
    exts = [];
  }

  for (let element of exts){
    switch (element.name) {
      case "basicConstraints":
        result.push(new BasicConstraints(element.cA, element.pathLenConstraint));
        break;
      case "keyUsage":
        let keyUsages: string[] = [];

        for (let possibleUsage of KeyUsage.possibleUsages()){
          if (element[possibleUsage] === true) {
            keyUsages.push(possibleUsage);
          }
        }

        result.push(new KeyUsage(keyUsages));
        break;
      case "extKeyUsage":
        let usages: string[] = [];

        for (let usage in element) {
          if (usage !== "name") {
            usages.push(usage);
          }
        }

        result.push(new ExtendedKeyUsage(usages));
        break;
      case "subjectAltName":
      case "issuerAltName":
        let altNames: string[] = [];

        for (let altName of element.altNames) {
          if (altName.ip) {
            altNames.push(altName.ip);
          } else if (altName.value) {
            altNames.push(altName.value);
          }
        }
        if (element.name === "subjectAltName") {
          result.push(new SubjectAlternativeName(altNames));
        } else if (element.name ==="issuerAltName") {
          result.push(new IssuerAlternativeName(altNames));
        } else if (element.name === "cRLDistributionPoints"){
          result.push(new CRLDistributionPoints(altNames));
        }
        break;
      // case "subjectKeyIdentifier":
      //   break;
      // case "authorityKeyIdentifier":
      //   break;
      // case "certificatePolicies":
      //   break;
      // case "cRLDistributionPoints":
      //   break;
      default:
        console.error(`Unrecognized V3 Extension: ${element.name}`);
        break;
    }
  }

  return result;
}