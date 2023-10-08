
import { App } from './app';
import dotenv from 'dotenv';


dotenv.config();
const app = new App();

const appInstance = app.listen(+process.env.PORT! || 3006);


export default appInstance;