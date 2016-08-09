"use strict";

import {should} from "chai";
import * as closedSSL from "../index";

/**
 * Created by zacharymartin on August 05, 2016.
 */

// create root CA1
const rootCA1subj = closedSSL.distinguishedName({
  commonName: "Root CA number 1",
  country: "CO",
  state: "Antioquia",
  locality: "Medellin",
  organization: "org",
  organizationalUnit: "testing",
  email: "test@example.com"});

const rootCA1V3Exts = [
  closedSSL.v3Ext.basicConstraints({ca: true, pathLengthConstraint: 4}),
  closedSSL.v3Ext.keyUsage(["keyCertSign", "cRLSign"])
];

const rootCA1Options = closedSSL.certOptions({days: 3650, serial: 1, hash: "sha256"});

let rootCA1promise = closedSSL.generate.cert(
  {subject: rootCA1subj},
  null,
  rootCA1V3Exts,
  rootCA1Options
);

// create rootCA2 - note rootCA2 has same subject as root CA1
const rootCA2subj = rootCA1subj;

const rootCA2V3Exts = [
  closedSSL.v3Ext.basicConstraints({ca: true, pathLengthConstraint: 3}),
  closedSSL.v3Ext.keyUsage(["keyCertSign", "cRLSign", "digitalSignature"])
];

const rootCA2Options = closedSSL.certOptions({
  days: 500,
  serial: 2,
  hash: "md5",
  startDate: new Date()
});

let rootCA2promise = closedSSL.generate.cert(
  {subject: rootCA2subj},
  null,
  rootCA2V3Exts,
  rootCA2Options
);

// create rootCA3

const rootCA3subj = closedSSL.distinguishedName({
  commonName: "Root CA #3",
  country: "US",
  state: "Massachusetts",
  locality: "Boston",
  organization: "closedSSL",
  organizationalUnit: "tests",
  email: "testing@closedSSL.org"});

const rootCA3V3Exts = [
  closedSSL.v3Ext.basicConstraints({ca: true}),
  closedSSL.v3Ext.keyUsage(["keyCertSign"]),
  closedSSL.v3Ext.subjectAlternativeName([
    "testing.closedSSL.com",
    "test@closedSSL.com",
    "44.47.74.77"
  ])
];

const rootCA3Options = closedSSL.certOptions({
  days: 47,
  serial: 47,
  hash: "sha1",
  startDate: new Date()
});

const rootCA3Key = closedSSL.generate.privateKeySync(
  1024,
  closedSSL.keyEncryption({password: "test#3", algorithm: "aes256", legacy: true}),
  3);

const rootCA3CSR = closedSSL.generate.csrSync(
  rootCA3subj,
  rootCA3V3Exts,
  rootCA3Key,
  "md5",
  "testChallengePassword",
  "testUnstructuredName");

const rootCA3cert = closedSSL.generate.certSync(
  rootCA3CSR.csr,
  rootCA3Key,
  rootCA3CSR.csr.v3Extensions,
  rootCA3Options).cert;

Promise.all([rootCA1promise, rootCA2promise]).then((resolvedValues) => {
  const [rootCA1Val, rootCA2Val] = resolvedValues;
  const rootCA1cert = rootCA1Val.cert;
  const rootCA2cert = rootCA2Val.cert;

  console.log(rootCA1cert);
  console.log(rootCA2cert);
  console.log(rootCA3cert);
});