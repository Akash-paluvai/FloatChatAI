
import type { ArgoDataPoint } from './types';

/**
 * Generates synthesized ARGO float data with time-series profiles.
 * @param {string} id - The float ID.
 * @param {number} baseLat - The base latitude.
 * @param {number} baseLon - The base longitude.
 * @param {number} tempOffset - An offset to simulate different climate zones.
 * @returns {ArgoDataPoint} - A complete data point for a single float.
 */
const generateFloatData = (id: string, baseLat: number, baseLon: number, tempOffset: number): ArgoDataPoint => {
    const float: ArgoDataPoint = {
        id,
        latitude: baseLat + (Math.random() - 0.5) * 5,
        longitude: baseLon + (Math.random() - 0.5) * 5,
        profiles: [],
    };
    const startDate = new Date('2021-01-15T12:00:00Z');

    for (let i = 0; i < 36; i++) {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);

        // Simulate seasonal temperature change (warmer in northern hemisphere summer)
        const month = date.getMonth(); // 0-11
        const seasonalFactor = baseLat > 0 
            ? Math.sin((month - 3) * (Math.PI / 6)) // Peaks in June for Northern Hemisphere
            : -Math.sin((month - 3) * (Math.PI / 6)); // Peaks in Dec for Southern Hemisphere

        const baseTemp = tempOffset + (seasonalFactor * 4); // Varies by +/- 4 degrees

        const profile = {
            date: date.toISOString().split('T')[0],
            measurements: [
                // Surface
                { pressure: parseFloat((10 + (Math.random() - 0.5)).toFixed(2)), temperature: parseFloat((baseTemp + (Math.random() - 0.5)).toFixed(2)), salinity: parseFloat((35.5 + (Math.random() - 0.5) * 0.2).toFixed(2)) },
                // Deeper
                { pressure: parseFloat((50 + (Math.random() * 5)).toFixed(2)), temperature: parseFloat((baseTemp - 1 - (Math.random() * 0.5)).toFixed(2)), salinity: parseFloat((35.6 + (Math.random() - 0.5) * 0.2).toFixed(2)) },
                { pressure: parseFloat((100 + (Math.random() * 10)).toFixed(2)), temperature: parseFloat((baseTemp - 5 - (Math.random() * 1)).toFixed(2)), salinity: parseFloat((35.8 + (Math.random() - 0.5) * 0.2).toFixed(2)) },
                { pressure: parseFloat((200 + (Math.random() * 20)).toFixed(2)), temperature: parseFloat((baseTemp - 12 - (Math.random() * 2)).toFixed(2)), salinity: parseFloat((36.0 + (Math.random() - 0.5) * 0.2).toFixed(2)) },
            ]
        };
        float.profiles.push(profile);
    }
    // Sort profiles by date descending to make sure the latest is first
    float.profiles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return float;
};

export const SAMPLE_DATA: ArgoDataPoint[] = [
    generateFloatData("7900123", 10.5, -45.2, 25),   // North Atlantic
    generateFloatData("7900456", -55.8, 170.1, 5),   // Southern Ocean
    generateFloatData("7900789", 25.0, -71.0, 28),   // Sargasso Sea
    generateFloatData("7900821", -10.0, 80.0, 26),   // Indian Ocean
    generateFloatData("7900954", 45.0, -150.0, 12),  // North Pacific
    generateFloatData("7901138", 35.0, 15.0, 22),   // Mediterranean Sea
    generateFloatData("7901267", 80.0, 10.0, -1),    // Arctic Ocean
    generateFloatData("7901590", 0.0, -120.0, 29),   // Equatorial Pacific
];
