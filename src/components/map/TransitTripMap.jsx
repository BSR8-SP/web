import { useEffect, useState } from "react";
import L from "leaflet";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import TransitRoute from "./TransitRoute";

function coordinateKey(coordinate) {
  return coordinate.slice(0, 2).map((value) => Number(value).toFixed(7)).join(",");
}

function coordinateDistance(first, second) {
  const meanLatitude = ((first[1] + second[1]) / 2) * (Math.PI / 180);
  const longitudeDistance =
    (second[0] - first[0]) * Math.cos(meanLatitude) * 111320;
  const latitudeDistance = (second[1] - first[1]) * 111320;
  return Math.hypot(longitudeDistance, latitudeDistance);
}

function findNearestVertex(stopCoordinate, coordinatesByKey) {
  let nearestKey = null;
  let nearestDistance = Infinity;

  for (const [key, coordinate] of coordinatesByKey) {
    const distance = coordinateDistance(stopCoordinate, coordinate);
    if (distance < nearestDistance) {
      nearestKey = key;
      nearestDistance = distance;
    }
  }

  return nearestKey;
}

function findPathBetweenStops(features, startStop, endStop) {
  const graph = new Map();
  const coordinatesByKey = new Map();

  function addEdge(first, second) {
    const firstKey = coordinateKey(first);
    const secondKey = coordinateKey(second);
    if (firstKey === secondKey) return;

    coordinatesByKey.set(firstKey, first.slice(0, 2));
    coordinatesByKey.set(secondKey, second.slice(0, 2));
    if (!graph.has(firstKey)) graph.set(firstKey, new Map());
    if (!graph.has(secondKey)) graph.set(secondKey, new Map());

    const distance = coordinateDistance(first, second);
    graph.get(firstKey).set(secondKey, distance);
    graph.get(secondKey).set(firstKey, distance);
  }

  for (const feature of features) {
    const geometry = feature.geometry;
    const lines = geometry?.type === "LineString"
      ? [geometry.coordinates]
      : geometry?.type === "MultiLineString"
        ? geometry.coordinates
        : [];

    for (const line of lines) {
      for (let index = 1; index < line.length; index += 1) {
        addEdge(line[index - 1], line[index]);
      }
    }
  }

  if (graph.size === 0) return null;

  const startKey = findNearestVertex(startStop.geometry.coordinates, coordinatesByKey);
  const endKey = findNearestVertex(endStop.geometry.coordinates, coordinatesByKey);
  if (!startKey || !endKey) return null;

  const distances = new Map([[startKey, 0]]);
  const previous = new Map();
  const unvisited = new Set(graph.keys());

  while (unvisited.size > 0) {
    let currentKey = null;
    let currentDistance = Infinity;

    for (const key of unvisited) {
      const distance = distances.get(key) ?? Infinity;
      if (distance < currentDistance) {
        currentKey = key;
        currentDistance = distance;
      }
    }

    if (currentKey === null || currentKey === endKey) break;

    unvisited.delete(currentKey);
    for (const [neighborKey, edgeDistance] of graph.get(currentKey)) {
      const distance = currentDistance + edgeDistance;
      if (distance < (distances.get(neighborKey) ?? Infinity)) {
        distances.set(neighborKey, distance);
        previous.set(neighborKey, currentKey);
      }
    }
  }

  if (!distances.has(endKey)) return null;

  const pathKeys = [endKey];
  while (pathKeys[0] !== startKey) {
    const previousKey = previous.get(pathKeys[0]);
    if (!previousKey) return null;
    pathKeys.unshift(previousKey);
  }

  return [
    startStop.geometry.coordinates.slice(0, 2),
    ...pathKeys.map((key) => coordinatesByKey.get(key)),
    endStop.geometry.coordinates.slice(0, 2),
  ];
}

function RouteViewport({ features }) {
  const map = useMap();

  useEffect(() => {
    if (features.length === 0) return;

    const bounds = L.geoJSON({ type: "FeatureCollection", features }).getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13 });
    }
  }, [features, map]);

  return null;
}

export default function TransitTripMap({ route, routeFeatures, stops }) {
  const [startStopKey, setStartStopKey] = useState("");
  const [endStopKey, setEndStopKey] = useState("");
  const [submittedTrip, setSubmittedTrip] = useState(null);
  const [error, setError] = useState("");

  const availableStops = [...stops].sort(
    (first, second) =>
      Number(first.properties?.stop_order ?? Infinity) -
        Number(second.properties?.stop_order ?? Infinity) ||
      String(first.properties?.name ?? "").localeCompare(
        String(second.properties?.name ?? "")
      )
  );
  const startStop = availableStops.find((stop) => stop.stopKey === startStopKey);
  const endStop = availableStops.find((stop) => stop.stopKey === endStopKey);
  const startStopIndex = availableStops.findIndex(
    (stop) => stop.stopKey === startStopKey
  );

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!startStop || !endStop) {
      setError("Choisissez un arrêt de départ et un arrêt d’arrivée.");
      return;
    }
    if (startStop.stopKey === endStop.stopKey) {
      setError("Les arrêts de départ et d’arrivée doivent être différents.");
      return;
    }

    const startOrder = Number(startStop.properties?.stop_order);
    const endOrder = Number(endStop.properties?.stop_order);
    if (Number.isFinite(startOrder) && Number.isFinite(endOrder) && startOrder >= endOrder) {
      setError("L’arrêt d’arrivée doit suivre le départ dans le sens choisi.");
      return;
    }

    const path = findPathBetweenStops(routeFeatures, startStop, endStop);
    if (!path) {
      setError("Aucun tracé continu n’a été trouvé entre ces deux arrêts.");
      return;
    }

    setSubmittedTrip({ startStopKey, endStopKey, path });
  }

  const submittedStart = submittedTrip
    ? availableStops.find((stop) => stop.stopKey === submittedTrip.startStopKey)
    : null;
  const submittedEnd = submittedTrip
    ? availableStops.find((stop) => stop.stopKey === submittedTrip.endStopKey)
    : null;

  return (
    <section className="transit-map">
      <form className="route-search trip-search" onSubmit={handleSubmit}>
        <p className="trip-route-name">
          Ligne {route.ref} · {route.from || "Départ inconnu"} → {route.to || "Arrivée inconnue"}
        </p>
        <label>
          Départ
          <select
            value={startStopKey}
            onChange={(event) => {
              const nextStartStopKey = event.target.value;
              const nextStartIndex = availableStops.findIndex(
                (stop) => stop.stopKey === nextStartStopKey
              );
              const currentEndIndex = availableStops.findIndex(
                (stop) => stop.stopKey === endStopKey
              );

              setStartStopKey(nextStartStopKey);
              if (currentEndIndex !== -1 && currentEndIndex <= nextStartIndex) {
                setEndStopKey("");
              }
              setSubmittedTrip(null);
            }}
            required
            disabled={availableStops.length === 0}
          >
            <option value="">Choisir un arrêt</option>
            {availableStops.map((stop) => (
              <option key={stop.stopKey} value={stop.stopKey}>
                {stop.properties?.name || "Arrêt sans nom"}
              </option>
            ))}
          </select>
        </label>
        <label>
          Arrivée
          <select
            value={endStopKey}
            onChange={(event) => {
              setEndStopKey(event.target.value);
              setSubmittedTrip(null);
            }}
            required
            disabled={availableStops.length === 0}
          >
            <option value="">Choisir un arrêt</option>
            {availableStops.map((stop, index) => (
              <option
                key={stop.stopKey}
                value={stop.stopKey}
                disabled={startStopIndex >= 0 && index <= startStopIndex}
              >
                {stop.properties?.name || "Arrêt sans nom"}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={availableStops.length === 0}>
          Afficher le trajet
        </button>
        {error && <p className="route-message" role="alert">{error}</p>}
        {availableStops.length === 0 && (
          <p className="route-message">Aucun arrêt disponible pour cette ligne.</p>
        )}
      </form>

      <MapContainer center={[-23.5505, -46.6333]} zoom={12} className="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <RouteViewport features={routeFeatures} />
        <TransitRoute
          routeRef={route.ref}
          routeKey={route.relationId}
          features={routeFeatures}
          highlightedPath={submittedTrip?.path}
          highlightKey={`${submittedTrip?.startStopKey ?? ""}:${submittedTrip?.endStopKey ?? ""}`}
        />
        {submittedStart && (
          <CircleMarker
            center={[submittedStart.geometry.coordinates[1], submittedStart.geometry.coordinates[0]]}
            pathOptions={{ color: "#167a52", fillColor: "#fff", fillOpacity: 1, weight: 3 }}
            radius={8}
          >
            <Tooltip>Départ : {submittedStart.properties?.name}</Tooltip>
          </CircleMarker>
        )}
        {submittedEnd && (
          <CircleMarker
            center={[submittedEnd.geometry.coordinates[1], submittedEnd.geometry.coordinates[0]]}
            pathOptions={{ color: "#b33a3a", fillColor: "#fff", fillOpacity: 1, weight: 3 }}
            radius={8}
          >
            <Tooltip>Arrivée : {submittedEnd.properties?.name}</Tooltip>
          </CircleMarker>
        )}
      </MapContainer>
    </section>
  );
}