import { getFarerWatchUrl } from '../farer';

(async () => {
  const results = await getFarerWatchUrl();
  console.log(results);
})().catch((error) => {
  console.error(error);
});
