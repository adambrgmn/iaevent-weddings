import axios, { AxiosError } from 'axios';
import { InstagramFeedResponse } from '../types/instagram';

const parseResponseData = (data: any) => {
  try {
    if (typeof data === 'object') {
      return JSON.stringify(data);
    }
  } catch (err) {
    return data;
  }
};

export async function handler(
  event: AWSLambda.APIGatewayProxyEvent,
  context: AWSLambda.APIGatewayEventRequestContext,
): Promise<AWSLambda.APIGatewayProxyResult> {
  try {
    const response = await axios.get<InstagramFeedResponse>(
      'https://api.instagram.com/v1/users/self/media/recent/',
      { params: { access_token: process.env.INSTAGRAM_ACCESS_TOKEN } },
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response.data),
    };
  } catch (err) {
    const error: AxiosError = err;
    if (error.response) {
      return {
        statusCode: error.response.status,
        headers: {
          ...error.response.headers,
          'Access-Control-Allow-Origin': '*',
        },
        body: parseResponseData(error.response.data),
      };
    }

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(error),
    };
  }
}
