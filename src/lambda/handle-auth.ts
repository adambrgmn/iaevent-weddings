import axios from 'axios';

const formUrlEncoded = (x: { [key: string]: string }) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

export async function handler(
  event: AWSLambda.APIGatewayProxyEvent,
  context: AWSLambda.APIGatewayEventRequestContext,
): Promise<AWSLambda.APIGatewayProxyResult> {
  const code = event.queryStringParameters && event.queryStringParameters.code;
  if (code == null) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Code not supplied in query',
        event,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }

  if (
    process.env.INSTAGRAM_CLIENT_ID == null ||
    process.env.INSTAGRAM_CLIENT_SECRET == null ||
    process.env.INSTAGRAM_REDIRECT_URI == null
  ) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: 'Missing environment variables',
        event,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.instagram.com/oauth/access_token',
      data: formUrlEncoded({
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code,
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ data: response.data, event }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: error.message,
        response: error.response && error.response.data,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
}
