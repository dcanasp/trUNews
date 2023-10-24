import amqplib from 'amqplib'

async function send(i){

    const connection = await amqplib.connect("amqp://localhost:5672");
    const channel = await connection.createChannel()

    await channel.assertQueue("test-queue");

    const data ='prueba sonido';
    // await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
    channel.sendToQueue("test-queue", Buffer.from(`Message ${i}`))

}

for(let i =0;i<50;i++){
    send(i)
}