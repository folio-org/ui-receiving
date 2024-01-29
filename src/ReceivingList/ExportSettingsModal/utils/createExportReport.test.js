import { createExportReport } from './createExportReport';

const params = {
  titles: [
    {
      id: '3995b3d2-ddbe-46a4-8ba4-a5104b2fc58b',
      title: 'ABA Journal',
      poLineId: '524287dc-0101-49fb-a706-2274a0ffb827',
      instanceId: '69640328-788e-43fc-9c3c-af39e243f3b7',
      productIds: [
        {
          productId: '0747-0088',
          productIdType: '913300b2-03ed-469a-8179-c1092c991227',
        },
      ],
      contributors: [{ contributor: 'contributor', contributorNameTypeId: 'contributorNameTypeId' }],
      publisher: 'American Bar Association',
      edition: 'First edition',
      publishedDate: '1915',
      subscriptionTo: '2023-05-18T00:00:00.000+00:00',
      subscriptionFrom: '2022-05-18T00:00:00.000+00:00',
    },
  ],
  contributorNameTypesMap: { contributorNameTypeId: { name: 'contributorName' } },
  identifierTypesMap: {
    '913300b2-03ed-469a-8179-c1092c991227': {
      id: '913300b2-03ed-469a-8179-c1092c991227',
      name: 'ISSN',
    },
  },
  poLinesMap: {
    '524287dc-0101-49fb-a706-2274a0ffb827': {
      id: '524287dc-0101-49fb-a706-2274a0ffb827',
      purchaseOrderId: '8030dcd4-5614-440a-9f91-9ceda4eec51e',
      requester: 'Diku',
      rush: false,
    },
  },
  purchaseOrdersMap: {
    '8030dcd4-5614-440a-9f91-9ceda4eec51e': {
      id: '8030dcd4-5614-440a-9f91-9ceda4eec51e',
      poNumber: '10000',
      orderType: 'Ongoing',
      vendor: 'e0fb5df2-cdf1-11e8-a8d5-f2801f1b9fd1',
    },
  },
  vendorsMap: {
    'e0fb5df2-cdf1-11e8-a8d5-f2801f1b9fd1': {
      id: 'e0fb5df2-cdf1-11e8-a8d5-f2801f1b9fd1',
      name: 'Amazon.com',
      code: 'AMAZ',
    },
  },
  holdingsMap: {
    '416fd93f-1236-437f-961b-1497226bf241': {
      id: '416fd93f-1236-437f-961b-1497226bf241',
      permanentLocationId: '758258bc-ecc1-41b8-abca-f7b610822ffd',
    },
  },
  itemsMap: {
    '135ae11c-6c02-4631-be49-9c40f1fb99fa': {
      id: '135ae11c-6c02-4631-be49-9c40f1fb99fa',
      title: 'ABA Journal',
      barcode: '9876543456',
      itemLevelCallNumber: 'TST',
      hrid: 'it00000000001',
    },
  },
  locationsMap: {
    '758258bc-ecc1-41b8-abca-f7b610822ffd': {
      id: '758258bc-ecc1-41b8-abca-f7b610822ffd',
      name: 'ORWIG ETHNO CD',
      code: 'KU/CC/DI/O',
    },
  },
  pieces: [
    {
      id: 'a3a7c49e-7e3c-43e2-a200-94048703539f',
      format: 'Other',
      displaySummary: 'Display summary',
      chronology: '2022',
      enumeration: 'v1',
      comment: 'test export',
      copyNumber: '3',
      receiptDate: '2022-05-18T00:00:00.000+00:00',
      itemId: '135ae11c-6c02-4631-be49-9c40f1fb99fa',
      poLineId: '524287dc-0101-49fb-a706-2274a0ffb827',
      titleId: '3995b3d2-ddbe-46a4-8ba4-a5104b2fc58b',
      holdingId: '416fd93f-1236-437f-961b-1497226bf241',
      displayOnHolding: false,
      receivingStatus: 'Expected',
    },
  ],
};

const intl = { formatMessage: jest.fn(), formatDate: jest.fn() };

describe('createExportReport', () => {
  it('should return an object with export data', () => {
    expect(createExportReport(params, { intl })).toEqual([expect.objectContaining({
      barcode: '9876543456',
      callNumber: 'TST',
      displaySummary: 'Display summary',
      chronology: '2022',
      comment: 'test export',
      copyNumber: '3',
      displayOnHolding: false,
      edition: 'First edition',
      enumeration: 'v1',
      format: 'Other',
      itemHRID: 'it00000000001',
      location: 'ORWIG ETHNO CD',
      orderType: 'Ongoing',
      publishedDate: '1915',
      publisher: 'American Bar Association',
      requester: 'Diku',
      rush: false,
      title: 'ABA Journal',
      vendor: 'Amazon.com',
    })]);
  });
});
