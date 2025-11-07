import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FUSEKI_URL = process.env.FUSEKI_BASE_URL || 'http://localhost:3030/FloodSmartCity';
const QUERY_URL = `${FUSEKI_URL}/query`;
const UPDATE_URL = `${FUSEKI_URL}/update`;

export async function runSelectQuery(query) {
    try {
        const response = await axios.get(QUERY_URL, {
            params: { query },
            headers: { Accept: 'application/sparql-results+json' },
        });
        return response.data;
    } catch (err) {
        const detail = err.response?.data || err.message;
        console.error('❌ SPARQL SELECT failed:', detail);
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
    }
}

export async function runUpdate(updateQuery) {
    try {
        await axios.post(
            UPDATE_URL,
            `update=${encodeURIComponent(updateQuery)}`,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return { ok: true };
    } catch (err) {
        const detail = err.response?.data || err.message;
        console.error('❌ SPARQL UPDATE failed:', detail);
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
    }
}

export const FUSEKI_ENDPOINTS = { FUSEKI_URL, QUERY_URL, UPDATE_URL };

