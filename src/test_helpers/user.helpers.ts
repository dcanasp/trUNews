import {UserfollowerSum} from '../dto/user'
import { expect } from '@jest/globals';

export function isUserfollowerSum(obj: any): obj is UserfollowerSum {
    return (
      typeof obj.id_user === 'number' &&
      typeof obj.username === 'string' &&
      typeof obj.name === 'string' &&
      typeof obj.lastname === 'string' &&
      typeof obj.rol === 'number' &&
      typeof obj.followersCount === 'number' &&
      typeof obj.followingsCount === 'number'

      );
  }

  export function anythingOrNullOrUndefined(received:any){
        const pass = received !== null || received !== undefined;
        return {
          message: () => `expected null or undefined or something but got ${received}`,
          pass: pass
        };
      }

