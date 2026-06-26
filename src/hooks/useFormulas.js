import { useState, useEffect } from 'react';
import Papa from 'papaparse';

// Fetches and parses the ingredient/price list from the configured Google Sheet
// CSV export. Shared by PowderForm and CapsuleForm.
export function useFormulas() {
    const [formulas, setFormulas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const googleSheetUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;
                const response = await fetch(googleSheetUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch CSV: ${response.statusText}`);
                }
                const text = await response.text();
                const result = Papa.parse(text, {
                    header: true,
                    skipEmptyLines: true,
                    dynamicTyping: true,
                });
                if (result.errors.length > 0) {
                    console.error('PapaParse errors:', result.errors);
                    throw new Error('Failed to parse CSV data');
                }
                const parsedFormulas = result.data
                    .map(row => ({
                        formula: row.ingredient || '',
                        price: typeof row.price === 'number' ? row.price : parseFloat(row.price) || 0,
                    }))
                    .filter(formula => formula.formula);
                setFormulas(parsedFormulas);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching Google Sheet:', err);
                setError(`Failed to load formulas: ${err.message}`);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return { formulas, loading, error };
}
