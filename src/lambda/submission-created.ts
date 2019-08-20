import firebase from 'firebase-admin';
import { HttpError, BadRequest } from 'http-errors';
import { createResponse } from '../utils/create-response';

const firebaseConfig = {
  credential: firebase.credential.cert({
    projectId: 'iaevent-wedding',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
  }),
  databaseURL: 'https://iaevent-wedding.firebaseio.com',
  projectId: 'iaevent-wedding',
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

const submissions = firestore.collection('submissions');

export async function handler(
  event: AWSLambda.APIGatewayProxyEvent,
): Promise<AWSLambda.APIGatewayProxyResult> {
  try {
    if (!event.body) {
      throw new BadRequest('A body must be supplied');
    }

    const body = JSON.parse(event.body);
    await submissions.add(body);

    return createResponse('Success');
  } catch (error) {
    console.log(error);
    let statusCode: number;
    let message: string;

    if (error instanceof HttpError && error.expose) {
      statusCode = error.statusCode;
      message = error.message;
    } else {
      statusCode = 500;
      message = 'Internal server error';
    }

    return createResponse(message, { statusCode, cache: false });
  }
}
