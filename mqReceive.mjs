import amqplib from 'amqplib'
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function receive(){

const connection2 = await amqplib.connect("amqp://localhost:5672");
const channel2    = await connection2.createChannel()

await channel2.assertQueue("test-queue")
await channel2.prefetch(1);

console.log("prueba")
channel2.consume("test-queue", async (data) => {
    await sleep(5000);
    console.log(`${Buffer.from(data.content)}`);
    channel2.ack(data);
})

}
receive()