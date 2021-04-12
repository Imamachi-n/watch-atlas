import { getOrisWatchUrl } from '../oris';

(async () => {
  const results = await getOrisWatchUrl();
  console.log(results);
})();
