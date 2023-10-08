
import { App } from './app';
import dotenv from 'dotenv';


dotenv.config();
const app = new App();

app.listen(+process.env.PORT! || 3006);


export default app