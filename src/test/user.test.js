import "reflect-metadata"
import { container } from 'tsyringe';
import request from 'supertest';
import {App} from '../app';

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



describe('User Routes', () => {
  describe('POST /users/create', () => {
    it('should create a user', async () => {
      const userData = {
        username: 'test',
        password: 'test123',
      };

      const res = await request(App)
        .post('/users/create')
        .send(userData);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');
    });
  });
});

describe('POST /users/checkPassword', () => {
    it('should validate the user password', async () => {
      const credentials = {
        username: 'test',
        password: 'test123',
      };
  
      const res = await request(App)
        .post('/users/checkPassword')
        .send(credentials);
  
      expect(res.status).toBe(200);
    });
  });
  