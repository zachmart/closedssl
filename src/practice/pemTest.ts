"use strict";

/**
 * Created by zacharymartin on July 11, 2016.
 */

const pemModule = require("pem");

pemModule.createCertificate({
  keyBitsize: 8192,
  hash: "sha256",
  country: "US",
  state: "Virginia",
  locality: null, //"Blacksburg",
  organization: "Test",
  organizationUnit: "Test",
  commonName: "example.org",
  altNames: ["http://example.org/webid#me", "127.0.0.1"],
  emailAddress: null,
  selfSigned: true,
  days: 365
}, (error, pem) => {
  if (error){
    console.log(error);
  } else {
    console.log(pem.certificate)
  }
});

interface ITest {
  readonly prop: string
}

class Test implements ITest {
  private _prop: string;

  constructor(prop: string) {
    this._prop = prop;
  }

  get prop(): string {
    return this._prop;
  }

  set prop(value: string) {
    this._prop = value;
  }
}

let test: ITest = new Test("test");

test.prop = "anotherTest";

test.prop = "yet another test";

console.log(test.prop);