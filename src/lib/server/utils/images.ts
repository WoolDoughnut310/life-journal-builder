import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import logger from "../logger"

let client: S3Client;

export async function retrieveImage(name?: string) {
    if (!client) {
        client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: "eu-west-1"
})
    }

    console.log(process.env.S3_ENDPOINT)
    let e = await client.config.endpoint?.();
    console.log("endpointkaf dlaj dalfjad", e);
    logger.info(`retrieving ${name}.`)
    if (!name) return ''
    let command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${name}.png`,
        ResponseContentType: "image/png"
    })
    const url = await getSignedUrl(client, command)
    logger.info(`got url: ${url}`)
    return url
}
