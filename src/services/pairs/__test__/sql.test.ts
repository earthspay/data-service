import { get, mget, search } from '../sql';

describe('sql query from pairs', () => {
  it('should get one pair', () => {
    expect(
      get({
        amountAsset: '111',
        priceAsset: '222',
      })
    ).toMatchSnapshot();
  });

  it('should get many pairs', () => {
    expect(
      mget([
        {
          amountAsset: '111',
          priceAsset: '222',
        },
        {
          amountAsset: '333',
          priceAsset: '444',
        },
      ])
    ).toMatchSnapshot();
  });

  it('should search pairs for one asset', () => {
    expect(
      search({
        search_by_asset: '7FJhS4wyEKqsp77VCMfCZWKLSMuy1TWskYAyZ28amWFj',
        limit: 10,
      })
    ).toMatchSnapshot();
  });

  it('should search pairs for one asset exactly', () => {
    expect(
      search({
        search_by_asset: '7FJhS4wyEKqsp77VCMfCZWKLSMuy1TWskYAyZ28amWFj',
        match_exactly: true,
        limit: 10,
      })
    ).toMatchSnapshot();
  });

  it('should search pairs for one asset exactly', () => {
    expect(
      search({
        search_by_asset: '¯\\_(ツ)_/¯',
        match_exactly: true,
        limit: 10,
      })
    ).toMatchSnapshot();
  });

  it('should search pairs for two assets (amount and price)', () => {
    expect(
      search({ search_by_assets: ['BTC', 'EARTHS'], limit: 10 })
    ).toMatchSnapshot();
  });

  it('should search pairs for two assets (amount and price)', () => {
    expect(
      search({ search_by_assets: ['¯\\_(ツ)_/¯', 'EARTHS'], limit: 10 })
    ).toMatchSnapshot();
  });

  it('should search pairs for two assets (amount and price)', () => {
    expect(
      search({
        search_by_assets: ['¯\\_(ツ)_/¯', 'EARTHS'],
        match_exactly: [true, false],
        limit: 10,
      })
    ).toMatchSnapshot();
  });
});
