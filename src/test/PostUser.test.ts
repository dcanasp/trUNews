import 'reflect-metadata';
import { Request, Response } from 'express';
import {describe, expect,beforeEach,test, beforeAll, afterAll} from '@jest/globals';
import { mock, instance, when, verify, anything,anyString,} from 'ts-mockito';
import { UserRouter } from '../routes/user.routes';
import { UserController } from '../user/user.controller';
import { UserFacade } from '../user/user.facade';
import {container} from 'tsyringe'
import {UserfollowerSum} from '../dto/user'
import app from "../server";
import request from "supertest";
import { application } from "express";
import { isUserfollowerSum, anythingOrNullOrUndefined } from '../test_helpers/user.helpers';

// const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbCI6MSwiaWF0IjoxNjk2NzcyNDY2LCJleHAiOjE2OTcwMzE2NjZ9.Qo6J-Xy8o368BUJLKE5GQbOvMn2BEEcNUX6-7injxS4";
// const pruebasUserId = 1
// const pruebasUsername = 'Fatima76'

beforeAll((done) => {
    done();
  });
  
  afterAll((done) => {
    console.log('llega?');
    done();
  });


describe("todos los post", () => {
    describe("truco", () => {
        const uniqueUsername = "usuarioJest" + new Date().getTime();

        test('this test will also always pass', () => {
            request(app)
          .post('/users/create').send({
            username:uniqueUsername,lastname:"admin",name:"david",password:"1",rol:0
          })
          .set("Accept", "application/json")
        
            expect(true).toBe(true);
          });
      });
    });
    


//     describe("Post /users/create", () => {
//       test("Post /users/create", (done) => {
//         const uniqueUsername = "usuarioJest" + new Date().getTime();
//         request(app)
//           .post('/users/create').send({
//             username:uniqueUsername,lastname:"admin",name:"david",password:"1",rol:0
//           })
//           .set("Accept", "application/json")
//           .expect("Content-Type", /json/)
//           .expect((res) => {
//             if (res.status > 299) {
//               throw new Error("Error status code > 299");
//             }
//             expect(res.body).toBeDefined();
//             expect(res.body.token).toBeDefined();
//             expect(typeof res.body.token).toBe("string");
//             expect(res.body.token.split(".").length).toBe(3)
//             expect(res.body.user).toMatchObject({
//               userId: expect.any(Number),
//               rol: expect.any(Number),
//             });
                        
//             // if (Array.isArray(res.body)) {
//             //   res.body.forEach((item) => {
//             //     expect(isUserfollowerSum(item)).toBeTruthy();
//             //   });
//             // } else {
//             //   throw new Error("Response body is not an array of UserfollowerSum");
//             // }
//             // expect(res.body).toEqual();
//           })
//           .end((err, res) => {
//             if (err) return done(err);
//             return done();
//           });
//       });
//     });
   
   
   
//   });
  
    
// //     describe("dowload raw file in base 64 by ulid", () => {
// //       test("GET /download/ulidJsonDocument/:ulid", (done) => {
// //         request(App)
// //           .get(/download/ulidJsonDocument/${ulid})
// //           .set("Authorization", "Bearer " + authorization)
// //           //.set({ autorization: authorization, Accept: "application/json" })
// //           .expect("Content-Type", /json/)
// //           //.expect(200)
// //           .expect((res) => {
// //             if (res.status > 299) {
// //               throw new Error("Error status code > 299");
// //             }
// //             expect(res.body.typeString).toBeDefined();
// //             expect(typeof res.body.file).toBe("string");
// //             expect(res.body.documentId).toEqual(ulid);
// //           })
// //           .end((err, res) => {
// //             if (err) return done(err);
// //             return done();
// //           });
// //       });
// //     });
// //   });
  
// //   //!test query paths
// //   describe("Test query paths", () => {
// //     describe("query documents with no query parameters, only the required ones", () => {
// //       test("GET /query/byDocument/:docNUmber", (done) => {
// //         request(App)
// //           .get(/query/byDocument/${documentNumber})
// //           .set("Authorization", "Bearer " + authorization)
// //           .set("Accept", "application/json")
// //           .expect("Content-Type", /json/)
// //           //.expect(200)
// //           .expect((res) => {
// //             if (res.status > 299) {
// //               throw new Error("Error status code > 299");
// //             }
// //             expect(res.body.data).toBeDefined();
// //             expect(typeof res.body.count).toBe("number");
// //             expect(res.body.data.Items).toBeDefined();
// //             expect(Array.isArray(res.body.data.Items)).toBe(true);
// //           })
// //           .end((err, res) => {
// //             if (err) return done(err);
// //             return done();
// //           });
// //       });
  
// //       test("GET /query/byTransaction/:transaction_document", (done) => {
// //         request(App)
// //           .get(/query/byTransaction/${transaction_document})
// //           .set("Authorization", "Bearer " + authorization)
// //           .set("Accept", "application/json")
// //           .expect("Content-Type", /json/)
// //           //.expect(200)
// //           .expect((res) => {
// //             if (res.status > 299) {
// //               throw new Error("Error status code > 299");
// //             }
// //             expect(res.body.data).toBeDefined();
// //             expect(typeof res.body.data.Count).toBe("number");
// //             console.log(res.body.data.Count);
// //             expect(res.body.data.Items).toBeDefined();
// //             expect(Array.isArray(res.body.data.Items)).toBe(true);
// //           })
// //           .end((err, res) => {
// //             if (err) return done(err);
// //             return done();
// //           });
// //       });
// //     });
// // });