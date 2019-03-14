import { Maybe } from 'folktale/maybe';

import { FromSerializable, Serializable } from '../../../../types';

export const transformResults = <
  Id,
  ResponseRaw,
  ResponseTransformed extends Serializable<string, any>
>(
  typeFactory: (
    d?: FromSerializable<ResponseTransformed>
  ) => ResponseTransformed
) => (
  transformDbResponse: (
    results: ResponseRaw,
    request?: Id
  ) => FromSerializable<ResponseTransformed>
) => (maybeResponse: Maybe<ResponseRaw>, request?: Id): ResponseTransformed =>
  maybeResponse.map(transformDbResponse).matchWith({
    Just: ({ value }) => typeFactory(value),
    Nothing: () => typeFactory(),
  });
