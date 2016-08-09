"use strict";
import {
  isIKeyUsage, 
  POSSIBLE_USAGES,
  IKeyUsage
} from "../../../interfaces/V3Extensions/IKeyUsage";
import {should} from "chai";
var casual = require("casual");

should();

/**
 * Created by zacharymartin on July 13, 2016.
 */


describe("IKeyUsage -", function() {
  const PROP_NAMES = (<any[]>POSSIBLE_USAGES).concat([
    "_name",
    "_ext",
    "usages",
    "isValidUsage",
    Symbol.iterator,
    "equals"
  ]);

  casual.define("correctlyFormattedIKeyUsage", function() {
    return {
      _name: "keyUsage",
      digitalSignature: casual.coin_flip,
      nonRepudiation: casual.coin_flip,
      keyEncipherment: casual.coin_flip,
      dataEncipherment: casual.coin_flip,
      keyAgreement: casual.coin_flip,
      keyCertSign: casual.coin_flip,
      cRLSign: casual.coin_flip,
      encipherOnly: casual.coin_flip,
      decipherOnly: casual.coin_flip,
      usages: casual.string.split(" "),
      isValidUsage: function(arg) {
        return casual.coin_flip;
      },
      [Symbol.iterator]: function() {
        return {
          next: function() {
            return {
              value: casual.word,
              done: casual.coin_flip
            }
          }
        }
      },
      _ext: {},
      equals: function(that){
        return casual.coin_flip;
      }
    };
  });

  function getCorrectlyFormattedIKeyUsageObj(){
    return casual.correctlyFormattedIKeyUsage;
  }
  
  describe("#isIKeyUsage - KeyUsage Interface type guard -", function(){
    
    describe("correctly formatted objects -", function(){
      for (let i = 0; i < 20; i++) {
        it("should return true", function(){
          let correctIKeyUsage: any = getCorrectlyFormattedIKeyUsageObj();
          isIKeyUsage(correctIKeyUsage).should.be.true;
        })
      }
    });

    // test missing property cases
    for (let propToDelete of PROP_NAMES){
      describe(`IKeyUsage with no "${typeof propToDelete !== "symbol" ? propToDelete : "[Symbol.iterator]"}" prop`, function(){
        const testCase = getCorrectlyFormattedIKeyUsageObj();

        delete testCase[propToDelete];

        it("should return false", function(){
          isIKeyUsage(testCase).should.be.false;
        });
      });
    }

    // test wrongly typed property cases
    for (let propToChangeType of PROP_NAMES){
      describe(`IKeyUsage with wrongly typed "${
        typeof propToChangeType !== "symbol" ? propToChangeType : "[Symbol.iterator]"
      }" prop`, function(){
        const testCase = getCorrectlyFormattedIKeyUsageObj();

        testCase[propToChangeType] = 5;

        it("should return false", function(){
          isIKeyUsage(testCase).should.be.false;
        });
      });
    }

    // test null, undefined, NaN, empty string, incorrect object, num, boolean cases
    describe("null arg", function(){
      it("should return false", function(){
        isIKeyUsage(null).should.be.false;
      })
    });

    describe("undefined arg", function(){
      it("should return false", function(){
        isIKeyUsage(undefined).should.be.false;
      })
    });

    describe("NaN arg", function(){
      it("should return false", function(){
        isIKeyUsage(NaN).should.be.false;
      })
    });

    describe("empty string arg", function(){
      it("should return false", function(){
        isIKeyUsage("").should.be.false;
      })
    });

    describe("incorrect object arg", function(){
      it("should return false", function(){
        isIKeyUsage({water: true}).should.be.false;
      })
    });

    describe("numeric arg", function(){
      it("should return false", function(){
        isIKeyUsage(5).should.be.false;
      })
    });

    describe("boolean arg", function(){
      it("should return false", function(){
        isIKeyUsage(true).should.be.false;
      })
    });
  });
});