import amqp from 'amqplib';

let channel: amqp.Channel;

export async function connectToRabbitMQ(): Promise<void> {
    try {
        const connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
}

export async function sendToQueue(queueName: string, data: any): Promise<void> {
    try {
        if (!channel) {
            console.error('RabbitMQ channel is not initialized.');
            return;
        }
        await channel.assertQueue(queueName);
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
        console.log('Message sent to RabbitMQ:', data);
    } catch (error) {
        console.error('Error sending data to RabbitMQ:', error);
    }
}
