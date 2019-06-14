const http = require('http');
const createService = require('../index');
const json = require('@earths/json-bigint');

// dependencies
const { createPgDriver } = require('../../../db');
const { loadConfig } = require('../../../loadConfig');
const options = loadConfig();
const drivers = {
  pg: createPgDriver(options),
};
const service = createService({
  drivers,
  emitEvent: () => () => null,
});

const assetId = 'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH';

describe('Assets service', () => {
  describe('get', () => {
    it('fetches a real asset', async done => {
      service
        .get(assetId)
        .run()
        .promise()
        .then(x => {
          expect(x.unsafeGet()).toMatchSnapshot();
          done();
        })
        .catch(done.fail);
    });

    it('returns null for unreal tx', async () => {
      const tx = await service
        .get('UNREAL')
        .run()
        .promise();

      expect(tx).toBeNothing();
    });
  });

  describe('mget', () => {
    it('fetches real assets with nulls for unreal', async done => {
      service
        .mget([assetId, 'UNREAL'])
        .run()
        .promise()
        .then(xs => {
          expect(xs).toMatchSnapshot();
          done();
        })
        .catch(e => done(JSON.stringify(e)));
    });
  });

  describe('search', () => {
    it('fetches EARTHS by ticker', async done => {
      service
        .search({ ticker: 'EARTHS' })
        .run()
        .promise()
        .then(xs => {
          expect(xs).toMatchSnapshot();
          done();
        })
        .catch(e => done(JSON.stringify(e)));
    });

    it('fetches non-EARTHS asset by ticker (BTC)', async done => {
      http.get(
        'http://nodes.earths.ga/assets/details/8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
        res => {
          let data = '';
          res.on('data', chunk => (data += chunk));
          res.on('end', () => {
            data = json.parse(data);
            service
              .search({ ticker: 'BTC' })
              .run()
              .promise()
              .then(xs => {
                expect(xs.data[0].data).toMatchObject({
                  description: data.description,
                  height: data.issueHeight,
                  id: data.assetId,
                  name: data.name,
                  precision: data.decimals,
                  quantity: data.quantity,
                  reissuable: data.reissuable,
                  sender: data.issuer,
                  ticker: 'BTC',
                });
                done();
              })
              .catch(e => done(JSON.stringify(e)));
          });
        }
      );
    });

    it('fetches all assets with tickers by ticker=*', async done => {
      service
        .search({ ticker: '*' })
        .run()
        .promise()
        .then(as => {
          expect(as.data.length).toBeGreaterThan(100);
          // make sure EARTHS is included
          expect(
            as.data.find(a => a.data.ticker === 'EARTHS')
          ).not.toBeUndefined();
          done();
        })
        .catch(e => done(JSON.stringify(e)));
    });
  });
});
