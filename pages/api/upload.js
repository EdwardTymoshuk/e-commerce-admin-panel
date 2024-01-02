import multiparty from 'multiparty'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import fs from 'fs'
import mime from 'mime-types'
import { mongooseConnect } from '../../lib/mongoose'
import { isAdminRequest } from '../api/auth/[...nextauth]'

const bucketName = 'edward-ecommerce-next-app'

export default async function handle(req, res) {
  try {
    // Connect to MongoDB before processing the request
    await mongooseConnect()

    // Ensure that the request is coming from an admin
    await isAdminRequest(req, res)

    const form = new multiparty.Form()

    // Parse the form data to get fields and files
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve({ fields, files })
      })
    })

    const client = new S3Client({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    })

    const links = []

    for (const file of files.file) {
      // Generate a new filename based on the current timestamp and file extension
      const ext = file.originalFilename.split('.').pop()
      const newFilename = Date.now() + '.' + ext

      // Upload the file to S3
      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: newFilename,
          Body: fs.readFileSync(file.path),
          ACL: 'public-read',
          ContentType: mime.lookup(file.path),
        })
      )

      // Generate the S3 link for the uploaded file
      const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`
      links.push(link)
    }

    // Return the S3 links in the response
    return res.json({ links })
  } catch (error) {
    console.error('Error handling S3 upload:', error)
    // Return an error response with a 500 status code
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const config = {
  api: { bodyParser: false },
}