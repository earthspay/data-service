const { propEq } = require('ramda');

const { Transaction } = require('../../../types');

const getByIdPreset = require('../../presets/pg/getById');
const mgetByIdsPreset = require('../../presets/pg/mgetByIds');
const { input: inputOne } = require('../../presets/pg/getById/inputSchema');
const { input: inputMany } = require('../../presets/pg/mgetByIds/inputSchema');
const searchWithPaginationPreset = require('../../presets/pg/searchWithPagination');

const transformTxInfo = require('./transformTxInfo');

const sql = require('./sql');

const {
  result: resultSchema,
  inputSearch: inputSearchSchema,
} = require('./schema');

module.exports = ({ drivers: { pg }, emitEvent }) => {
  return {
    get: getByIdPreset({
      name: 'transactions.issue.get',
      sql: sql.get,
      inputSchema: inputOne,
      resultSchema,
      resultTypeFactory: Transaction,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset({
      name: 'transactions.issue.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMany,
      resultTypeFactory: Transaction,
      resultSchema,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    search: searchWithPaginationPreset({
      name: 'transactions.issue.search',
      sql: sql.search,
      inputSchema: inputSearchSchema,
      resultSchema,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),
  };
};
