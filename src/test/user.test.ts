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

import {isUserfollowerSum} from '../test_helpers/user.helpers';

const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbCI6MSwiaWF0IjoxNjk2NzcyNDY2LCJleHAiOjE2OTcwMzE2NjZ9.Qo6J-Xy8o368BUJLKE5GQbOvMn2BEEcNUX6-7injxS4";
const pruebasUserId = 1
const pruebasUsername = 'Fatima76'
beforeAll((done) => {
    done();
  });
  
  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    console.log('llega?');
    done();
  });
  
  describe("todos los get", () => {
    
    describe("GET /users/find", () => {
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
            if (Array.isArray(res.body)) {
              res.body.forEach((item) => {
                expect(isUserfollowerSum(item)).toBeTruthy();
              });
            } else {
              throw new Error("Response body is not an array of UserfollowerSum");
            }
            // expect(res.body).toEqual();
          })
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });
    });
   
   
    describe("GET /users/:userId/me", () => {
      test("should return user profile and articles", (done) => {
        request(app)
          .get(`/users/${pruebasUserId}/me`)
          .set("Authorization", authorization)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect((res) => {
            if (res.status > 299) {
              throw new Error("Error status code > 299");
            }
            // Validate the shape of the response object
            expect(res.body).toMatchObject({
              id_user: expect.any(Number),
              username: expect.any(String),
              name: expect.any(String),
              lastname: expect.any(String),
              rol: expect.any(Number),
              profession: expect.any(String),
              description: expect.any(String),
              profile_image: expect.any(String),
              followersCount: expect.any(Number),
              followingsCount: expect.any(Number),
              isFollowing: expect.any(Boolean),
              articlesByUser: expect.arrayContaining([expect.objectContaining({
                id_article: expect.any(Number),
                title: expect.any(String),
                image_url: expect.any(String),
              })]),
              savedArticles: expect.arrayContaining([expect.objectContaining({
                article: expect.objectContaining({
                  id_article: expect.any(Number),
                  title: expect.any(String),
                  date: expect.any(String),
                  image_url: expect.any(String),
                  text: expect.any(String),
                  writer: expect.objectContaining({
                    id_user: expect.any(Number),
                    username: expect.any(String),
                  }),
                }),
              })]),
            });
          })
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });
    });
   
  });
  

  describe("todos los post", () => {
    
    describe("get /users/find", () => {
      test("GET /users/find", (done) => {
        const uniqueUsername = "usuarioJest" + new Date().getTime();
        request(app)
          .post('/users/create').send({
            username:uniqueUsername,lastname:"admin",name:"david",password:"1",rol:0
          })
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect((res) => {
            if (res.status > 299) {
              throw new Error("Error status code > 299");
            }
            expect(res.body).toBeDefined();
            expect(res.body.token).toBeDefined();
            expect(typeof res.body.token).toBe("string");
            expect(res.body.token.split(".").length).toBe(3)
            expect(res.body.user).toMatchObject({
              userId: expect.any(Number),
              rol: expect.any(Number),
            });
                        
            // if (Array.isArray(res.body)) {
            //   res.body.forEach((item) => {
            //     expect(isUserfollowerSum(item)).toBeTruthy();
            //   });
            // } else {
            //   throw new Error("Response body is not an array of UserfollowerSum");
            // }
            // expect(res.body).toEqual();
          })
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
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
// });