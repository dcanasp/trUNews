import 'reflect-metadata';
import { Request, Response } from 'express';
import {describe, expect,beforeEach,test, beforeAll, afterAll} from '@jest/globals';
import { mock, instance, when, verify, anything,anyString,} from 'ts-mockito';
import { UserRouter } from '../routes/user.routes';
import { UserController } from '../user/user.controller';
import { UserFacade } from '../user/user.facade';
import {container} from 'tsyringe'
import {UserfollowerSum,followerType} from '../dto/user'
import app from "../server";
import request from "supertest";
import { application } from "express";
import { isUserfollowerSum, anythingOrNullOrUndefined } from '../test_helpers/user.helpers';
import { number } from 'zod';



const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbCI6MSwiaWF0IjoxNjk3MzkzNDIyLCJleHAiOjE2OTc2NTI2MjJ9.qpznsqyeAc-kkIW20TOjIXb1Nb-wczZcWeXnzounSFc";
const pruebasUserId = 1
const pruebasUsername = 'Laurence.Farrell'

// let server:any;
// beforeAll((done) => {
//     server = app.listen(3005, done);
//   });
  
//   afterAll((done) => {
//     server.close(done);
//   });
  

beforeAll((done) => {
    done();
  });
  
  afterAll((done) => {
    console.log('llega?');
    done();
  });
  
  describe("todos los get", () => {

    describe("truco", () => {
      const uniqueUsername = "usuarioJest" + new Date().getTime();

      test('this test will also always pass', () => {
          request(app)
        .get('/users/find')
        .set("Accept", "application/json")
      
          expect(true).toBe(true);
        });
    });
  
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
            

    describe("GET /users/find/jo", () => {
      test("should return an array of users matching the query", (done) => {
        request(app)
          .get("/users/find/jo")
          .set("Authorization", authorization)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect((res) => {
            if (res.status > 299) {
              throw new Error("Error status code > 299");
            }
  
            // Validate that the response is an array
            expect(Array.isArray(res.body)).toBe(true);
            expect.extend({
              anythingOrNullOrUndefined(received) {
                const pass = received !== null || received !== undefined;
                return {
                  message: () => `expected null or undefined or something but got ${received}`,
                  pass: pass
                };
              }
            });

            // Validate the shape of each object in the response array
            res.body.forEach((user:any) => {
              const expectedObject: Record<string, any> = {
                id_user: expect.any(Number),
                username: expect.any(String),
                name: expect.any(String),
                lastname: expect.any(String),
                rol: expect.any(Number),
                followersCount: expect.any(Number),
                followingsCount: expect.any(Number),
                image_url: expect.any(String),
                

              };

              if (user.profession !== null) {
                expectedObject.profession = expect.anything();
              } else {
                expectedObject.profession = null;
              }
            
              if (user.description !== null) {
                expectedObject.description = expect.anything();
              } else {
                expectedObject.description = null;
              }
            
              expect(user).toMatchObject(expectedObject);
            });

          }) // Note that this parenthesis was moved to close the .expect call
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });
    });
 

  describe("GET /users/:userId/me", () => {
    test("should return user profile and possibly articles", async () => {
  
      const res = await request(app)
        .get(`/users/${pruebasUserId}/me`)
        .set("Authorization", authorization)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/);
  
      if (res.status > 299) {
        throw new Error("Error status code > 299");
      }
  
      if ('articlesByUser' in res.body) {
        const article = expect.arrayContaining([
          expect.objectContaining({
            id_article: expect.any(Number),
            title: expect.any(String),
            image_url: expect.any(String),
          }),
        ]);
        expect(res.body.articlesByUser).toMatchObject(article);
      
        delete res.body.articlesByUser;
      }
      if ('savedArticles' in res.body) {
        const article = expect.anything();
        //   savedArticles: expect.arrayContaining(
        //   [
        //   expect.objectContaining({
        //   article: expect.objectContaining({
        //     id_article: expect.any(Number),
        //     title: expect.any(String),
        //     date: expect.any(String),
        //     image_url: expect.any(String),
        //     text: expect.any(String),
        //     writer: expect.objectContaining({
        //       id_user: expect.any(Number),
        //       username: expect.any(String),
        //     }),
        //   }),
        // })]
        
        expect(res.body.savedArticles).toMatchObject(article);
      
        delete res.body.savedArticles;
      }
      if (res.body.profession == null){
        delete res.body.profession;
      }
      if (res.body.description == null){
        delete res.body.description;
      }

      const expectedObject = {
        id_user: expect.any(Number),
        username: expect.any(String),
        name: expect.any(String),
        lastname: expect.any(String),
        rol: expect.any(Number),
        profile_image: expect.any(String),
        followersCount: expect.any(Number),
        followingsCount: expect.any(Number),
        isFollowing: expect.any(Boolean),
      };
      
      expect(res.body).toMatchObject(expectedObject);
    });
  });

    describe("GET /users/trending/5", () => {
      test("should return an array of trending users", (done) => {
        request(app)
          .get('/users/trending/5')
          .set("Authorization", authorization)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect((res) => {
            if (res.status > 299) {
              throw new Error("Error status code > 299");
            }
            expect(Array.isArray(res.body)).toBe(true);
    
            // Validate the shape of each object in the response array
            res.body.forEach((user: any) => {
              const expectedObject: Record<string, any> = {
                users_id_user: expect.any(Number),
                username: expect.any(String),
                name: expect.any(String),
                lastname: expect.any(String),
                weight: expect.any(String)
              };
    
              if (user.profession !== null) {
                expectedObject.profession = expect.any(String);
              } else {
                expectedObject.profession = "";
              }
            
              expect(user).toMatchObject(expectedObject);
            });
          })
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });
    });


    describe("GET /users/followers/:userId", () => {
      test("should return a list of followers for a valid userId", async () => {
        const res = await request(app)
          .get(`/users/followers/${pruebasUserId}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200); // Expect HTTP 200 OK
    
        console.log(`Received response: ${JSON.stringify(res.body, null, 2)}`); // Log the response
        
        expect(Array.isArray(res.body)).toBe(true);
    
        const followers: followerType[] = res.body;
    
        if (followers.length > 0) {
          // Test for expected properties
          followers.forEach(follower => {
            expect(follower).toMatchObject({
              id_user: expect.any(Number),
              username: expect.any(String),
              name: expect.any(String),
              lastname: expect.any(String),
              rol: expect.any(Number),
              profile_image: expect.any(String),
            });
          });
        } else {
          expect(res.body.length).toBe(0);
        }
      });
    });


    describe("GET /users/following/:userId", () => {
      test("should return a list of following for a valid userId", async () => {
        const res = await request(app)
          .get(`/users/following/${pruebasUserId}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200); // Expect HTTP 200 OK
    
        console.log(`Received response: ${JSON.stringify(res.body, null, 2)}`); // Log the response
        
        expect(Array.isArray(res.body)).toBe(true);
    
        const followers: followerType[] = res.body;
    
        if (followers.length > 0) {
          // Test for expected properties
          followers.forEach(follower => {
            expect(follower).toMatchObject({
              id_user: expect.any(Number),
              username: expect.any(String),
              name: expect.any(String),
              lastname: expect.any(String),
              rol: expect.any(Number),
              profile_image: expect.any(String),
            });
          });
        } else {
          expect(res.body.length).toBe(0);
        }
      });
    });



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
    


    describe("Post /users/create", () => {
      test("Post /users/create", (done) => {
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
   
    describe("Post /users/checkPassword", () => {
      test("should return success with a valid token", (done) => {
        request(app)
          .post('/users/checkPassword')

          .send({
            username: pruebasUsername, 
            password: "password",
          })
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect((res) => {
            if (res.status > 299) {
              throw new Error("Error status code > 299");
            }
            expect(res.body).toBeDefined();
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            expect(typeof res.body.token).toBe("string");
            expect(res.body.token.split(".").length).toBe(3);
          })
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });
    });
    
   
    describe("Post /users/decryptJWT", () => {
      test("should return userId and rol from a valid token", (done) => {
        request(app)
          .post('/users/decryptJWT')
          .send({
            token: authorization,
          })
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect((res) => {
            if (res.status > 299) {
              throw new Error("Error status code > 299");
            }
    
            expect(res.body).toBeDefined();
            expect(typeof res.body.userId).toBe('number'); // Validate the type before comparing the value
            expect(typeof res.body.rol).toBe('number'); // Validate the type before comparing the value
          })
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });
    });

   
  });


describe("todos los PUT", () => {
  const testUserId = 1

  describe(`PUT /users/${testUserId}/updateProfile`, () => {
    test("should update the user profile and return the updated object", (done) => {
      request(app)
        .put(`/users/${testUserId}/updateProfile`)
        .set("Authorization", authorization)
        .send({
          profession: "Texto cambio",
          description: "Texto cambio"
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect((res) => {
          if (res.status > 299) {
            throw new Error("Error status code > 299");
          }
          expect(res.body).toBeDefined();
          
          const expectedObject: Record<string, any> = {
            id_user: testUserId,
            username: expect.any(String),
            name: expect.any(String),
            lastname: expect.any(String),
            rol: expect.any(Number),
            profession: expect.any(String),//"Texto cambio",
            description: expect.any(String),//"Texto cambio",
            profile_image: expect.any(String),
          };
  
          expect(res.body).toMatchObject(expectedObject);
        })
        .end((err, res) => {
          if (err) return done(err);
          return done();
        });
    });
  });

  describe(`PUT /users/${testUserId}/updatePassword`, () => {
    test("should update the user password and return success message", (done) => {
      request(app)
        .put(`/users/${testUserId}/updatePassword`)
        .set("Authorization", authorization)
        .send({
          username: pruebasUsername,
          currentPassword: "password",
          newPassword: "password"
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect((res) => {
          if (res.status > 299) {
            throw new Error("Error status code > 299");
          }
          
          expect(res.body).toBeDefined();
          expect(res.body.success).toBe("Contraseña actualizada correctamente");
  
          const expectedUserObject: Record<string, any> = {
            id_user: expect.any(Number),
            username: expect.any(String),
            name: expect.any(String),
            lastname: expect.any(String),
            rol: expect.any(Number),
            profession: expect.any(String),
            description: expect.any(String),
            profile_image: expect.any(String),
          };
  
          expect(res.body.user).toMatchObject(expectedUserObject);
        })
        .end((err, res) => {
          if (err) return done(err);
          return done();
        });
    });
  });

  describe("Post /users/tryImage", () => {
    test("should process image and return base64 encoded string", (done) => {
      const requestBody = {
        extension: ".png",
        width: 10,
        ratio: "4:1",
        contenido: "data:image/png;base64,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5zrYbDYtXLjQrS04ONjtdfbv36/evXsrODhYNWvWVPfu3bV3795zLrc0hYWF6tevnyZMmKAGDRqUmB8eHu42/d///Z9uv/12t9oJEyZo+PDhat68eamvcfLkSY0dO1affvqpHn74YV177bVq0aKF7rvvPrNm9uzZysvL04wZM9S0aVM99NBDeu655/T2229XeJ0AAJcvAjoAAOVUWJipwsJMGYZhtrlceSoszJTLlVtGreus2vz/teeUq/ZCPfbYY5o5c6b5eMaMGRo0aFC5nvvWW2+pbdu22rhxo5555hk9/fTTSklJKbXWy8tLjz76qBISEtzek/nz56uwsFB9+/ZVTk6O2rRpo8WLF2vLli168skn1b9/f61du/aC1y8/P18xMTGqXr26HA6HfvzxRwUEBKhr167Ky8uTJK1cuVI2m+28of3ll19WWFiY4uLizvu6R44c0eLFi8tVe7bExES5XC4dPHhQTZo00dVXX63evXtr//79Zk1SUpJuu+022e12sy0mJkYpKSk6efJkhV4PAHD5IqADAFBODkeAHI4A5ecfN9v2758khyNAO3YMcav98ccwORwByslJNdsOHpwmhyNAKSnuAW/NmvpyOAKUlbXNbEtLS7jgfj7yyCP64YcftG/fPu3bt08//vijHnnkkXI9t1u3bnrmmWd03XXXadSoUQoJCdGKFSvKrH/ssce0a9cuff/992bbzJkz1atXLwUFBalOnToaOXKkWrVqpQYNGujZZ59V165dNW/evAtev7lz58rlcunjjz9W8+bN1aRJE82cOVOpqalauXKlJMnPz0+NGjWSt7d3mcv54Ycf9Mknn+ijjz4q1+vOmjVL1atX1/3331+h/u7evVsul0sTJ07U5MmTtWDBAp04cUJ33XWX+YFCWlqaatWq5fa84sdpaWkVej0AwOXLq7I7AAAA/lyhoaGKjY01j2zHxsYqJCSkXM89+zvjNptN4eHhOnr0aJn1jRs3Vvv27TVjxgx16tRJO3fulMPh0Msvvyyp6BTyiRMnat68eTp48KDy8vKUm5srPz+/C16/TZs2aefOnSW+P5+Tk6Ndu3ZJkm666SZt3769zGWcPn1a/fv310cffVTu92bGjBnq16+ffH19K9Rfl8ul/Px8vfvuu+rSpYsk6fPPP1d4eLhWrFjh9l10AMCVjYAOAEA5deiQIUny8DgTLiMjX9DVVw+Tzeb+J/WWW47+r7aa2VanzmBFRDwhydOt9uab95aoDQ8f+If6+thjj2nIkKKj+tOmTSv3835/xNlms8nlcpVRXSQuLk7PPvuspk2bppkzZ+raa69Vx44dJUmTJk3SlClTNHnyZDVv3lz+/v4aNmyYeeS4NDabze2UeanotPZiGRkZatOmjWbPnl3iuaGhoeddR0natWuX9u7dq3vvvddsK15PLy8vpaSk6NprrzXnORwOpaSkaO7cueVa/tlq164tSYqKinLrZ0hIiFJTi86wCA8P15EjR9yeV/w4PDy8wq8JALg8EdABACgnT0//Em0eHnZJ9nLWeksqecp12bUXrvj72Dab7aIfoe3du7eGDh2qzz77TJ9++qmefvpp2Ww2SdKPP/6o7t27m6fYu1wu/fe//3ULq78XGhqqw4cPm4937NihrKws83Hr1q01d+5chYWFKTAw8IL63LhxY23evNmtbezYsTp9+rSmTJmiyMhIt3mffPKJ2rRpo5YtW1b4tW655RZJUkpKiq6++mpJ0okTJ3T8+HHVq1dPktSuXTuNGTNG+fn55ockiYmJatSokWrUqFHh1wQAXJ74DjoAAFWQp6entm3bpl9//VWenp7nf8IfEBAQoD59+mj06NE6fPiw273Wr7/+eiUmJmr16tXatm2b/vKXv5Q4Uvx7d9xxh6ZOnaqNGzdq3bp1euqpp9yO7Pfr108hISHq3r27HA6H9uzZo5UrV+q5554zb/m2du1aNW7cWAcPHiz1NXx9fdWsWTO3KTg4WNWrV1ezZs3cLtbmdDo1f/58Pf7446UuKzU1VcnJyUpNTVVhYaGSk5OVnJysjIyiMy4aNmyo7t27a+jQoVq9erW2bNmiAQMGqHHjxrr99tslSQ8//LDsdrvi4uK0detWzZ07V1OmTNGIESPOvwEAAFUGAR0AgCoqMDDwgo8wV1RcXJxOnjypmJgYRUREmO1jx45V69atFRMTo06dOik8PFw9evQ457LeeustRUZGqkOHDnr44Yc1cuRIt++s+/n5adWqVapbt67uv/9+NWnSRHFxccrJyTHXNysrSykpKW6nxl+oOXPmyDAM9e3bt9T548aN0w033KD4+HhlZGTohhtu0A033KB169aZNZ9++qmio6MVGxurjh07ytvbW0uXLjU/eAgKCtK3336rPXv2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c+bM0bXXXitJ6tSpkwzDKHWqX7++uYx69eppyZIlysrK0rFjx/Tmm2+at2Er1qlTJ23cuFG5ubnatWtXqachDhkyRPv27VNubq5++uknRUdHX8xVBwCcpTCzUIWZhTIMw2xz5blUmFkoV66r9FrXWbX5RbWFOYXlqr1Qjz32mGbOnGk+njFjRqlnW2VmZmrEiBFat26dli1bJg8PD/Xs2VMuV9FrP/roo+rWrZv69eungoICLV68WB9//LFmz54tPz+/Ul87Li5Oy5cv1759+8y23bt3a9WqVeaFVatXr66EhAT9+uuvmjJlij766CO98847F7y+UtHfx6SkJM2ZM0e//PKLHnzwQXXt2lU7duwwa2w2mxISEs67rPvuu09hYWG69dZbSz3qXcwwDC1btkwpKSm67bbbzPb27dvrq6++0sGDB2UYhlasWKH//ve/6tKli1mTlZWlhx9+WNOmTSv1WjLluUUrAKDqIaADAFBOjgCHHAEO5R/PN9v2T9ovR4BDO4bscKv9MexHOQIcykk9833sg9MOyhHgUEpcilvtmvpr5AhwKGtbltmWllD2LTTP55FHHtEPP/ygffv2ad++ffrxxx9LPbW8V69euv/++3XdddepVatWmjFjhjZv3qxff/3VrPnnP/+pw4cP67nnnlNcXJzGjx/vdsr378XExCgiIsLtA4KEhARFRkbqzjvvlCSNHTtW7du3V/369XXvvfdq5MiRmjdv3gWvb2pqqmbOnKn58+erQ4cOuvbaazVy5Ejdeuutbv1o1KiRgoKCylxOQECA3nrrLc2fP1+LFy/Wrbfeqh49epQI6enp6QoICJDdbldsbKzee+893XXXXeb89957T1FRUbr66qtlt9vVtWtXTZs2zS3EDx8+XO3bt1f37t1L7Ut5btEKAKh6uM0aAABVTGhoqGJjY5WQkCDDMBQbG6uQkJASdTt27NC4ceP0008/6fjx4+aR89TUVDVr1kySVKNGDX3yySeKiYlR+/bt9dJLL53ztT09PTVgwAAlJCQoPj5ehmFo1qxZGjRokDw8io4LzJ07V++++6527dqljIwMFRQU/KGLmG7evFmFhYVq2LChW3tubq6uuuoq8/H27dvPuZyQkBCNGDHCfHzjjTfq0KFDmjRpku677z6zvXr16kpOTlZGRoaWLVumESNGqEGDBurUqZOkooC+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HafTqaCgIB06lK7AwMByP49T04pwaloRTk07o7JPTasoTl8twhhRhDGi9OUyRhT9zBhR9DNjRMnlMkZUnTHC6XQqIiJI6ekVywa4eAjoV5jigM4vIQAAAHBlIxtYD6e4AwAAAABgAQR0AAAAAAAsgIAOAAAAAIAFENABAAAAALAAAjoAAAAAABZAQD+P8ePHy2azuU2NGzc253/44Yfq1KmTAgMDZbPZdOrUqRLLOHHihPr166fAwEAFBwcrLi5OGRkZbjW//PKLOnToIF9fX0VGRuqNN94osZz58+ercePG8vX1VfPmzbVkyZI/fX0BAAAAAJWDgF4OTZs21eHDh83phx9+MOdlZWWpa9eu+utf/1rm8/v166etW7cqMTFRixYt0qpVq/Tkk0+a851Op7p06aJ69epp/fr1mjRpksaPH68PP/zQrFm9erX69u2ruLg4bdy4UT169FCPHj20ZcuWi7PSAAAAAIBLivugn8f48eO1cOFCJScnn7Nu5cqVuv3223Xy5EkFBweb7du2bVNUVJR+/vlntW3bVpK0dOlSdevWTQcOHFBERIQ++OADjRkzRmlpabLb7ZKkl156SQsXLtT27dslSX369FFmZqYWLVpkLvvmm29Wq1atNH369HKvD/c6BAAAACCRDayII+jlsGPHDkVERKhBgwbq16+fUlNTy/3cpKQkBQcHm+Fckjp37iwPDw/99NNPZs1tt91mhnNJiomJUUpKik6ePGnWdO7c2W3ZMTExSkpK+iOrBgAAAACwCAL6eURHRyshIUFLly7VBx98oD179qhDhw46ffp0uZ6flpamsLAwtzYvLy/VrFlTaWlpZk2tWrXcaoofn6+meH5ZcnNz5XQ63SYAAAAAgPV4VXYHrO7uu+82f27RooWio6NVr149zZs3T3FxcZXYs/J59dVXNWHChMruBgAAAADgPDiCXkHBwcFq2LChdu7cWa768PBwHT161K2toKBAJ06cUHh4uFlz5MgRt5rix+erKZ5fltGjRys9Pd2c9u/fX65+AwAAAAAuLQJ6BWVkZGjXrl2qXbt2uerbtWunU6dOaf369Wbb8uXL5XK5FB0dbdasWrVK+fn5Zk1iYqIaNWqkGjVqmDXLli1zW3ZiYqLatWt3ztf38fFRYGCg2wQAAAAAsB4C+nmMHDlS33//vfbu3avVq1erZ8+e8vT0VN++fSUVfTc8OTnZPKK+efNmJScn68SJE5KkJk2aqGvXrnriiSe0du1a/fjjjxoyZIgeeughRURESJIefvhh2e12xcXFaevWrZo7d66mTJmiESNGmP0YOnSoli5dqrfeekvbt2/X+PHjtW7dOg0ZMuQSvyMAAAAAgIuBgH4eBw4cUN++fdWoUSP17t1bV111ldasWaPQ0FBJ0vTp03XDDTfoiSeekCTddtttuuGGG/TVV1+Zy5g9e7YaN26sO++8U926ddOtt97qdo/zoKAgffvtt9qzZ4/atGmj559/XuPGjXO7V3r79u312Wef6cMPP1TLli21YMECLVy4UM2aNbtE7wQAAAAA4GLiPuhXGO51CAAAAEAiG1gRR9ABAAAAALAAAjoAAAAAABZAQAcAAAAAwAII6AAAAAAAWAABHQAAAAAACyCgAwAAAABgAQR0AAAAAAAsgIAOAAAAAIAFVOmAXlBQoO+++07//Oc/dfr0aUnSoUOHlJGRUck9AwAAAADAnVdld+Bi2bdvn7p27arU1FTl5ubqrrvuUvXq1fX6668rNzdX06dPr+wuAgAAAABgqrJH0IcOHaq2bdvq5MmTqlatmtnes2dPLVu2rBJ7BgAAAABASVX2CLrD4dDq1atlt9vd2uvXr6+DBw9WUq8AAAAAAChdlT2C7nK5VFhYWKL9wIEDql69eiX0CAAAAACAslXZgN6lSxdNnjzZfGyz2ZSRkaH4+Hh169at8joGAAAAAEApbIZhGJXdiYvhwIEDiomJkWEY2rFjh9q2basdO3YoJCREq1atUlhYWGV3sVI4nU4FBQUpPT1dgYGBld0dAAAAAJWEbGA9VTagS0W3WZszZ45++eUXZWRkqHXr1urXr5/bReOuNPwSAgAAAJDIBlZUZS8SJ0leXl565JFHKrsbAAAAAACcV5UN6J9++uk55z/66KOXqCcAAAAAAJxflT3FvUaNGm6P8/PzlZWVJbvdLj8/P504caKSela5OI0FAAAAgEQ2sKIqexX3kydPuk0ZGRlKSUnRrbfeqs8//7yyuwcAAAAAgJsqG9BLc/311+u1117T0KFDK7srAAAAAAC4uaICulR04bhDhw5VdjcAAAAAAHBTZS8S99VXX7k9NgxDhw8f1tSpU3XLLbdUUq8AAAAAAChdlQ3oPXr0cHtss9kUGhqqO+64Q2+99VbldAoAAAAAgDJU2YDucrkquwsAAAAAAJTbFfcddAAAAAAArKhKHUEfMWJEuWvffvvti9gTAAAAAAAqpkoF9I0bN5arzmazXeSeAAAAAABQMVUqoK9YsaKyuwAAAAAAwAXhO+gAAAAAAFhAlTqC/nvr1q3TvHnzlJqaqry8PLd5X3zxRSX1CgAAAACAkqrsEfQ5c+aoffv22rZtm7788kvl5+dr69atWr58uYKCgiq7ewAAAAAAuKmyAX3ixIl655139J///Ed2u11TpkzR9u3b1bt3b9WtW7eyuwcAAAAAgJsqG9B37dql2NhYSZLdbldmZqZsNpuGDx+uDz/8sJJ7BwAAAACAuyob0GvUqKHTp09LkurUqaMtW7ZIkk6dOqWsrKzK7BoAAAAAACVUuYBeHMRvu+02JSYmSpIefPBBDR06VE888YT69u2rO++8szK7CAAAAABACVXuKu4tWrTQjTfeqB49eujBBx+UJI0ZM0be3t5avXq1evXqpbFjx1ZyLwEAAAAAcGczDMOo7E78mRwOh2bOnKkFCxbI5XKpV69eevzxx9WhQ4fK7polOJ1OBQUFKT09XYGBgZXdHQAAAACVhGxgPVXuFPcOHTpoxowZOnz4sN577z3t3btXHTt2VMOGDfX6668rLS2tsrsIAAAAAEAJVS6gF/P399egQYP0/fff67///a8efPBBTZs2TXXr1tV9991X2d0DAAAAAMBNlTvFvSyZmZmaPXu2Ro8erVOnTqmwsLCyu1QpOI0FAAAAgEQ2sKIqd5G431u1apVmzJihf//73/Lw8FDv3r0VFxdX2d0CAAAAAMBNlQzohw4dUkJCghISErRz5061b99e7777rnr37i1/f//K7h4AAAAAACVUuYB+991367vvvlNISIgeffRRPfbYY2rUqFFldwsAAAAAgHOqcgHd29tbCxYs0D333CNPT8/K7g4AAAAAAOVS5QL6V199VdldAAAAAACgwqrsbdYAAAAAALicENABAAAAALAAAjoAAAAAABZAQAcAAAAAwAII6AAAAAAAWAABHQAAAAAACyCgl8P48eNls9ncpsaNG5vzc3JyNHjwYF111VUKCAhQr169dOTIEbdlpKamKjY2Vn5+fgoLC9MLL7yggoICt5qVK1eqdevW8vHx0XXXXaeEhIQSfZk2bZrq168vX19fRUdHa+3atRdlnQEAAAAAlxYBvZyaNm2qw4cPm9MPP/xgzhs+fLj+85//aP78+fr+++916NAh3X///eb8wsJCxcbGKi8vT6tXr9asWbOUkJCgcePGmTV79uxRbGysbr/9diUnJ2vYsGF6/PHH9c0335g1c+fO1YgRIxQfH68NGzaoZcuWiomJ0dGjRy/NmwAAAAAAuGhshmEYld0Jqxs/frwWLlyo5OTkEvPS09MVGhqqzz77TA888IAkafv27WrSpImSkpJ088036+uvv9Y999yjQ4cOqVatWpKk6dOna9SoUTp27JjsdrtGjRqlxYsXa8uWLeayH3roIZ06dUpLly6VJEVHR+vGG2/U1KlTJUkul0uRkZF69tln9dJLL5VrXZxOp4KCgpSenq7AwMA/8rYAAAAAuIyRDayHI+jltGPHDkVERKhBgwbq16+fUlNTJUnr169Xfn6+OnfubNY2btxYdevWVVJSkiQpKSlJzZs3N8O5JMXExMjpdGrr1q1mzdnLKK4pXkZeXp7Wr1/vVuPh4aHOnTubNaXJzc2V0+l0mwAAAAAA1kNAL4fo6GglJCRo6dKl+uCDD7Rnzx516NBBp0+fVlpamux2u4KDg92eU6tWLaWlpUmS0tLS3MJ58fzieeeqcTqdys7O1vHjx1VYWFhqTfEySvPqq68qKCjInCIjIy/oPQAAAAAAXFxeld2By8Hdd99t/tyiRQtFR0erXr16mjdvnqpVq1aJPTu/0aNHa8SIEeZjp9NJSAcAAAAAC+II+gUIDg5Ww4YNtXPnToWHhysvL0+nTp1yqzly5IjCw8MlSeHh4SWu6l78+Hw1gYGBqlatmkJCQuTp6VlqTfEySuPj46PAwEC3CQAAAABgPQT0C5CRkaFdu3apdu3aatOmjby9vbVs2TJzfkpKilJTU9WuXTtJUrt27bR582a3q60nJiYqMDBQUVFRZs3ZyyiuKV6G3W5XmzZt3GpcLpeWLVtm1gAAAAAALl8E9HIYOXKkvv/+e+3du1erV69Wz5495enpqb59+yooKEhxcXEaMWKEVqxYofXr12vQoEFq166dbr75ZklSly5dFBUVpf79+2vTpk365ptvNHbsWA0ePFg+Pj6SpKeeekq7d+/Wiy++qO3bt+v999/XvHnzNHz4cLMfI0aM0EcffaRZs2Zp27Ztevrpp5WZmalBgwZVyvsCAAAAAPjz8B30cjhw4ID69u2r3377TaGhobr11lu1Zs0ahYaGSpLeeecdeXh4qFevXsrNzVVMTIzef/998/menp5atGiRnn76abVr107+/v4aMGCAXn75ZbPmmmuu0eLFizV8+HBNmTJFV199tT7++GPFxMSYNX369NGxY8c0btw4paWlqVWrVlq6dGmJC8cBAAAAAC4/3Af9CsO9DgEAAABIZAMr4hR3AAAAAAAsgIAOAAAAAIAFENABAAAAALAAAjoAAAAAABZAQAcAAAAAwAII6AAAAAAAWAABHQAAAAAACyCgAwAAAABgAQR0AAAAAAAsgIAOAAAAAIAFENABAAAAALAAAjoAAAAAABZAQAcAAAAAwAII6AAAAAAAWAABHQAAAAAACyCgAwAAAABgAQR0AAAAAAAswKuyO4BKkpkpeXpWdi8AAAAAVJbMzMruAX6HgH6lioio7B4AAAAAAM7CKe4AAAAAAFgAR9CvVIcOSYGBld0LAAAAAJXF6eTMWoshoF+p/P2LJgAAAABXpsLCyu4BfodT3AEAAAAAsAACOgAAAAAAFkBABwAAAADAAgjoAAAAAABYAAEdAAAAAAALIKADAAAAAGABBHQAAAAAACyAgA4AAAAAgAUQ0AEAAAAAsAACOgAAAAAAFkBABwAAAADAAgjoAAAAAABYAAEdAAAAAAALIKADAAAAAGABBHQAAAAAACyAgA4AAAAAgAUQ0AEAAAAAsAACOgAAAAAAFkBABwAAAADAAgjoAAAAAABYAAEdAAAAAAALIKADAAAAAGABBHQAAAAAACyAgA4AAAAAgAUQ0AEAAAAAsAACOgAAAAAAFkBABwAAAADAAgjoAAAAAABYAAEdAAAAAAALIKADAAAAAGABBPQKeu2112Sz2TRs2DCzbdeuXerZs6dCQ0MVGBio3r1768iRI27PO3HihPr166fAwEAFBwcrLi5OGRkZbjW//PKLOnToIF9fX0VGRuqNN94o8frz589X48aN5evrq+bNm2vJkiUXZT0BAAAAAJcWAb0Cfv75Z/3zn/9UixYtzLbMzEx16dJFNptNy5cv148//qi8vDzde++9crlcZl2/fv20detWJSYmatGiRVq1apWefPJJc77T6VSXLl1Ur149rV+/XpMmTdL48eP14YcfmjWrV69W3759FRcXp40bN6pHjx7q0aOHtmzZcmneAAAA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"
      };
  
      request(app)
        .post('/users/tryImage')
        .send(requestBody)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200) // Expect HTTP 200 OK
        .expect((res) => {
          if (!res.body.image.startsWith("data:image/jpeg;base64,")) {
            throw new Error("Image data format mismatch");
          }
        })
        .end((err, res) => {
          if (err) return done(err);
          return done();
        });
    });
  });



});
