/* eslint-disable import/first */

(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { HttpError, BadRequest } from 'http-errors';
import { createResponse } from '../utils/create-response';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'iaevent-wedding.firebaseapp.com',
  databaseURL: 'https://iaevent-wedding.firebaseio.com',
  projectId: 'iaevent-wedding',
  storageBucket: 'iaevent-wedding.appspot.com',
  messagingSenderId: '786640261818',
  appId: '1:786640261818:web:4d71529afeffea44',
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
