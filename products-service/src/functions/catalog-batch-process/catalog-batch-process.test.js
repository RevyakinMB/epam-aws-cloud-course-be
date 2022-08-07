import { PublishCommand } from '@aws-sdk/client-sns';

import { createNewProduct } from '@src/data';

import { catalogBatchProcess } from './handler';

jest.mock('@aws-sdk/client-sns', () => ({
  PublishCommand: jest.fn(() => undefined),
}));

jest.mock('@libs/sns-client', () => ({
  getSnsClient: jest.fn(() => ({ send: () => Promise.resolve() })),
}));

jest.mock('@src/data', () => ({
  createNewProduct: jest.fn(),
}));

const rejectNthCall = (n) => {
  let numberOfInvocations = 0;
  return () => {
    numberOfInvocations += 1;
    return numberOfInvocations === n ? Promise.reject() : Promise.resolve();
  };
};

const CATALOG_NOTIFICATION_TOPIC_ARN = 'SNS_ARN';

describe('catalogBatchProcess', () => {
  const INITIAL_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    process.env = {
      ...INITIAL_ENV,
      CATALOG_NOTIFICATION_TOPIC_ARN,
    };
  });

  afterAll(() => {
    process.env = INITIAL_ENV;
  });

  const regularEvent = {
    Records: [{
      messageId: 'id1',
      body: JSON.stringify({
        title: 'New product',
        description: 'Some text',
        price: 10,
      }),
    }, {
      messageId: 'id2',
      body: JSON.stringify({
        title: 'Second hand hat',
        description: 'Do not buy it',
        price: 1,
      }),
    }],
  };

  it('should insert into received products payload into the database', async () => {
    createNewProduct.mockReturnValue(Promise.resolve());
    const result = await catalogBatchProcess(regularEvent);
    expect(result).toEqual({
      batchItemFailures: [],
    });
    expect(PublishCommand).toHaveBeenCalled();
  });

  it('should report back messages with invalid payload', async () => {
    createNewProduct.mockReturnValue(Promise.resolve());
    const event = {
      Records: [{
        messageId: 'id1',
        body: 'This is not a valid JSON-string{}[]',
      }],
    };
    const result = await catalogBatchProcess(event);
    expect(result).toEqual({
      batchItemFailures: [{
        itemIdentifier: event.Records[0].messageId,
      }],
    });
    expect(PublishCommand).not.toHaveBeenCalled();
  });

  it('should report back messages which trigger an error during saving', async () => {
    createNewProduct.mockImplementation(rejectNthCall(2));
    const result = await catalogBatchProcess(regularEvent);
    expect(result).toEqual({
      batchItemFailures: [{
        itemIdentifier: regularEvent.Records[1].messageId,
      }],
    });
  });
});
