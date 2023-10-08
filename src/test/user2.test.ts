import 'reflect-metadata';
import { Request, Response } from 'express';
import {describe, expect, beforeEach,test, beforeAll, afterAll} from '@jest/globals';
import { mock, instance, when, verify, anything,anyString,} from 'ts-mockito';
import { UserRouter } from '../routes/user.routes';
import { UserController } from '../user/user.controller';
import { UserFacade } from '../user/user.facade';
import {container} from 'tsyringe'
import {UserfollowerSum} from '../dto/user'
import app from "../server";
import request from "supertest";
import { application } from "express";

const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI1OCwicm9sIjowLCJpYXQiOjE2OTY1MDk5OTgsImV4cCI6MTY5Njc2OTE5OH0.WzGSUm7BEJeVeIU3l9kVTLU4Vi58QzmVFluCv61N3xU";


beforeAll((done) => {
    done();
  });
  
  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    done();
  });
  
  //!test download paths
  describe("Test download paths", () => {
    describe("dowload file link by ulid", () => {
      test("GET /users/find", (done) => {
        request(app)
          .get('/users/find')
          .set("Authorization", authorization)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          //.expect(200)
          .expect((res) => {
            if (res.status > 299) {
              throw new Error("Error status code > 299");
            }
            expect(res.body).toBeDefined();
            // expect(res.body).toEqual();
          })
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });
    });
  
//     describe("dowload raw file in base 64 by ulid", () => {
//       test("GET /download/ulidJsonDocument/:ulid", (done) => {
//         request(App)
//           .get(/download/ulidJsonDocument/${ulid})
//           .set("Authorization", "Bearer " + authorization)
//           //.set({ autorization: authorization, Accept: "application/json" })
//           .expect("Content-Type", /json/)
//           //.expect(200)
//           .expect((res) => {
//             if (res.status > 299) {
//               throw new Error("Error status code > 299");
//             }
//             expect(res.body.typeString).toBeDefined();
//             expect(typeof res.body.file).toBe("string");
//             expect(res.body.documentId).toEqual(ulid);
//           })
//           .end((err, res) => {
//             if (err) return done(err);
//             return done();
//           });
//       });
//     });
//   });
  
//   //!test query paths
//   describe("Test query paths", () => {
//     describe("query documents with no query parameters, only the required ones", () => {
//       test("GET /query/byDocument/:docNUmber", (done) => {
//         request(App)
//           .get(/query/byDocument/${documentNumber})
//           .set("Authorization", "Bearer " + authorization)
//           .set("Accept", "application/json")
//           .expect("Content-Type", /json/)
//           //.expect(200)
//           .expect((res) => {
//             if (res.status > 299) {
//               throw new Error("Error status code > 299");
//             }
//             expect(res.body.data).toBeDefined();
//             expect(typeof res.body.count).toBe("number");
//             expect(res.body.data.Items).toBeDefined();
//             expect(Array.isArray(res.body.data.Items)).toBe(true);
//           })
//           .end((err, res) => {
//             if (err) return done(err);
//             return done();
//           });
//       });
  
//       test("GET /query/byTransaction/:transaction_document", (done) => {
//         request(App)
//           .get(/query/byTransaction/${transaction_document})
//           .set("Authorization", "Bearer " + authorization)
//           .set("Accept", "application/json")
//           .expect("Content-Type", /json/)
//           //.expect(200)
//           .expect((res) => {
//             if (res.status > 299) {
//               throw new Error("Error status code > 299");
//             }
//             expect(res.body.data).toBeDefined();
//             expect(typeof res.body.data.Count).toBe("number");
//             console.log(res.body.data.Count);
//             expect(res.body.data.Items).toBeDefined();
//             expect(Array.isArray(res.body.data.Items)).toBe(true);
//           })
//           .end((err, res) => {
//             if (err) return done(err);
//             return done();
//           });
//       });
//     });
  });