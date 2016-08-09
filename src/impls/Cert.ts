"use strict";
import {ICert, isICert} from "../interfaces/ICert";
import {IDistinguishedName} from "../interfaces/IDistinguishedName";
import {IV3Extension} from "../interfaces/V3Extensions/IV3Extension";
import {DistinguishedName} from "./DistinguishedName";
import {forgeCSROrCertToV3ExtensionArray} from "../utilities/v3ExtUtil";
import {checkRadix} from "../utilities/utilities";
var forge = require("node-forge");

/**
 * Created by zacharymartin on July 27, 2016.
 */


export class Cert implements ICert {
  private readonly _publicKeyPEM: string;
  private readonly _numBits: number;
  private readonly _pem: string;
  private readonly _subject: IDistinguishedName;
  private readonly _issuer: IDistinguishedName;
  private readonly _v3Extensions: IV3Extension[];
  private readonly _serial: number;
  private readonly _hash: "md5" | "sha1" | "sha256" | "sha384" | "sha512";
  private readonly _startDate: Date;
  private readonly _endDate: Date;

  constructor(certPEM: string);
  constructor(object: ICert);

  constructor(arg: string | ICert) {
    if (isICert(arg)) {
      this._publicKeyPEM = arg.publicKeyPEM;
      this._numBits = arg.numBits;
      this._pem = arg.pem;
      this._subject = arg.subject;
      this._issuer = arg.issuer;
      this._v3Extensions = arg.v3Extensions;
      this._serial = arg.serial;
      this._hash = arg.hash;
      this._startDate = (typeof arg.startDate === "number") ?
        new Date(arg.startDate)
        :
        arg.startDate;
      this._endDate = (typeof arg.endDate === "number") ?
        new Date(arg.endDate)
        :
        arg.endDate;
    } else if (typeof arg === "string") {
      let forgeCert: any;

      try {
        forgeCert = forge.pki.certificateFromPem(arg, true, true);
      } catch (error) {
        throw new Error(`Could not construct Cert from given pem string "${arg}"${"\n"
          }issue: ${error.message}`);
      }
      this._publicKeyPEM = forge.pki.publicKeyToPem(forgeCert.publicKey);
      this._numBits = forgeCert.publicKey.n.bitLength();
      this._pem = arg;
      this._subject = DistinguishedName.forgeCSROrCertToIDN(forgeCert, "subject");
      this._issuer = DistinguishedName.forgeCSROrCertToIDN(forgeCert, "issuer");
      this._v3Extensions = forgeCSROrCertToV3ExtensionArray(forgeCert);
      this._serial = parseInt(forgeCert.serialNumber, 16);
      this._hash = forgeCert.md.algorithm;
      this._startDate = forgeCert.validity.notBefore;
      this._endDate = forgeCert.validity.notAfter;

      console.log("publicKey:", forgeCert.publicKey.n.bitLength());
    } else {
      throw new Error(`The Cert constructor argument "${arg}" is not acceptable`);
    }
  }

  get publicKeyPEM(): string {
    return this._publicKeyPEM;
  }

  get numBits(): number {
    return this._numBits;
  }

  get pem(): string {
    return this._pem;
  }

  get subject(): IDistinguishedName {
    return this._subject;
  }

  get issuer(): IDistinguishedName {
    return this._issuer;
  }

  get v3Extensions(): IV3Extension[] {
    return this._v3Extensions;
  }

  get serial(): number {
    return this._serial;
  }

  get hash(): "md5" | "sha1" | "sha256" | "sha384" | "sha512" {
    return this._hash;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  modulus(radix: number = 16): string {
    checkRadix(radix);
    const forgePublicKey = forge.pki.publicKeyFromPem(this._publicKeyPEM);
    return forgePublicKey.n.toString(radix);
  }

  publicExponent(radix: number = 16): string {
    checkRadix(radix);
    const forgePublicKey = forge.pki.publicKeyFromPem(this._publicKeyPEM);
    return forgePublicKey.e.toString(radix);
  }

  fingerprint(hash: "sha1" | "sha256" | "sha384" | "sha512" | "md5" = "sha1"): string {
    let md: any;
    const forgeCSR = forge.pki.certificateFromPem(this._pem, true, true);

    switch (hash) {
      case "sha1":
        md = forge.md.sha1.create();
        break;
      case "sha256":
        md = forge.md.sha256.create();
        break;
      case "sha384":
        md = forge.md.sha384.create();
        break;
      case "sha512":
        md = forge.md.sha512.create();
        break;
      case "md5":
        md = forge.md.md5.create();
        break;
      default:
        throw new Error(`Unrecognized message digest hash algorithm: ${hash}`);
    }

    const result = md
      .update(forge.asn1.toDer(forge.pki.certificateToAsn1(forgeCSR)).getBytes())
      .digest()
      .toHex();

    return result;
  }
}

const pem = `-----BEGIN CERTIFICATE-----\r
MIIDcDCCAlgCCQDRn53qX3qFIDANBgkqhkiG9w0BAQsFADB7MQswCQYDVQQGEwJV\r
UzEWMBQGA1UECAwNTWFzc2FjaHVzZXR0czEPMA0GA1UEBwwGQm9zdG9uMRowGAYD\r
VQQKDBFSZXN1bHQgUmVwb3NpdG9yeTEnMCUGA1UEAwweUlIgTW9uZ28gQ2VydGlm\r
aWNhdGUgQXV0aG9yaXR5MB4XDTE2MDYwOTE1NTIzNloXDTI0MDgyNjE1NTIzNlow\r
eTELMAkGA1UEBhMCVVMxFjAUBgNVBAgMDU1hc3NhY2h1c2V0dHMxDzANBgNVBAcM\r
BkJvc3RvbjEaMBgGA1UECgwRUmVzdWx0IFJlcG9zaXRvcnkxJTAjBgNVBAMMHGNv\r
bmZpZ2EucmVzdWx0cmVwb3NpdG9yeS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IB\r
DwAwggEKAoIBAQCs9o6vbRbF0w6rH5sz5agwvEvGMAGxz8bvL//4/AlAWQ2NSMUg\r
vXgHBTLo8AaAI1Y2brhjdMHUT/2weX4BZuBD9qYABKwQBkrmgexBhax+L0CbSGRE\r
2nczxbopm4u054pcCc3+tiHY833r0tos3luH9f3ANd25T4bNA1Wem9W0Ygu4ReId\r
UNHgoeou2/L6P2Dv5Yo0fKnjCXKyiFaT/fE2jwrzCLLGThPUdIrfkkcPekISLvnS\r
eXtxuSkyxrqLmG3tFmAa+zLcVsksj1jstfBqTu/+z6EOBFimVj4uNZYSLQnBjWJY\r
FeFXUQi9lPCJfPpagqhlZrMw2dBJyx0uozUnAgMBAAEwDQYJKoZIhvcNAQELBQAD\r
ggEBAGIbX7vb1/lA3I5MDQc2gMr7ANrH0BYrtcm1efNEaPewmlkZq9nY9kVCVTzX\r
0kIpd+WvLdDwNHzQbuFhQwKV2pUkHxBaFwMB3++taTM98OkACFupqKuo9Af7vntD\r
HCINNx4fZMhFlCHSFGU5lqGWNTPDUpXhwB0QBysGz1ivQG2pm3HH4SGkfNcVbdSA\r
GbxoJT7KnFGvX3vUgRWnEdiy4qrtFkmVO+jX4vu1oQcxM/5YFRIIbr521eACh/5z\r
E7MMvZXVdRwGdRgdtrnNmS8+jNGIpnbGQFCvLnxzFRhZox5iIvS/x2UaPP/EPsr0\r
tbv2rBQ664EVhuo17fa0hTWoroQ=\r
-----END CERTIFICATE-----\r
`;

const pem2 = `-----BEGIN CERTIFICATE-----\r
MIIENjCCAx6gAwIBAgIBATANBgkqhkiG9w0BAQUFADBvMQswCQYDVQQGEwJTRTEU\r
MBIGA1UEChMLQWRkVHJ1c3QgQUIxJjAkBgNVBAsTHUFkZFRydXN0IEV4dGVybmFs\r
IFRUUCBOZXR3b3JrMSIwIAYDVQQDExlBZGRUcnVzdCBFeHRlcm5hbCBDQSBSb290\r
MB4XDTAwMDUzMDEwNDgzOFoXDTIwMDUzMDEwNDgzOFowbzELMAkGA1UEBhMCU0Ux\r
FDASBgNVBAoTC0FkZFRydXN0IEFCMSYwJAYDVQQLEx1BZGRUcnVzdCBFeHRlcm5h\r
bCBUVFAgTmV0d29yazEiMCAGA1UEAxMZQWRkVHJ1c3QgRXh0ZXJuYWwgQ0EgUm9v\r
dDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALf3GjPm8gAELTngTlvt\r
H7xsD821+iO2zt6bETOXpClMfZOfvUq8k+0DGuOPz+VtUFrWlymUWoCwSXrbLpX9\r
uMq/NzgtHj6RQa1wVsfwTz/oMp50ysiQVOnGXw94nZpAPA6sYapeFI+eh6FqUNzX\r
mk6vBbOmcZSccbNQYArHE504B4YCqOmoaSYYkKtMsE8jqzpPhNjfzp/haW+710LX\r
a0Tkx63ubUFfclpxCDezeWWkWaCUN/cALw3CknLa0Dhy2xSoRcRdKn23tNbE7qzN\r
E0S3ySvdQwAl+mG5aWpYIxG3pzOPVnVZ9c0p10a3CitlttNCbxWyuHv77+ldU9U0\r
WicCAwEAAaOB3DCB2TAdBgNVHQ4EFgQUrb2YejS0Jvf6xCZU7wO94CTLVBowCwYD\r
VR0PBAQDAgEGMA8GA1UdEwEB/wQFMAMBAf8wgZkGA1UdIwSBkTCBjoAUrb2YejS0\r
Jvf6xCZU7wO94CTLVBqhc6RxMG8xCzAJBgNVBAYTAlNFMRQwEgYDVQQKEwtBZGRU\r
cnVzdCBBQjEmMCQGA1UECxMdQWRkVHJ1c3QgRXh0ZXJuYWwgVFRQIE5ldHdvcmsx\r
IjAgBgNVBAMTGUFkZFRydXN0IEV4dGVybmFsIENBIFJvb3SCAQEwDQYJKoZIhvcN\r
AQEFBQADggEBALCb4IUlwtYj4g+WBpKdQZic2YR5gdkeWxQHIzZlj7DYd7usQWxH\r
YINRsPkyPef89iYTx4AWpb9a/IfPeHmJIZriTAcKhjW88t5RxNKWt9x+Tu5w/Rw5\r
6wwCURQtjr0W4MHfRnXnJK3s9EK0hZNwEGe6nQY1ShjTK3rMUUKhemPR5ruhxSvC\r
Nr4TDea9Y355e6cJDUCrat2PisP29owaQgVR1EX1n6diIWgVIEM8med8vSTYqZEX\r
c4g/VhsxOBi0cQ+azcgOno4uG+GMmIPLHzHxREzGBHNJdmAPx/i9F4BrLunMTA5a\r
mnkPIAou1Z5jJh5VkpTYghdae9C8x49OhgQ=\r
-----END CERTIFICATE-----\r
`;

const pem3 = `-----BEGIN CERTIFICATE-----\r
MIIFajCCBFKgAwIBAgIQRoIRHqGpj8CMP8M0t1++czANBgkqhkiG9w0BAQsFADCB\r
kDELMAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4G\r
A1UEBxMHU2FsZm9yZDEaMBgGA1UEChMRQ09NT0RPIENBIExpbWl0ZWQxNjA0BgNV\r
BAMTLUNPTU9ETyBSU0EgRG9tYWluIFZhbGlkYXRpb24gU2VjdXJlIFNlcnZlciBD\r
QTAeFw0xNTEwMjkwMDAwMDBaFw0xNjEwMjgyMzU5NTlaMGQxITAfBgNVBAsTGERv\r
bWFpbiBDb250cm9sIFZhbGlkYXRlZDEeMBwGA1UECxMVRXNzZW50aWFsU1NMIFdp\r
bGRjYXJkMR8wHQYDVQQDDBYqLnJlc3VsdHJlcG9zaXRvcnkuY29tMIIBIjANBgkq\r
hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6U0h62UPRZfXsfn85XYUeqqzhFOc+mUo\r
Y63FYlVfCrB9m+m0/RbgLTKe8M+LliTW/8gSzqNFma6laxunsuYrYViohzXoJOUX\r
10k2Kr0cUBxgKuVTLGyLumkesWZGrEIUOHt7oKvIqdGIQO796etgof542VUa5e5q\r
GAWtugaXmkLgSb75vo0VGeUVwScteAXJ96pHZT2z+V5jmKebOX10xIivnRnohgXS\r
iUEzZLkd+d5beK5s+4TaJxGmRThPTTB4TPzJ+yFCdjaTUzpgJkzp+XLFKwqxOPUN\r
7psKGN742mvhWDYod76UHLeUyR1RDiYlfH3btBrUdMRyzv67UG2ShwIDAQABo4IB\r
6TCCAeUwHwYDVR0jBBgwFoAUkK9qOpRaC9iQ6hJWc99DtDoo2ucwHQYDVR0OBBYE\r
FDA04T3Y3uop2ThH1upWBdlN/5VvMA4GA1UdDwEB/wQEAwIFoDAMBgNVHRMBAf8E\r
AjAAMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjBPBgNVHSAESDBGMDoG\r
CysGAQQBsjEBAgIHMCswKQYIKwYBBQUHAgEWHWh0dHBzOi8vc2VjdXJlLmNvbW9k\r
by5jb20vQ1BTMAgGBmeBDAECATBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8vY3Js\r
LmNvbW9kb2NhLmNvbS9DT01PRE9SU0FEb21haW5WYWxpZGF0aW9uU2VjdXJlU2Vy\r
dmVyQ0EuY3JsMIGFBggrBgEFBQcBAQR5MHcwTwYIKwYBBQUHMAKGQ2h0dHA6Ly9j\r
cnQuY29tb2RvY2EuY29tL0NPTU9ET1JTQURvbWFpblZhbGlkYXRpb25TZWN1cmVT\r
ZXJ2ZXJDQS5jcnQwJAYIKwYBBQUHMAGGGGh0dHA6Ly9vY3NwLmNvbW9kb2NhLmNv\r
bTA3BgNVHREEMDAughYqLnJlc3VsdHJlcG9zaXRvcnkuY29tghRyZXN1bHRyZXBv\r
c2l0b3J5LmNvbTANBgkqhkiG9w0BAQsFAAOCAQEAGqxTUkaih0eAoWGO6ce5Fl6D\r
NYDBhgtjq8NtVfGwqlsJZOAenu7eCmdFHqeu4XyfCLwHusqq4YClGOX71t0S8CvT\r
+U1DE1achONOoxWEJgye7SjRyEhc/iswuiSYgVG6ByfZUwm/SE8sxqYuKZywwY55\r
5gUlXIy5lLKaGhzy4cr9RIsvXtFL6a5PL104GjqEO9Bau9uS2dHIeSlc+vJytzII\r
MS62IuWzYEFSlLY2THOVlu6u+wjkcHs6TE6pv+O8oLWBLf8oSv1YMrareQvMjiXt\r
oNyaBRoTfTDHhwySDWqVqS4awKRZCGFJyTQoBNQEJwELr3LZL0jAkROqF+vbeA==\r
-----END CERTIFICATE-----\r
`;

// let cert = new Cert(pem3);
// console.log(cert.v3Extensions[3]);
//
// console.log(isICert(cert));
// console.log("fingerprint sha1:", cert.fingerprint("sha1"));
// console.log("fingerprint sha256:", cert.fingerprint("sha256"));
// console.log("fingerprint sha384:", cert.fingerprint("sha384"));
// console.log("fingerprint sha512:", cert.fingerprint("sha512"));
// console.log("fingerprint md5:", cert.fingerprint("md5"));