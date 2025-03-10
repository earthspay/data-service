import { PgDriver } from '../../../../db/driver';
import { matchRequestsResults } from '../../../../utils/db';
import { toDbError } from '../../../../errorHandling';

export const getData = <ResponseRaw, Id = string>({
  matchRequestResult,
  name,
  sql,
}: {
  name: string;
  sql: (req: Id[]) => string;
  matchRequestResult: (req: Id[], res: ResponseRaw) => boolean;
}) => (pg: PgDriver) => (req: Id[]) =>
  pg
    .any<ResponseRaw>(sql(req))
    .map(responses => matchRequestsResults(matchRequestResult, req, responses))
    .mapRejected(e => toDbError({ request: name, params: req }, e.error));
