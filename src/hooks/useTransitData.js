import { useEffect, useState } from "react";
import { loadTransitData } from "../services/transitData";

export function useTransitData() {
  const [state, setState] = useState({ data: null, error: "" });

  useEffect(() => {
    let cancelled = false;
    loadTransitData()
      .then((data) => !cancelled && setState({ data, error: "" }))
      .catch((error) => !cancelled && setState({ data: null, error: error.message }));
    return () => { cancelled = true; };
  }, []);

  return state;
}