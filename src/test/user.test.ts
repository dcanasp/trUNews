// import 'reflect-metadata';
// import { Request, Response } from 'express';
// import {describe, expect, beforeEach,test} from '@jest/globals';
// import { mock, instance, when, verify, anything,anyString,} from 'ts-mockito';
// import { UserRouter } from '../routes/user.routes';
// import { UserController } from '../user/user.controller';
// import { UserFacade } from '../user/user.facade';
// import {container} from 'tsyringe'
// import {UserfollowerSum} from '../dto/user'
// import {App} from "../app";
// import request from "supertest";
// import { application } from "express";
// const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NTg0NjE5NjV9.KUmepH0LTTAXfYiUflqUSJyykehLQh_luPNYg1ZVdio";


// const userFacade = container.resolve(UserFacade);

// describe('UserRoutes', () => {

//   let mockedRequest: Request;
//   let mockedResponse: Response;
//   let userControllerInstance: UserController;

//   beforeEach(() => {
//     mockedRequest = mock<Request>();
//     mockedResponse = mock<Response>();
//     userControllerInstance = new UserController(userFacade);
//   });


//   test('findAllUser should return users with correct structure and types', async () => {
//     // Mock the res.json() to capture the output
//     when(userControllerInstance.findUser(mockedRequest,mockedResponse).json).thenReturn((data: UserfollowerSum[]) => {
//       const isCorrect = data.every(user => {
//         return typeof user.id_user === 'number' &&
//                typeof user.username === 'string' &&
//                typeof user.name === 'string' &&
//                typeof user.lastname === 'string' &&
//                typeof user.rol === 'number' &&
//                (typeof user.profession === 'string' || user.profession === null) &&
//                (typeof user.description === 'string' || user.description === null) &&
//                (typeof user.image_url === 'string' || user.image_url === null) &&
//                typeof user.followersCount === 'number' &&
//                typeof user.followingsCount === 'number';
//       });

//       expect(isCorrect).toBe(true);
//       return mockedResponse;
//     });

//     // Assuming you have mocked or injected actual dependencies into userControllerInstance
//     await userControllerInstance.findAllUser(instance(mockedRequest), instance(mockedResponse));

//     // Verify the response was called once (we've already checked the structure in the mock)
//     verify(mockedResponse.json(anything())).once();
//   });

//   // Add more tests for other routes and scenarios
// });

// // import("reflect-metadata")
// // // const request = require('supertest');
// // import {App} from '../app'
// // // import {sum}from '.././sum';
// // import {describe, expect, test} from '@jest/globals';

// // // describe('Sum Function', () => {
// // //   test('adds 1 + 2 to equal 3', () => {
// // //     expect(sum(1, 2)).toBe(3);
// // //   });
// // // });



// // describe('Sum Function', () => {
// //   test('adds 1 + 2 to equal 3', () => {
// //     expect(App(1, 2)).toBe(3);
// //   });
// // });
// // // jest.mock('tsyringe');

// // // const mockUserController = {
// // //   addUsers: jest.fn(),
// // //   checkPassword: jest.fn(),
// // // };
// // // jest.spyOn(container, 'resolve').mockImplementation((someClass) => {
// // //     if (someClass === 'UserController') {
// // //       return mockUserController;
// // //     }
// // //     // else if (someClass === 'SomeOtherClass') return somethingElse;
// // //   });

// // // // (container.resolve as jest.Mock).mockImplementation((someClass) => {
// // // //     if (someClass === 'UserController') {
// // // //       return mockUserController;
// // // //     }
// // // //     // else if (someClass === 'SomeOtherClass') return somethingElse;
// // // //   });



// // // describe('User Routes', () => {
// // //   describe('POST /users/create', () => {
// // //     it('should create a user', async () => {
// // //       const userData = {"username":"escritor2","lastname":"admin","name":"david","password":"1","rol":1};

// // //       const res = await request(App)
// // //         .post('/users/create')
// // //         .send(userData);

// // //       expect(res.status).toBe(200);
// // //       expect(res.body).toHaveProperty('user');
// // //       expect(res.body).toHaveProperty('token');
// // //     });
// // //   });
// // // });

// // // describe('POST /users/checkPassword', () => {
// // //     it('should validate the user password', async () => {
// // //       const credentials = {
// // //         username: 'test',
// // //         password: 'test123',
// // //       };

// // //       const res = await request(App)
// // //         .post('/users/checkPassword')
// // //         .send(credentials);

// // //       expect(res.status).toBe(200);
// // //     });
// // //   });
