let amqplib = require('amqplib')
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// var amqp = require('amqplib/callback_api');

// amqp.connect('amqp://localhost', async function(error0, connection) {
//   if (error0) {
//     throw error0;
//   }
//   connection.createChannel(async function(error1, channel) {
//     if (error1) {
//       throw error1;
//     }
//     var queue = 'rpc_queue';

//     channel.assertQueue(queue, {
//       durable: false
//     });
//     channel.prefetch(1);
//     console.log(' [x] Awaiting RPC requests');
//     channel.consume(queue, async function reply(msg) {
//       var n = parseInt(msg.content.toString());
//       // n = 5;
//       console.log(" [.] fib(%d)", n);
      
//       var r = await fibonacci(n);

//       channel.sendToQueue(msg.properties.replyTo,
//         Buffer.from(r.toString()), {
//           correlationId: msg.properties.correlationId
//         });

//       channel.ack(msg);
//     });
//   });
// });

async function texto(n) {
  const tiempo = Math.random()*1000 + 3000
  await sleep(tiempo)
  return '';
  // return '{"err":true,"titulos":["mejor titulo existente","segundo mejor titulo","tercero"],"categorias":[{"label": "EDUCATION","score": 0.34894150495529175 },{"label": "BUSINESS","score": 0.3029727041721344},{"label": "POLITICS","score": 0.08930222690105438},]}';
}

async function fibonacci(n) {
  if (n === 0 || n === 1) {
    await sleep(50); 
    return n;
  } else {
    const a = await fibonacci(n - 1); 
    const b = await fibonacci(n - 2);
    return a + b;
  }
}

async function main() {
  try {
    const connection = await amqplib.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();

    const queue = 'rpc_queue';
    await channel.assertQueue(queue, { durable: false });
    channel.prefetch(1);

    console.log(' [x] Awaiting RPC requests');

    await new Promise((resolve) => {
      channel.consume(queue, async (msg) => {
        const n = parseInt(msg.content.toString());
        console.log(" [.] fib(%d)", n);

        // const r = await fibonacci(n);
        const r = await texto(n);
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
          correlationId: msg.properties.correlationId
        });

        channel.ack(msg);
      });
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);