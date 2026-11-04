/**
 * ziwei-chart CLI. See src/chart.ts for the options.
 *   node ziwei-chart.mjs --date 1990-05-17 --time 14:30 --gender male --city "Ha Noi" --lang vi
 */
import { parseArgs, renderChart } from './chart';

try {
  console.log(renderChart(parseArgs(process.argv.slice(2))));
} catch (e) {
  console.error(`Error: ${(e as Error).message}`);
  process.exit(1);
}
