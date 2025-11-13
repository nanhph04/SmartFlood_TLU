import { exec } from 'child_process';
import { fetchAndSaveWeatherForAllAreas } from './services/weatherService.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function fetchWeatherAndFakeSensor() {
    await fetchAndSaveWeatherForAllAreas();
    exec('node ./src/scripts/fakeSensorData.js', { cwd: __dirname + '/../' }, (err, stdout, stderr) => {
        if (err) console.error('Fake sensor data error:', err);
        else console.log('Fake sensor data:', stdout);
    });
}
