"use strict";

import {should} from "chai";
import {

} from "../index"

/**
 * Created by zacharymartin on August 05, 2016.
 */

// create root CA1
const rootCA1subj = new DistinguishedName(
  "Root CA number 1",
  "CO",
  "Antioquia",
  "Medellin",
  "org",
  "testing",
  "test@example.com");

const rootCA1V3Exts = [
  new BasicConstraints(true, 4),
  new KeyUsage(["keyCertSign", "cRLSign"])
];

const rootCA1Options = new CertOptions(3650, 1, "sha256");

let rootCA1promise = generate.cert(
  {subject: rootCA1subj},
  null,
  rootCA1V3Exts,
  rootCA1Options
);

// create rootCA2 - note rootCA2 has same subject as root CA1
const rootCA2subj = new DistinguishedName(
  "Root CA number 1",
  "CO",
  "Antioquia",
  "Medellin",
  "org",
  "testing",
  "test@example.com");

const rootCA2V3Exts = [
  new BasicConstraints(true, 3),
  new KeyUsage(["keyCertSign", "cRLSign", "digitalSignature"])
];

const rootCA2Options = new CertOptions(500, 2, "md5");

let rootCA2promise = generate.cert(
  {subject: rootCA2subj},
  null,
  rootCA2V3Exts,
  rootCA2Options
);

// create