"use strict";
import {IDistinguishedName, isIDistinguishedName} from "../interfaces/IDistinguishedName";

/**
 * Created by zacharymartin on July 22, 2016.
 */

const DEFAULT_COMMON_NAME = "localhost";

export class DistinguishedName implements IDistinguishedName {
  private readonly _commonName: string | null;
  private readonly _country: string | null;
  private readonly _state: string | null;
  private readonly _locality: string | null;
  private readonly _organization: string | null;
  private readonly _organizationalUnit: string | null;
  private readonly _email: string | null;

  constructor(commonName?: string | null,
              country?: string | null,
              state?: string | null,
              locality?: string | null,
              organization?: string | null,
              organizationalUnit?: string | null,
              email?: string | null);
  constructor(jsonObj: IDistinguishedName);

  constructor(arg1?: IDistinguishedName | string | null,
              country?: string | null,
              state?: string | null,
              locality?: string | null,
              organization?: string | null,
              organizationalUnit?: string | null,
              email?: string | null) {

    if (typeof arg1 === "string" || typeof arg1 === "undefined" || arg1 === null) {
      // error checking
      if (typeof country !== "string" &&
          typeof country !== "undefined" &&
          country !== null) {
        throw new Error (`Incorrect country provided to DistinguishedName${""
          } constructor: ${country}`);
      }

      if (typeof state !== "string" &&
          typeof state !== "undefined" &&
          state !== null) {
        throw new Error (`Incorrect state provided to DistinguishedName${""
          } constructor: ${state}`);
      }

      if (typeof locality !== "string" &&
          typeof locality !== "undefined" &&
          locality !== null) {
        throw new Error (`Incorrect locality provided to DistinguishedName${""
          } constructor: ${locality}`);
      }

      if (typeof organization !== "string" &&
          typeof organization !== "undefined" &&
          organization !== null) {
        throw new Error (`Incorrect organization provided to DistinguishedName${""
          } constructor: ${organization}`);
      }

      if (typeof organizationalUnit !== "string" &&
          typeof organizationalUnit !== "undefined" &&
          organizationalUnit !== null) {
        throw new Error (`Incorrect organizational unit provided to DistinguishedName${""
          } constructor: ${organizationalUnit}`);
      }

      if (typeof email !== "string" &&
          typeof email !== "undefined" &&
          email !== null) {
        throw new Error (`Incorrect email provided to DistinguishedName${""
          } constructor: ${email}`);
      }

      this._commonName = arg1 ? arg1 : null;
      this._country = country ? country : null;
      this._state = state ? state : null;
      this._locality = locality ? locality : null;
      this._organization = organization ? organization : null;
      this._organizationalUnit = organizationalUnit ? organizationalUnit : null;
      this._email = email ? email : null;

    } else if (isIDistinguishedName(arg1)) {

      this._commonName = arg1.commonName;
      this._country = arg1.country;
      this._state = arg1.state;
      this._locality = arg1.locality;
      this._organization = arg1.organization;
      this._organizationalUnit = arg1.organizationalUnit;
      this._email = arg1.email;
    } else {
      throw new Error(`Incorrect arguments supplied to DistinguishedName constructor${""
      }, the first supplied argument was "${arg1}", which should be undefined, null, ${""
      } an object implementing the IDistinguishedName interface, or a string.`);
    }

    // make sure at least one field in the Distinguished Name is filled in
    if (!this._commonName &&
      !this._country &&
      !this._state &&
      !this._locality &&
      !this._organization &&
      !this._organizationalUnit &&
      !this._email) {
      this._commonName = DEFAULT_COMMON_NAME;
    }
  }

  get commonName(): string | null {
    return this._commonName;
  }

  get country(): string | null {
    return this._country;
  }

  get state(): string | null {
    return this._state;
  }

  get locality(): string | null {
    return this._locality;
  }

  get organization(): string | null {
    return this._organization;
  }

  get organizationalUnit(): string | null {
    return this._organizationalUnit;
  }

  get email(): string | null {
    return this._email;
  }

  get jsonObject(): IDistinguishedName {
    return {
      commonName: this._commonName,
      country: this._country,
      state: this._state,
      locality: this._locality,
      organization: this._organization,
      organizationalUnit: this._organizationalUnit,
      email: this._email
    };
  }

  get forgeSubjectAttributesArray(): {value: string, shortName: string, name: string}[] {
    const result: {value: string, shortName: string, name: string}[] = [];

    if (this._commonName){
      result.push({
        value: this._commonName,
        shortName: "CN",
        name: "commonName"
      });
    }

    if (this._country){
      result.push({
        value: this._country,
        shortName: "C",
        name: "countryName"
      });
    }

    if (this._state){
      result.push({
        value: this._state,
        shortName: "ST",
        name: "stateOrProvinceName"
      });
    }

    if (this._locality){
      result.push({
        value: this._locality,
        shortName: "L",
        name: "localityName"
      });
    }

    if (this._organization){
      result.push({
        value: this._organization,
        shortName: "O",
        name: "organizationName"
      });
    }

    if (this._organizationalUnit){
      result.push({
        value: this._organizationalUnit,
        shortName: "OU",
        name: "organizationalUnitName"
      });
    }

    if (this._email){
      result.push({
        value: this._email,
        shortName: "E",
        name: "emailAddress"
      });
    }

    return result;
  }

  public equals(that: any): boolean {
    return isIDistinguishedName(that) &&
           this.commonName === that.commonName &&
           this.country === that.country &&
           this.state === that.state &&
           this.locality === that.locality &&
           this.organization === that.organization &&
           this.organizationalUnit === that.organizationalUnit &&
           this.email === that.email;
  }

  public toString(): string {
    let result = "";

    if (this._commonName){
      result += `/CN=${this._commonName}`;
    }

    if (this._country){
      result += `/C=${this._country}`;
    }

    if (this._state){
      result += `/ST=${this._state}`;
    }

    if (this._locality){
      result += `/L=${this._locality}`;
    }

    if (this._organization){
      result += `/O=${this._organization}`;
    }

    if (this._organizationalUnit){
      result += `/OU=${this._organizationalUnit}`;
    }

    if (this._email){
      result += `/emailAddress=${this._email}`;
    }

    return result;
  }

  public static forgeCSROrCertToIDN(forgeCSROrCert: any,
                                    type: "subject" | "issuer" = "subject"):
  IDistinguishedName {
    let commonName: string | null = null;
    let country: string | null = null;
    let state: string | null = null;
    let locality: string | null = null;
    let organization: string | null = null;
    let organizationalUnit: string | null = null;
    let email: string | null = null;

    let attrs: any[];

    if (type === "subject") {
      attrs = forgeCSROrCert.subject.attributes;
    } else if (type === "issuer") {
      attrs = forgeCSROrCert.issuer.attributes;
    } else {
      throw new Error(`Unrecognized type: ${type}`)
    }

    for (let element of attrs){
      if (element.shortName === "CN" || element.name === "commonName"){
        commonName = element.value;
      }

      if (element.shortName === "C" || element.name === "countryName"){
        country = element.value;
      }

      if (element.shortName === "ST" || element.name === "stateOrProvinceName"){
        state = element.value;
      }

      if (element.shortName === "L" || element.name === "localityName"){
        locality = element.value;
      }

      if (element.shortName === "O" || element.name === "organizationName"){
        organization = element.value;
      }

      if (element.shortName === "OU" || element.name === "organizationalUnitName"){
        organizationalUnit = element.value;
      }

      if (element.shortName === "E" || element.name === "emailAddress"){
        email = element.value;
      }
    }

    return new DistinguishedName(commonName,
      country,
      state,
      locality,
      organization,
      organizationalUnit,
      email);
  }
}