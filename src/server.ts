
import { App } from './app';
import dotenv from 'dotenv';


dotenv.config();
const app = new App();

app.listen(+process.env.PORT! || 3006);
//hagalo numero y le digo que no deberia ser nulo 

//scp -i /path/to/private/key.pem /path/to/local/file ec2-user@ip.address:/path/to/remote/directory