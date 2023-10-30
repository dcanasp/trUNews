import amqplib from 'amqplib'

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
        const numero = await new Promise<any>((resolve) => {
          channel.consume(q.queue, (msg) => {
            let stringMsg = msg?.content.toString('utf8');
        
            if (msg?.properties.correlationId === correlationId) {
              console.log(stringMsg);
              
              // Replace single quotes with double quotes to make it a valid JSON string
              let jsonString = stringMsg!.replace(/'/g, '"');
        
              let nestedArray;
              try {
                nestedArray = JSON.parse(jsonString);
              } catch (e) {
                console.error("Could not parse message content:", e);
                return;
              }
        
              // Now, nestedArray should be [['text1', 'text2'], [{'label': ..., 'score': ...}, ...]]
        
              // Form the object
              let finalObject = {
                "titulos": nestedArray[0],
                "categorias": nestedArray[1]
              };
              
              resolve(finalObject);
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
