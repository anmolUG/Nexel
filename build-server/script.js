require('dotenv').config()

const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const mime = require('mime-types')
const { Kafka } = require('kafkajs')


const kafka = new Kafka({
    clientId: 'build-server',
    brokers: [process.env.KAFKA_BROKER],
    ssl: {
        ca: [fs.readFileSync(path.join(__dirname, 'ca.pem'), 'utf-8')],
        key: fs.readFileSync(path.join(__dirname, 'kafka.key'), 'utf-8'),
        cert: fs.readFileSync(path.join(__dirname, 'kafka.cert'), 'utf-8')
    }
})

const producer = kafka.producer()

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const PROJECT_ID = process.env.PROJECT_ID


async function publishLog(log) {
    await producer.send({
        topic: 'build-logs',
        messages: [
            {
                key: PROJECT_ID,
                value: JSON.stringify({ log, projectId: PROJECT_ID, timestamp: new Date().toISOString() })
            }
        ]
    })
}

async function init() {
    await producer.connect()
    console.log('Executing script.js')
    await publishLog('Build Started...')
    const outDirPath = path.join(__dirname, 'output')

    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data', async function (data) {
        console.log(data.toString())
        await publishLog(data.toString())
    })

    p.stdout.on('error', async function (data) {
        console.log('Error', data.toString())
        await publishLog(`error: ${data.toString()}`)
    })

    p.on('close', async function () {
        console.log('Build Complete')
        await publishLog('Build Complete')
        const distFolderPath = path.join(__dirname, 'output', 'dist')
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true })

        await publishLog('Starting to upload')
        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file)
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading', filePath)
            await publishLog(`uploading ${file}`)

            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            })

            await s3Client.send(command)
            await publishLog(`uploaded ${file}`)
            console.log('uploaded', filePath)
        }
        await publishLog('Done')
        console.log('Done...')
        await producer.disconnect()
    })
}

init()