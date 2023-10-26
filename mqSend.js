
var amqp = require('amqplib/callback_api');
let amqplib = require('amqplib')

var args = process.argv.slice(2);


if (args.length == 0) {
    console.log("Usage: rpc_client.js num");
    process.exit(1);
}
async function sendToQueue() {
    try {
        const connection = await amqplib.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
      
        const q = await channel.assertQueue('', { exclusive: true });
        const correlationId = generateUuid();
        const num = parseInt(args[0]);
      
        console.log(' [x] Requesting fib(%d)', num);
      
        // Wrap the consumer in a Promise to handle the asynchronous behavior.
        const consumeResult = await new Promise((resolve) => {
          channel.consume(q.queue, (msg) => {
            if (msg.properties.correlationId === correlationId) {
              resolve(msg.content.toString());
            }
          }, {
            noAck: true
          });
        });
      
        await channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), {
          correlationId: correlationId,
          replyTo: q.queue
        });
      
        console.log(' [.] Got %s', consumeResult);
      
        // Close the connection and exit the process
        setTimeout(() => {
          connection.close();
          process.exit(0);
        }, 500);
        
      } catch (error) {
        console.error("An error occurred:", error);
        process.exit(1);
      }
        // const connection = await amqplib.connect("amqp://localhost:5672");
        // const channel = await connection.createChannel()
        
        // await channel.assertQueue('',{exclusive:true});
        // var correlationId = generateUuid();
        // var num = parseInt(args[0]);    
        // console.log(' [x] Requesting fib(%d)', num);
    //aqui ya funciona, solo es mandarle el texto de body a el servidor y crear el que escucha en python
        // const data ='prueba sonido';
    // await channel.sendToQueue('')
    // await channel.consume(q.queue, function(msg) {
    //     if (msg.properties.correlationId == correlationId) {
    //       console.log(' [.] Got %s', msg.content.toString());
    //       setTimeout(function() {
    //         connection.close();
    //         process.exit(0)
    //       }, 500);
    //     }
    //   }, {
    //     noAck: true
    //   });

    // await channel.sendToQueue("rpc_queue",  Buffer.from(num.toString()),
    //     {correlationId: correlationId,replyTo: q.queue });
   

amqp.connect('amqp://localhost', async function(error0, connection) {
  if (error0) {
    throw error0;
  }
  await connection.createChannel(async function(error1, channel) {
    if (error1) {
      throw error1;
    }
    await channel.assertQueue('', {
      exclusive: true
    }, async function(error2, q) {
      if (error2) {
        throw error2;
      }
      var correlationId = generateUuid();
      var num = parseInt(args[0]);

      console.log(' [x] Requesting fib(%d)', num);

      await channel.consume(q.queue, function(msg) {
        if (msg.properties.correlationId == correlationId) {
          console.log(' [.] Got %s', msg.content.toString());
          setTimeout(function() {
            connection.close();
            process.exit(0)
          }, 500);
        }
      }, {
        noAck: true
      });

     await channel.sendToQueue('rpc_queue',
        Buffer.from(num.toString()),{
          correlationId: correlationId,
          replyTo: q.queue });
    });
  });
});

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}


}

// sendToQueue()

async function main() {
    try {
      const connection = await amqplib.connect('amqp://localhost:5672');
      const channel = await connection.createChannel();
      const q = await channel.assertQueue('', { exclusive: true });
  
      const correlationId = generateUuid();
      const num = parseInt(args[0]);
      console.log(' [x] Requesting fib(%d)', num);
  
      // Sending the message
      channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), {
        correlationId: correlationId,
        replyTo: q.queue
      });
  
      // Receiving the message
      await new Promise((resolve) => {
        channel.consume(q.queue, (msg) => {
          if (msg.properties.correlationId === correlationId) {
            console.log(' [.] Got %s', msg.content.toString());
            resolve();
            setTimeout(() => {
              connection.close();
              process.exit(0);
            }, 500);
          }
        }, { noAck: true });
      });
  
    } catch (error) {
      console.error('Error:', error);
    }
  
    function generateUuid() {
        return Math.random().toString() +
               Math.random().toString() +
               Math.random().toString();
      }
      
}
  
  main().catch(console.error);