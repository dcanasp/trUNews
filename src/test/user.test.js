require("reflect-metadata")
// const request = require('supertest');
var App = require("../app");
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});


// jest.mock('tsyringe');

// const mockUserController = {
//   addUsers: jest.fn(),
//   checkPassword: jest.fn(),
// };
// jest.spyOn(container, 'resolve').mockImplementation((someClass) => {
//     if (someClass === 'UserController') {
//       return mockUserController;
//     }
//     // else if (someClass === 'SomeOtherClass') return somethingElse;
//   });

// // (container.resolve as jest.Mock).mockImplementation((someClass) => {
// //     if (someClass === 'UserController') {
// //       return mockUserController;
// //     }
// //     // else if (someClass === 'SomeOtherClass') return somethingElse;
// //   });



// describe('User Routes', () => {
//   describe('POST /users/create', () => {
//     it('should create a user', async () => {
//       const userData = {"username":"escritor2","lastname":"admin","name":"david","password":"1","rol":1};

//       const res = await request(App)
//         .post('/users/create')
//         .send(userData);

//       expect(res.status).toBe(200);
//       expect(res.body).toHaveProperty('user');
//       expect(res.body).toHaveProperty('token');
//     });
//   });
// });

// describe('POST /users/checkPassword', () => {
//     it('should validate the user password', async () => {
//       const credentials = {
//         username: 'test',
//         password: 'test123',
//       };
  
//       const res = await request(App)
//         .post('/users/checkPassword')
//         .send(credentials);
  
//       expect(res.status).toBe(200);
//     });
//   });
  