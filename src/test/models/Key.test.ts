"use strict";
import {KeyEncryption} from "../../impls/KeyEncryption";
import {should} from "chai";
import {IKeyEncryption} from "../../interfaces/IKeyEncryption";
import {Key} from "../../impls/Key";
var casual = require("casual");
var pem = require("pem");

should();

/**
 * Created by zacharymartin on July 19, 2016.
 */

describe("Key", function(){
  describe("constructor", function(){
    describe("PEM string constructor", function(){
      type Situation = {
        privatePEMString: any,
        publicPEMString: any,
        password: any,
        numBits: number | undefined,
        algorithm: "aes128" | "aes192" | "aes256" | "3des" | "des" | undefined,
        legacy: boolean
      }


      const testCases: {sit: Situation, error: boolean, description: string}[] = [
        {
          sit: {
            privatePEMString: `-----BEGIN RSA PRIVATE KEY-----\r\n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\r\n-----END RSA PRIVATE KEY-----\r\n`,
            publicPEMString: `-----BEGIN PUBLIC KEY-----\r\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsB8hX35+hi98J8xtbfgk\r\nZ5+MyDAvJXwJrxRQfUPgHFSMEfdy3kJ/bAmAvt3FiV1MucKCMlCzcmNAmq96MuK8\r\n4nfcWj3Og0h9XzisE0PyTh1HZByIyV0l1NvtwKFxmGoMUgnMwY1e5zsWfbMiH2eL\r\nmT1wrz0BORpiyepbO+mFfRUH8U4XdYeE0ZFOaCp3yG074kbsVoWOORs1rolPq5bt\r\n7m2XmkuntyUScUa8WJLvO8Dl/gfRziBNtFnNkVNutUYjP8p1t0VSJXpd0AYJ2/MZ\r\nPII2lRg0jD675cKkUJ78dCg5gKY2CdLrQGvEGGgxeYUyWbM15NygU7o7gPDUtrpA\r\nxsPevmcI0RHuODgXVU5zySKP+kdYArTV79n/uQyRdyg/x1eN7rNe0CMrveWmn8XQ\r\nzy6mz9aQN4PAcU4bdEcaANn9DjlshgHM2JMAJFA3uDPPOUbjyy7seQMIWwHBwyMF\r\nljqEWy7Ug9d1eOzBetqxmoKq6eAEnMc4jnYrp272fRxyc/ssSBu25P8/QtoQP121\r\nOdgBwQyVfwgXFWZ4uQ12zFtcaihuTtltoWeLv0r/4HhieFfZ7R6Vx/xRInbwRBCm\r\nFUDkcAQnuT3Zg7D8nbcit4Y17YfPC4mXPkfbAjTUsTrkqtJ0ZcZWg4prAZT49U+I\r\n1fZuQ5RpKMwP2F0Bb0/ZAF8CAwEAAQ==\r\n-----END PUBLIC KEY-----\r\n`,
            password: undefined,
            numBits: 4096,
            algorithm:  undefined,
            legacy: false
          },
          error: false,
          description: "correct unencrypted 4096 bit key case"
        },
        {
          sit: {
            privatePEMString: `-----BEGIN RSA PRIVATE KEY-----\r\nProc-Type: 4,ENCRYPTED\r\nDEK-Info: DES-EDE3-CBC,BA80645EAC98C5C7\r\n\r\nUw9A4Z6PiUfA14KoT+M0DiB73R9502msQWHZymwz1H6DOON1xOJHEX9BN5MCpw00\r\n3OQ8m/VGdLVMdMZ8gkT/HBeyxLxaSy4VUrAzJG0CbQPiovj0DoPLG76vLZejZeKp\r\nLhZmqvcMOj7JhduEnZp+cIYY6/8eaRvxRzstPjCCCFS9YGM4hgJZUr530GeMikT2\r\nEFG4QGKcbMobVDNM9dMRAm5m0y803WEwTLuTcZD9KtTooILOJ7zsQzm7Cj/FKbzI\r\nomUaZLe66EkvYPj7dG4g5D5hZJMQw2GPz9P8AFuw4JH7sXCPLdQGmHWtfk5v04aE\r\n0cOKTDOEvy2CT7CArVjh2AsCNucIcrQsszA1l5tSYgdSScSEp7Lir2KY4tjHmCZ6\r\n6zRbTgnVvYumOfAFtbnRpFd7ffyHeL2y9DTgBw1EEtADWfYobdYfM3xKFTzsOv24\r\n39jRwN83cHlz31UpDd3DUd5DimEWf7oeRKT/w8tmu0Khs9eYR0j25qNea2f2JQRO\r\nwEpNPqmUxyMmPGPZ9mb7JR6sftoMI1FYbFF0ujhhDKHP0aJwZAH4AIa0H8Bh4S0U\r\nSeW7pBFlC9T2X0ofyEYwf9KXF5qJdKayGFDVsw6PQv+Gm59ehucGvy95vs3PgK9t\r\nJvqfXQtyxO0/crimDqvnrNcSCOoAmU83GDsmuErnk5x6omn6azR84hfqVT3s3eQO\r\nLzU1QBnDtVXcVeI0CezNxdgt+01bs2XLq39ROiYbF38+NRDSaFZFlld19M3YMVBJ\r\nO6Oviy61jF+GT11MDeFzOIBwK0JxvwkDhiTVet2xRGAx9BNePi+isfQEyWgx5H+D\r\nns+0N6OZkbKXOCXZ+ehfmVmRmv29jRIMX6CRs1L48WZu/U9kx5xA3E6MEGZJkkAA\r\n5oD5THEhIEfMQ1i48CteW9JmhtsbHjYgZicyXZ5f7kGLYCKRik2UD64VhEiWNeO/\r\nOVGc/7dYLnsQOWlF+vV3EJriptgq3iKt85ewxCt5XaFEcbw2Wlw+1WQ5o8Vu6/5r\r\nr4omCKSWieFM75DagEwLyfwi9B95zy0h3XSMbEPd35QshIFFLR7y+mxb3R0uZN24\r\noSvQJSp79OxMLXUi83AxYvLMdjdnKnl1r4JIX6ZsW4nJ4stnHTkX61uZIf5Wn2fX\r\ncEzUmylNmZt/rto0Z2zvtdNvRrflhu2lSkOdeIqOAnqhNzirsClR6H7qiYcd35uK\r\nZkeskfHZ9DHrgBC5dGAobOfuRpm8UMTXu8gRPE8F7r+NZJsiPuxyVPEc8i/BGIC1\r\nk9rQLu+g0wrkhPU0MCBSCb4jGYnXB7CvVNAqxrXaU4/p1pnV1nFOVfxk4wkBCTvG\r\nFbu3P4MeNVygrOihkJ780eTEtixu328++CzvEK4NMqp5FKTMifii2kC40tE0PV3J\r\nEhcig0S0C4ThzE+1lfrMQhBtXYhBiASqTlrDqbq+RQCVV131IcKQmH6Ns2ee9Soc\r\nU59MCt6WUlpfWpyvJ+AHVG41W9BuDe1TfzeGgEjRAzI4waLu/gL4eEoDcUXCOtjy\r\nSRIAQZTeKLTwmI4EpiYL2eXYHI3NXKODDknf2zhR4Asm9CgSPaAGTQ==\r\n-----END RSA PRIVATE KEY-----\r\n`,
            publicPEMString: `-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv71SEIvbuSkogQK3luKs\r\n8hUiaxnXrHV+heMwLH355YPZL9OMMaeT9rBAgR/VgC9VHI/WYyts+bPDtMdCIYUJ\r\nZRNPIEo2yUJsKyrbCbDZ8bwaYTd8wM401821CoWbZJPYJlp/iNZkMGmIpz6ks+Xn\r\nMKYZVwUJ0mlKJk0oFdnGLtdg7f8AQkqW8hPAdxgnrLhLgXvEh/axKEDuwjM6Ol1P\r\n2yzg7Do+/Gp2Fhmb3FqXIGi7dE8GYGP5hcglw5YDGp1l1J8UHNlEyCSzZGQy5wZk\r\n0CNYPHZ5B6mYQnvIdztamKD5ts8xNjmnLPuNOnyyQkDHN8KhnP6Jv14pZMDqw+IX\r\n2QIDAQAB\r\n-----END PUBLIC KEY-----\r\n`,
            password: "testtest",
            numBits: 2048,
            algorithm: "3des",
            legacy: true
          },
          error: false,
          description: "correct legacy 3des encrypted 2048 bit case"
        },
        {
          sit: {
            privatePEMString: `-----BEGIN RSA PRIVATE KEY-----\r\nProc-Type: 4,ENCRYPTED\r\nDEK-Info: DES-EDE3-CBC,7539420E9A929C97\r\n\r\nYj9tUn/RmvNpXaTxV/YA9N3lWwBAnRXiVqX4v/e11eCeDdYtd/RvXPMHMTyoHWum\r\nyfcNqrmCxoZZb51uk58qoVTTgHAnl7+Aseg6e+9jv6usWDBS2IcDwrw1nhPfFaz9\r\nDsJCNqEVGATQY+YvRTUjwDgoXdcC1XEok3wv3h59Ei2gIK8TkSSi0BrJJJaGJkvL\r\nN97yO5ZGZKhl8oRIPzRNRGZ+WnvjFzcEhy2ZYQfwBZI=\r\n-----END RSA PRIVATE KEY-----\r\n`,
            publicPEMString: `-----BEGIN PUBLIC KEY-----\r\nMDwwDQYJKoZIhvcNAQEBBQADKwAwKAIhAIbkGYRZg/FnU6z2T+dNuSVFRXzlJqLL\r\nHJa3sDYsf/x5AgMBAAE=\r\n-----END PUBLIC KEY-----\r\n`,
            password: "test",
            numBits: 256,
            algorithm: "3des",
            legacy: true
          },
          error: false,
          description: "correct legacy 3des encrypted 256 bit case"
        },
        {
          sit: {
            privatePEMString: `-----BEGIN RSA PRIVATE KEY-----\r\n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\r\n-----END RSA PRIVATE KEY-----\r\n`,
            publicPEMString: `-----BEGIN PUBLIC KEY-----\r\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsB8hX35+hi98J8xtbfgk\r\nZ5+MyDAvJXwJrxRQfUPgHFSMEfdy3kJ/bAmAvt3FiV1MucKCMlCzcmNAmq96MuK8\r\n4nfcWj3Og0h9XzisE0PyTh1HZByIyV0l1NvtwKFxmGoMUgnMwY1e5zsWfbMiH2eL\r\nmT1wrz0BORpiyepbO+mFfRUH8U4XdYeE0ZFOaCp3yG074kbsVoWOORs1rolPq5bt\r\n7m2XmkuntyUScUa8WJLvO8Dl/gfRziBNtFnNkVNutUYjP8p1t0VSJXpd0AYJ2/MZ\r\nPII2lRg0jD675cKkUJ78dCg5gKY2CdLrQGvEGGgxeYUyWbM15NygU7o7gPDUtrpA\r\nxsPevmcI0RHuODgXVU5zySKP+kdYArTV79n/uQyRdyg/x1eN7rNe0CMrveWmn8XQ\r\nzy6mz9aQN4PAcU4bdEcaANn9DjlshgHM2JMAJFA3uDPPOUbjyy7seQMIWwHBwyMF\r\nljqEWy7Ug9d1eOzBetqxmoKq6eAEnMc4jnYrp272fRxyc/ssSBu25P8/QtoQP121\r\nOdgBwQyVfwgXFWZ4uQ12zFtcaihuTtltoWeLv0r/4HhieFfZ7R6Vx/xRInbwRBCm\r\nFUDkcAQnuT3Zg7D8nbcit4Y17YfPC4mXPkfbAjTUsTrkqtJ0ZcZWg4prAZT49U+I\r\n1fZuQ5RpKMwP2F0Bb0/ZAF8CAwEAAQ==\r\n-----END PUBLIC KEY-----\r\n`,
            password: "badPassword",
            numBits: 4096,
            algorithm:  undefined,
            legacy: false
          },
          error: true,
          description: "correct unencrypted 4096 bit key case but with a password"
        },
        {
          sit: {
            privatePEMString: `-----BEGIN RSA PRIVATE KEY-----\r\nProc-Type: 4,ENCRYPTED\r\nDEK-Info: DES-EDE3-CBC,BA80645EAC98C5C7\r\n\r\nUw9A4Z6PiUfA14KoT+M0DiB73R9502msQWHZymwz1H6DOON1xOJHEX9BN5MCpw00\r\n3OQ8m/VGdLVMdMZ8gkT/HBeyxLxaSy4VUrAzJG0CbQPiovj0DoPLG76vLZejZeKp\r\nLhZmqvcMOj7JhduEnZp+cIYY6/8eaRvxRzstPjCCCFS9YGM4hgJZUr530GeMikT2\r\nEFG4QGKcbMobVDNM9dMRAm5m0y803WEwTLuTcZD9KtTooILOJ7zsQzm7Cj/FKbzI\r\nomUaZLe66EkvYPj7dG4g5D5hZJMQw2GPz9P8AFuw4JH7sXCPLdQGmHWtfk5v04aE\r\n0cOKTDOEvy2CT7CArVjh2AsCNucIcrQsszA1l5tSYgdSScSEp7Lir2KY4tjHmCZ6\r\n6zRbTgnVvYumOfAFtbnRpFd7ffyHeL2y9DTgBw1EEtADWfYobdYfM3xKFTzsOv24\r\n39jRwN83cHlz31UpDd3DUd5DimEWf7oeRKT/w8tmu0Khs9eYR0j25qNea2f2JQRO\r\nwEpNPqmUxyMmPGPZ9mb7JR6sftoMI1FYbFF0ujhhDKHP0aJwZAH4AIa0H8Bh4S0U\r\nSeW7pBFlC9T2X0ofyEYwf9KXF5qJdKayGFDVsw6PQv+Gm59ehucGvy95vs3PgK9t\r\nJvqfXQtyxO0/crimDqvnrNcSCOoAmU83GDsmuErnk5x6omn6azR84hfqVT3s3eQO\r\nLzU1QBnDtVXcVeI0CezNxdgt+01bs2XLq39ROiYbF38+NRDSaFZFlld19M3YMVBJ\r\nO6Oviy61jF+GT11MDeFzOIBwK0JxvwkDhiTVet2xRGAx9BNePi+isfQEyWgx5H+D\r\nns+0N6OZkbKXOCXZ+ehfmVmRmv29jRIMX6CRs1L48WZu/U9kx5xA3E6MEGZJkkAA\r\n5oD5THEhIEfMQ1i48CteW9JmhtsbHjYgZicyXZ5f7kGLYCKRik2UD64VhEiWNeO/\r\nOVGc/7dYLnsQOWlF+vV3EJriptgq3iKt85ewxCt5XaFEcbw2Wlw+1WQ5o8Vu6/5r\r\nr4omCKSWieFM75DagEwLyfwi9B95zy0h3XSMbEPd35QshIFFLR7y+mxb3R0uZN24\r\noSvQJSp79OxMLXUi83AxYvLMdjdnKnl1r4JIX6ZsW4nJ4stnHTkX61uZIf5Wn2fX\r\ncEzUmylNmZt/rto0Z2zvtdNvRrflhu2lSkOdeIqOAnqhNzirsClR6H7qiYcd35uK\r\nZkeskfHZ9DHrgBC5dGAobOfuRpm8UMTXu8gRPE8F7r+NZJsiPuxyVPEc8i/BGIC1\r\nk9rQLu+g0wrkhPU0MCBSCb4jGYnXB7CvVNAqxrXaU4/p1pnV1nFOVfxk4wkBCTvG\r\nFbu3P4MeNVygrOihkJ780eTEtixu328++CzvEK4NMqp5FKTMifii2kC40tE0PV3J\r\nEhcig0S0C4ThzE+1lfrMQhBtXYhBiASqTlrDqbq+RQCVV131IcKQmH6Ns2ee9Soc\r\nU59MCt6WUlpfWpyvJ+AHVG41W9BuDe1TfzeGgEjRAzI4waLu/gL4eEoDcUXCOtjy\r\nSRIAQZTeKLTwmI4EpiYL2eXYHI3NXKODDknf2zhR4Asm9CgSPaAGTQ==\r\n-----END RSA PRIVATE KEY-----\r\n`,
            publicPEMString: `-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv71SEIvbuSkogQK3luKs\r\n8hUiaxnXrHV+heMwLH355YPZL9OMMaeT9rBAgR/VgC9VHI/WYyts+bPDtMdCIYUJ\r\nZRNPIEo2yUJsKyrbCbDZ8bwaYTd8wM401821CoWbZJPYJlp/iNZkMGmIpz6ks+Xn\r\nMKYZVwUJ0mlKJk0oFdnGLtdg7f8AQkqW8hPAdxgnrLhLgXvEh/axKEDuwjM6Ol1P\r\n2yzg7Do+/Gp2Fhmb3FqXIGi7dE8GYGP5hcglw5YDGp1l1J8UHNlEyCSzZGQy5wZk\r\n0CNYPHZ5B6mYQnvIdztamKD5ts8xNjmnLPuNOnyyQkDHN8KhnP6Jv14pZMDqw+IX\r\n2QIDAQAB\r\n-----END PUBLIC KEY-----\r\n`,
            password: "badPassword",
            numBits: 2048,
            algorithm: "3des",
            legacy: true
          },
          error: true,
          description: "correct legacy 3des encrypted 2048 bit case but with wrong password"
        },
        {
          sit: {
            privatePEMString: `-----BEGIN RSA PRIVATE KEY-----\r\nProc-Type: 4,ENCRYPTED\r\nDEK-Info: DES-EDE3-CBC,7539420E9A929C97\r\n\r\nYj9tUn/RmvNpXaTxV/YA9N3lWwBAnRXiVqX4v/e11eCeDdYtd/RvXPMHMTyoHWum\r\nyfcNqrmCxoZZb51uk58qoVTTgHAnl7+Aseg6e+9jv6usWDBS2IcDwrw1nhPfFaz9\r\nDsJCNqEVGATQY+YvRTUjwDgoXdcC1XEok3wv3h59Ei2gIK8TkSSi0BrJJJaGJkvL\r\nN97yO5ZGZKhl8oRIPzRNRGZ+WnvjFzcEhy2ZYQfwBZI=\r\n-----END RSA PRIVATE KEY-----\r\n`,
            publicPEMString: `-----BEGIN PUBLIC KEY-----\r\nMDwwDQYJKoZIhvcNAQEBBQADKwAwKAIhAIbkGYRZg/FnU6z2T+dNuSVFRXzlJqLL\r\nHJa3sDYsf/x5AgMBAAE=\r\n-----END PUBLIC KEY-----\r\n`,
            password: "badPassword",
            numBits: 256,
            algorithm: "3des",
            legacy: true
          },
          error: true,
          description: "correct legacy 3des encrypted 256 bit case but with wrong password"
        },
      ];

      for(let testCase of testCases){
        // describe("")
        //
        //
        // let key = new Key(testCase.sit.privatePEMString, testCase.sit.password);
        // it("should have the same public key", function(){
        //   key.publicPEM.should.equal(testCase.sit.publicPEMString);
        // });
        // it("should have the same private key", function(){
        //   key.privatePEM.should.equal(testCase.sit.privatePEMString);
        // });
      }
    });
  });
});
