
import { App } from './app';
import dotenv from 'dotenv';


dotenv.config();
const app = new App();
app.listen(3000);