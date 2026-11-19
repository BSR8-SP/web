import { useState } from "react";
import { apiRequest } from "../lib/api";

export function useLineSearch() {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchLines = async (search_term) => {
        if (!search_term.trim()) { setResults([]); return; }

        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                search: search_term.trim()
            });

            const data = await apiRequest(`/maps/fetch_bus_lines?${params}`);
            setResults(data);
            return data; 
        }
        catch (err) { setError(err.message); setResults([]); return null; }
        finally     { setIsLoading(false); }
    };

    return {
        results,
        isLoading,
        error,
        searchLines
    };
}