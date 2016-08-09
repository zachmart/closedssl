"use strict";
import {KeyEncryption} from "../../impls/KeyEncryption";
import {should} from "chai";
import {IKeyEncryption} from "../../interfaces/IKeyEncryption";

should();

/**
 * Created by zacharymartin on July 19, 2016.
 */

const DEFAULT_VALUES = {
  algorithm: "3des",
  iterationCount: 2048,
  saltSize: 8,
  legacy: false
};

const RECOGNIZED_ALGORITHMS: string[] = [
  "aes128",
  "aes192",
  "aes256",
  "3des",
  "des"
];


describe("KeyEncryption", function(){
  describe("constructor", function() {
    type ArgObj = {
      password: any;
      algorithm: any;
      legacy: any;
    }
    const testCases: {
      args: ArgObj,
      objectConstructorError: boolean,
      multiArgConstructorError: boolean,
      description: string
    }[] = [
      {
        args: {
          password: "test",
          algorithm: undefined,
          legacy: undefined
        },
        objectConstructorError: true,
        multiArgConstructorError: false,
        description: "password only case with all other parameters left as undefined"
      },
      {
        args: {
          password: "",
          algorithm: undefined,
          legacy: undefined
        },
        objectConstructorError: true,
        multiArgConstructorError: true,
        description: "empty string password only case with all other parameters left as undefined"
      },
      {
        args: {
          password: "test",
          algorithm: "unsupportedAlgorithm",
          legacy: true

        },
        objectConstructorError: true,
        multiArgConstructorError: true,
        description: "unsupported algorithm case",
      },
      {
        args: {
          password: "test",
          algorithm: "aes128",
          legacy: undefined

        },
        objectConstructorError: true,
        multiArgConstructorError: false,
        description: "undefined legacy case",
      },
      {
        args: {
          password: "test",
          algorithm: "aes192",
          legacy: false

        },
        objectConstructorError: false,
        multiArgConstructorError: false,
        description: "correctly formatted arguments with algo: aes192 case",
      },
      {
        args: {
          password: "test",
          algorithm: "aes128",
          legacy: true

        },
        objectConstructorError: false,
        multiArgConstructorError: false,
        description: "correctly formatted arguments with algo: aes128 case",
      },
      {
        args: {
          password: "test",
          algorithm: "aes128",
          legacy: "hello"

        },
        objectConstructorError: true,
        multiArgConstructorError: true,
        description: "non-boolean legacy case",
      },
      {
        args: {
          password: "test",
          algorithm: "aes256",
          legacy: true
        },
        objectConstructorError: false,
        multiArgConstructorError: false,
        description: "correctly formatted arguments with algo: aes256 case",
      },
      {
        args: {
          password: "test",
          algorithm: "des",
          legacy: false

        },
        objectConstructorError: false,
        multiArgConstructorError: false,
        description: "correctly formatted arguments with algo: des case",
      },
      {
        args: {
          password: true,
          algorithm: "des",
          legacy: true

        },
        objectConstructorError: true,
        multiArgConstructorError: true,
        description: "non-string password case",
      },
      {
        args: {
          password: "test",
          algorithm: true,
          legacy: true

        },
        objectConstructorError: true,
        multiArgConstructorError: true,
        description: "non-string algorithm case",
      },
      {
        args: {
          password: "test",
          algorithm: "3des",
          legacy: true

        },
        objectConstructorError: false,
        multiArgConstructorError: false,
        description: "correctly formatted arguments with algo: 3des case",
      },
      {
        args: {
          password: "testtesttest kdkdk",
          algorithm: "des",
          legacy: false

        },
        objectConstructorError: false,
        multiArgConstructorError: false,
        description: "correctly formatted args case",
      }
    ];

    for(let testCase of testCases) {
      let ke1: KeyEncryption;
      let ke2: KeyEncryption;

      describe("object constructor", function(){
        if (testCase.objectConstructorError){
          it(`should throw an error for case: ${testCase.description}`, function(){
            (function(){new KeyEncryption(<IKeyEncryption>testCase.args)})
              .should
              .throw(Error);
          })
        } else {
          let ke1 = new KeyEncryption(<IKeyEncryption>testCase.args);

          it("should have a non-empty string password property", function(){
            ke1.password.should.exist;
            ke1.password.should.be.a("string");
            ke1.password.should.have.length.above(0);
          });

          it("should have a string algorithm property in the set of recognized algorithms",
          function(){
            ke1.algorithm.should.exist;
            ke1.algorithm.should.be.a("string");
            ke1.algorithm.should.be.oneOf(RECOGNIZED_ALGORITHMS);
          });

          it("should have a boolean legacy property", function(){
            ke1.legacy.should.exist;
            ke1.legacy.should.be.a("boolean");
          });

          it(`should have properties matching the constructor argument`, function(){
            ke1.password.should.equal(testCase.args.password);
            ke1.algorithm.should.equal(testCase.args.algorithm);
            ke1.legacy.should.equal(testCase.args.legacy);
          });
        }
      });

      describe("multi-argument constructor", function(){
        if (testCase.multiArgConstructorError) {
          it(`should throw an error for case: ${testCase.description}`, function(){
            (function(){new KeyEncryption(
              <string> testCase.args.password,
              <"aes128" | "aes192" | "aes256" | "3des" | "des"> testCase.args.algorithm,
              <boolean> testCase.args.legacy
            )}).should.throw(Error);
          });
        } else {
          let ke2 = new KeyEncryption(
            <string> testCase.args.password,
            <"aes128" | "aes192" | "aes256" | "3des" | "des"> testCase.args.algorithm,
            <boolean> testCase.args.legacy
          );

          it("should have a non-empty string password property", function(){
            ke2.password.should.exist;
            ke2.password.should.be.a("string");
            ke2.password.should.have.length.above(0);
          });

          it("should have a string algorithm property in the set of recognized algorithms",
            function(){
              ke2.algorithm.should.exist;
              ke2.algorithm.should.be.a("string");
              ke2.algorithm.should.be.oneOf(RECOGNIZED_ALGORITHMS);
            });

          it("should have a boolean legacy property", function(){
            ke2.legacy.should.exist;
            ke2.legacy.should.be.a("boolean");
          });

          it(`should have properties matching the constructor argument`, function(){
            ke2.password.should.equal(testCase.args.password);
            ke2.algorithm.should.equal(
              testCase.args.algorithm ? testCase.args.algorithm : DEFAULT_VALUES.algorithm
            );
            ke2.legacy.should.equal(
              testCase.args.legacy ? testCase.args.legacy : DEFAULT_VALUES.legacy
            );
          });
        }
      });
    }

  });
});