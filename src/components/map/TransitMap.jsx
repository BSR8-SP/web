import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import TransitRoute from "./TransitRoute";

const DEFAULT_CENTER = [-23.5505, -46.6333];

function requestUserLocation(setLocation, setLocationMessage) {
  if (!navigator.geolocation) {
    setLocationMessage("La géolocalisation n’est pas disponible dans ce navigateur.");
    return;
  }

  setLocationMessage("Demande de localisation en cours…");
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      setLocation({ latitude: coords.latitude, longitude: coords.longitude });
      setLocationMessage("Position actuelle détectée.");
    },
    () => setLocationMessage("Position indisponible. Vérifiez l’autorisation de localisation."),
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function MapViewport({ features, location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo([location.latitude, location.longitude], 14);
      return;
    }

    if (features.length > 0) {
      const bounds = L.geoJSON({ type: "FeatureCollection", features }).getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13 });
      }
    }
  }, [features, location, map]);

  return null;
}

export default function TransitMap({ routeRef }) {
  const [routesByRelation, setRoutesByRelation] = useState(new Map());
  const [routeOptions, setRouteOptions] = useState([]);
  const [selectedRelationId, setSelectedRelationId] = useState("");
  const [location, setLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [error, setError] = useState("");
  const locationRequestStarted = useRef(false);

  useEffect(() => {
    if (locationRequestStarted.current) return;
    locationRequestStarted.current = true;
    requestUserLocation(setLocation, setLocationMessage);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        const routesResponse = await fetch("/data/transit_routes.geojson", {
          signal: controller.signal,
        });

        if (!routesResponse.ok) {
          throw new Error("Impossible de charger les lignes.");
        }

        const routesData = await routesResponse.json();
        const nextRoutesByRelation = new Map();
        const routeOptionsByKey = new Map();

        for (const feature of routesData.features ?? []) {
          const properties = feature.properties ?? {};
          const ref = String(properties.ref ?? "").trim();
          const relationId = properties.osm_relation_id;

          if (
            properties.route !== "bus" ||
            !ref ||
            relationId == null ||
            !["LineString", "MultiLineString"].includes(feature.geometry?.type)
          ) {
            continue;
          }

          const relationKey = String(relationId);
          if (!nextRoutesByRelation.has(relationKey)) {
            nextRoutesByRelation.set(relationKey, []);
          }
          nextRoutesByRelation.get(relationKey).push(feature);

          const optionKey = `${ref}:${relationId}`;
          if (!routeOptionsByKey.has(optionKey)) {
            routeOptionsByKey.set(optionKey, {
              ref,
              relationId: relationKey,
              from: properties.from,
              to: properties.to,
            });
          }
        }

        const sortedRouteOptions = [...routeOptionsByKey.values()].sort(
          (first, second) =>
            first.ref.localeCompare(second.ref) ||
            String(first.from ?? "").localeCompare(String(second.from ?? ""))
        );

        setRoutesByRelation(nextRoutesByRelation);
        setRouteOptions(sortedRouteOptions);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message);
        }
      }
    }

    loadData();
    return () => controller.abort();
  }, []);

  const selectedRoute =
    routeOptions.find((option) => option.relationId === selectedRelationId) ??
    routeOptions.find((option) => option.ref === routeRef) ??
    routeOptions[0];
  const routeFeatures = selectedRoute
    ? routesByRelation.get(selectedRoute.relationId) ?? []
    : [];

  function handleLocate() {
    requestUserLocation(setLocation, setLocationMessage);
  }

  return (
    <section className="transit-map">
      <div className="route-search route-selection">
        <label>
          Ligne de bus
          <select
            value={selectedRoute?.relationId ?? ""}
            onChange={(event) => setSelectedRelationId(event.target.value)}
            required
            disabled={routeOptions.length === 0}
          >
            {routeOptions.length === 0 && <option value="">Chargement des lignes…</option>}
            {routeOptions.map((option) => (
              <option key={`${option.ref}:${option.relationId}`} value={option.relationId}>
                {option.ref} · {option.from || "Départ inconnu"} → {option.to || "Arrivée inconnue"}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="location-button" onClick={handleLocate}>
          Actualiser ma position
        </button>
        {error && <p className="route-message" role="alert">{error}</p>}
        {locationMessage && <p className="route-message">{locationMessage}</p>}
      </div>

      <MapContainer center={DEFAULT_CENTER} zoom={12} className="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapViewport features={routeFeatures} location={location} />
        <TransitRoute
          routeRef={selectedRoute?.ref}
          routeKey={selectedRoute?.relationId}
          features={routeFeatures}
        />
        {location && (
          <CircleMarker
            center={[location.latitude, location.longitude]}
            pathOptions={{ color: "#176b5d", fillColor: "#fff", fillOpacity: 1, weight: 3 }}
            radius={9}
          >
            <Tooltip>Votre position</Tooltip>
          </CircleMarker>
        )}
      </MapContainer>
    </section>
  );
}