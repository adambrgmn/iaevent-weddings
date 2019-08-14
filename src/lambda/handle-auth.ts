import axios from 'axios';

export async function handler(
  event: AWSLambda.APIGatewayProxyEvent,
  context: AWSLambda.APIGatewayEventRequestContext,
): Promise<AWSLambda.APIGatewayProxyResult> {
  const ret = {
    ...event,
    // body: JSON.parse(event.body || '{}'),
  };

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

  try {
    const formUrlEncoded = (x: { [key: string]: string }) =>
      Object.keys(x).reduce(
        (p, c) => p + `&${c}=${encodeURIComponent(x[c])}`,
        '',
      );
    const response = await axios({
      method: 'post',
      url: 'https://api.instagram.com/oauth/access_token',
      data: formUrlEncoded({
        client_id: '214654e8af3e4a36a4e387965678f081',
        client_secret: '2fd5dbb1c3af49689eaa0b1ac2e6a0e8',
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:9000/.netlify/functions/handle-auth',
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
