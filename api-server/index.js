require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { generateSlug } = require('random-word-slugs')
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs')
const { Server } = require('socket.io')
const { Kafka } = require('kafkajs')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 9000

const kafka = new Kafka({
    clientId: 'api-server',
    brokers: [process.env.KAFKA_BROKER],
    ssl: {
        ca: [fs.readFileSync(path.join(__dirname, 'ca.pem'), 'utf-8')],
        key: fs.readFileSync(path.join(__dirname, 'kafka.key'), 'utf-8'),
        cert: fs.readFileSync(path.join(__dirname, 'kafka.cert'), 'utf-8')
    }
})

const consumer = kafka.consumer({ groupId: 'api-server-logs-consumer' })

const io = new Server({ cors: '*' })

io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})

io.listen(9002, () => console.log('Socket Server 9002'))

const ecsClient = new ECSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const config = {
    CLUSTER: process.env.ECS_CLUSTER,
    TASK: process.env.ECS_TASK
}

app.use(cors())
app.use(express.json())

app.post('/project', async (req, res) => {
    const { gitURL, slug } = req.body
    const projectSlug = slug ? slug : generateSlug()

    // Spin the container
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: [
                    process.env.SUBNET_1,
                    process.env.SUBNET_2,
                    process.env.SUBNET_3
                ].filter(Boolean),
                securityGroups: [process.env.SECURITY_GROUP]
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: 'builder-image',
                    environment: [
                        { name: 'GIT_REPOSITORY__URL', value: gitURL },
                        { name: 'PROJECT_ID', value: projectSlug },
                        { name: 'KAFKA_BROKER', value: process.env.KAFKA_BROKER },
                        { name: 'AWS_ACCESS_KEY_ID', value: process.env.AWS_ACCESS_KEY_ID },
                        { name: 'AWS_SECRET_ACCESS_KEY', value: process.env.AWS_SECRET_ACCESS_KEY },
                        { name: 'AWS_REGION', value: process.env.AWS_REGION },
                        { name: 'S3_BUCKET', value: process.env.S3_BUCKET }
                    ]
                }
            ]
        }
    })

    await ecsClient.send(command)

    return res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000` } })
})

async function initKafkaConsumer() {
    console.log('Connecting to Kafka...')
    await consumer.connect()
    await consumer.subscribe({ topic: 'build-logs', fromBeginning: false })
    console.log('Subscribed to build-logs topic')

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) return
            const data = JSON.parse(message.value.toString())
            const projectId = message.key ? message.key.toString() : data.projectId
            io.to(`logs:${projectId}`).emit('message', data)
        }
    })
}


initKafkaConsumer()

app.listen(PORT, () => console.log(`API Server Running..${PORT}`))