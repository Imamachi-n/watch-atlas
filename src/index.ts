import {} from '@aws-cdk/aws-lambda';

export const testFn = async (event: any, context: any): Promise<string> => {
  return 'Hello World';
};
