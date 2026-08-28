import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let firebaseApp = null

export function initializeFirebase() {
  if (firebaseApp) return firebaseApp

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  const hasEnvironmentCredentials = process.env.FIREBASE_PROJECT_ID
    && process.env.FIREBASE_CLIENT_EMAIL
    && process.env.FIREBASE_PRIVATE_KEY

  if (hasEnvironmentCredentials) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    })
  } else if (serviceAccountPath) {
    const resolvedPath = resolve(__dirname, '../../', serviceAccountPath)
    const serviceAccount = JSON.parse(readFileSync(resolvedPath, 'utf8'))
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  } else {
    throw new Error('Firebase configuration missing. Provide service-account environment credentials or FIREBASE_SERVICE_ACCOUNT_PATH.')
  }

  console.log('Firebase Admin SDK initialized')
  return firebaseApp
}

export function getAuth() {
  if (!firebaseApp) initializeFirebase()
  return admin.auth()
}
