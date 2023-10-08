import {UserfollowerSum} from '../dto/user'
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
