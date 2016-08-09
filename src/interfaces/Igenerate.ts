"use strict";
import {IKeyOptions} from "./IKeyOptions";
import {IKey} from "./IKey";
import {IDistinguishedName} from "./IDistinguishedName";
import {IV3Extension} from "./V3Extensions/IV3Extension";
import {ICSR} from "./ICSR";
import {ICert} from "./ICert";
import {ICertOptions} from "./ICertOptions";
import {IKeyEncryption} from "./IKeyEncryption";
import {ICAStore} from "./ICAStore";

/**
 * Created by zacharymartin on July 16, 2016.
 */

export interface Igenerate {
  /**
   * The privateKey function asynchronously creates an rsa private key. It takes two
   * optional arguments.
   * @param numBits - <number> - the number of bits the key should be sized to, which
   *                            defaults to 2048
   * @param encryption - an IKeyEncryption object of the form = {
   *    password      - <string>  - a password to use for encrypting the private key, if
   *                            not provided or equal to the empty string, then the
   *                            private key returned is not encrypted
   *    algorithm:    - <string>  - the encryption algorithm to use for encrypting the
   *                            private key in the event that a password is given,
   *                            acceptable values are: "aes128", "aes192", "aes256",
   *                            "3des" or "des", in the event that no value is given,
   *                            defaults to "3des"
   *   iterationCount - <number>  - the iteration count to use in key encryption, defaults
   *                            to 2048
   *   saltSize       - <number>  - the size of the salt in bytes to use for a given
   *                            password for key encryption, defaults to 8
   *   legacy         - <boolean> - a boolean for whether or not to use old non-PKCS#8
   *                            PEM-encrypted+encapsulated headers (DEK-info) private key,
   *                            defaults to false
   * }
   * @return an ES6 promise for an IKey object of the form = {
   *   key      - <string> - the PEM encoding of the generated private key
   *   password - <string> - the password used to encrypt the private key
   * }
   */
  privateKey(numBits?: number,
             encryption?: IKeyEncryption,
             publicExponent?: number):
    Promise<IKey>;

  /**
   * The privateKeySync function synchronously creates an rsa private key. It takes two
   * optional arguments.
   * @param numBits - <number> - the number of bits the key should be sized to, which
   *                            defaults to 2048
   * @param encryption - an IKeyEncryption object of the form = {
   *    password      - <string>  - a password to use for encrypting the private key, if
   *                            not provided or equal to the empty string, then the
   *                            private key returned is not encrypted
   *    algorithm:    - <string>  - the encryption algorithm to use for encrypting the
   *                            private key in the event that a password is given,
   *                            acceptable values are: "aes128", "aes192", "aes256",
   *                            "3des" or "des", in the event that no value is given,
   *                            defaults to "3des"
   *   iterationCount - <number>  - the iteration count to use in key encryption, defaults
   *                            to 2048
   *   saltSize       - <number>  - the size of the salt in bytes to use for a given
   *                            password for key encryption, defaults to 8
   *   legacy         - <boolean> - a boolean for whether or not to use old non-PKCS#8
   *                            PEM-encrypted+encapsulated headers (DEK-info) private key,
   *                            defaults to false
   * }
   * @return an IKey object of the form = {
   *   key      - (string) - the PEM encoding of the generated private key
   *   password - (string) - the password used to encrypt the private key
   * }
   */
  privateKeySync(numBits?: number,
                 encryption?: IKeyEncryption,
                 publicExponent?: number):
    IKey;

  /**
   * The csr function asynchronously generates a certificate signing request. If necessary
   * it will also generate a private key for basing the csr on.
   * @param subject      - <IDistinguishedName> -
   * @param v3Extensions - IV3Extension[] -
   * @param key          - <IKey>
   * @param hash         - <"sha1" | "sha256" | "sha384" | "sha512" | "md5"> - the hash
   *                     algorithm to use to sign the CSR with the subject's private key,
   *                     defaults to "sha256"
   */
  csr(subject?: IDistinguishedName,
      v3Extensions?: IV3Extension[],
      key?: IKey | {numBits: number, encryption?: IKeyEncryption},
      hash?: "sha1" | "sha256" | "sha384" | "sha512" | "md5",
      challengePassword?: string,
      unstructuredName?: string): Promise<{csr: ICSR, key: IKey}>;

  csrSync(subject?: IDistinguishedName,
          v3Extensions?: IV3Extension[],
          key?: IKey | {numBits: number, encryption?: IKeyEncryption},
          hash?: "sha1" | "sha256" | "sha384" | "sha512" | "md5",
          challengePassword?: string,
          unstructuredName?: string): {csr: ICSR, key: IKey};
  /**
   * The cert function asynchronously generates an x509 version 3 certificate.
   * @param csrOrSubject
   * @param signer
   * @param v3Extensions
   * @param options
   */
  cert(csrOrSubject?: ICSR | {subject: IDistinguishedName, key?: string | IKey | null} | null,
       signer?: {cert: ICert, key: IKey} | IKey | null,
       v3Extensions?: IV3Extension[] | null,
       options?: ICertOptions):
  Promise<{key: IKey | null, csr: ICSR, cert: ICert}>;


  /**
   * The certSync function synchronously generates an x509 version 3 certificate.
   * @param csrOrSubject
   * @param signer
   * @param v3Extensions
   * @param options
   */
  certSync(csrOrSubject?: ICSR | {subject: IDistinguishedName, key?: string | IKey | null} | null,
       signer?: {cert: ICert, key: IKey} | IKey | null,
       v3Extensions?: IV3Extension[] | null,
       options?: ICertOptions):
    {key: IKey | null, csr: ICSR, cert: ICert};

  caStore(caCerts?: Array<ICert | string>): ICAStore;
}