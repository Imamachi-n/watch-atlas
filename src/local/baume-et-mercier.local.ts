import { getBalmeWatchUrlLambda } from '..';

(async () => {
  const results = await getBalmeWatchUrlLambda('dummy', 'dummy');
  console.log(results);
})();
