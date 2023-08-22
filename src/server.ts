
import { App } from './app';
import { UserModule } from './users/users.module';

const userModule = new UserModule();
const userController = userModule.getUserController(); // Assuming you have a method for this in UserModule
//cuando me funcione elminino esto 

const app = new App(userController);
app.listen(3000);