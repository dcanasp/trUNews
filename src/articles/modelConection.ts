import {Server as HttpServer} from 'http';
import {Server as SocketIoServer, Socket} from 'socket.io';
import amqplib from 'amqplib'

// private io: SocketIoServer;

// constructor(private httpServer: HttpServer) {

// Initialize Socket.io
// this.io = new SocketIoServer(httpServer, {
// Additional options if needed
// });

export async function socketCreation() { /*
        this.io.on("connection", (socket: Socket) => {
        console.log(`New client connected with id: ${socket.id}`);
  
        // Listen for 'newArticle' event from the frontend
        socket.on("newArticle", (data) => {
          console.log(`Received new article with id: ${data.id}`);
          
          // TODO: Process the article and push it to RabbitMQ
          
          // After processing, you can emit back the "importantData"
          const importantData = {
            // Your data here
          };
          socket.emit("importantData", importantData);
        });
  
        // Optionally, handle client disconnection
        socket.on("disconnect", () => {
          console.log(`Client ${socket.id} disconnected`);
        });
      });
      */
}

export async function lanzarQueueRespuesta(texto:string) {
    try {
      const user = process.env.rabbitMQCredentials
      const url = process.env.rabbitMQServerIP
        const connection = await amqplib.connect(`amqp://${user}@${url}:5672`);
        const channel = await connection.createChannel();
        const q = await channel.assertQueue('', { exclusive: true });
    
        const correlationId = generateUuid();
        // console.log(' [x] Requesting fib(%d)', texto);
    
        // Sending the message
        channel.sendToQueue('rpc_queue', Buffer.from(texto), {
          correlationId: correlationId,
          replyTo: q.queue
        });
    
        // Receiving the message
        const numero = await new Promise<string>((resolve) => {
          channel.consume(q.queue, (msg) =>  {
            let stringMsg = msg?.content.toString('utf8');

            if (msg?.properties.correlationId === correlationId) {
              // console.log(' [.] Got %s', stringMsg );
              resolve( stringMsg! ); 
              // setTimeout(() => {
              //   connection.close();
              //   process.exit(0);
              // }, 500);
            }
          }, { noAck: true });
        });
        console.log(numero)
        return numero;
      } catch (error) {
        console.error('Error:', error);
      }
    
      function generateUuid() {
          return Math.random().toString() +
                 Math.random().toString() +
                 Math.random().toString();
        }
  
}
