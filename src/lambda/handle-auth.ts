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

    const body = `
    <!doctype html>
    <html>
      <head>
        <title>Instagram Auth Code</title>
        <style>
          body { padding: 0; }
          
          .wrapper {
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            width: 100vw;
            height: 100vh;
          }

          .title, .code, .note {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          }

          .title {
            margin-bottom: 0.5rem;
          }

          .button {
            margin: 0;
            border: none;
            padding: 1rem;
            background: #e6e6e6;
            font: inherit;
            cursor: pointer;
          }

          .note {
            font-size: 0.8rem;
            margin-top: 2rem;
          }
        </style>

        <script>
          window.addEventListener('DOMContentLoaded', () => {
            const btn = document.querySelector('.button');
            btn.addEventListener('click', () => {
              navigator.clipboard.writeText(btn.innerText)
                .then(() => console.log('success'))
                .catch(err => console.error(err));
            });
          });
        </script>
      </head>
      <body>
        <div class="wrapper">
          <h1 class="title">AuthCode</h1>
          <h2 class="code"><button type="button" class="button">${response.data.access_token}</button></h2>
          <p class="note">Click to copy</p>
        </div>
      </body>
    </html>
    `;

    return {
      statusCode: 200,
      body,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
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
