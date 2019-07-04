export async function handler(
  event: AWSLambda.APIGatewayProxyEvent,
  context: AWSLambda.APIGatewayEventRequestContext,
): Promise<AWSLambda.APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello world' }),
  };
}
