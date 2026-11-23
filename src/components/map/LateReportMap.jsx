import { useEffect, useMemo } from "react";
import L from "leaflet";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import TransitRoute from "./TransitRoute";
import { useTransitData } from "../../hooks/useTransitData";
import { buildRouteGraph, findPath } from "../../utils/routePath";
import "leaflet/dist/leaflet.css";

const labelClass = "flex min-w-0 flex-col gap-1 text-sm font-medium text-gray-700";
const selectClass =
  "w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm " +
  "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 " +
  "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";
const messageClass = "text-sm text-gray-600";
const errorClass = "text-sm text-red-600";

function RouteViewport({ features }) {
  const map = useMap();
  useEffect(() => {
    if (features.length === 0) return;
    const bounds = L.geoJSON({ type: "FeatureCollection", features }).getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13 });
  }, [features, map]);
  return null;
}

const toLatLng = ([lng, lat]) => [lat, lng];

export default function LateReportMap({
  line, setLine,
  direction, setDirection,
  start, setStart,
  end, setEnd,
}) {
  const { data, error } = useTransitData();

  // Tudo abaixo é DERIVADO de line/direction/start/end: não vira estado.
  const directions = useMemo(
    () => (data && line ? data.getDirections(line) : []),
    [data, line]
  );
  const routeFeatures = useMemo(
    () => (data && direction ? data.getRouteFeatures(direction) : []),
    [data, direction]
  );
  const stops = useMemo(
    () => (data && direction ? data.getStops(direction) : []),
    [data, direction]
  );
  const graph = useMemo(
    () => (routeFeatures.length ? buildRouteGraph(routeFeatures) : null),
    [routeFeatures]
  );
  const path = useMemo(
    () => (graph && start && end ? findPath(graph, start.coordinates, end.coordinates) : null),
    [graph, start, end]
  );

  const startIndex = stops.findIndex((stop) => stop.key === start?.key);

  function handleLineChange(event) {
    const nextLine = event.target.value;
    const options = nextLine ? data.getDirections(nextLine) : [];
    setLine(nextLine);
    // se só existe um sentido, já seleciona
    setDirection(options.length === 1 ? options[0].relationId : "");
    setStart(null);
    setEnd(null);
  }

  function handleDirectionChange(event) {
    setDirection(event.target.value);
    setStart(null);
    setEnd(null);
  }

  function handleStartChange(event) {
    const nextStart = stops.find((stop) => stop.key === event.target.value) ?? null;
    const nextIndex = stops.indexOf(nextStart);
    const endIndex = stops.findIndex((stop) => stop.key === end?.key);
    setStart(nextStart);
    if (endIndex !== -1 && endIndex <= nextIndex) setEnd(null);
  }

  function handleEndChange(event) {
    setEnd(stops.find((stop) => stop.key === event.target.value) ?? null);
  }

  if (error) {
    return (
      <p role="alert" className={errorClass}>
        Erro ao carregar os dados de transporte: {error}
      </p>
    );
  }
  if (!data) return <p className={messageClass}>Carregando linhas…</p>;

  return (
    <section className="flex w-[90%] max-w-[1000px] min-w-0 flex-col gap-4">
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        <label className={labelClass}>
          Linha
          <select value={line} onChange={handleLineChange} className={selectClass}>
            <option value="">Escolher uma linha</option>
            {data.lines.map((ref) => (
              <option key={ref} value={ref}>{ref}</option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Sentido
          <select
            value={direction}
            onChange={handleDirectionChange}
            disabled={directions.length === 0}
            className={selectClass}
          >
            <option value="">Escolher um sentido</option>
            {directions.map((d) => {
              const circular = d.from && d.from === d.to;
              const label = circular
                ? `Circular (${d.from})`
                : `${d.from || "?"} → ${d.to || "?"}`;
              return (
                <option key={d.relationId} value={d.relationId}>{label}</option>
              );
            })}
          </select>
        </label>

        <label className={labelClass}>
          Início do trecho
          <select
            value={start?.key ?? ""}
            onChange={handleStartChange}
            disabled={!direction || stops.length === 0}
            className={selectClass}
          >
            <option value="">Escolher uma parada</option>
            {stops.map((stop) => (
              <option key={stop.key} value={stop.key}>{stop.name}</option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Fim do trecho
          <select
            value={end?.key ?? ""}
            onChange={handleEndChange}
            disabled={!start}
            className={selectClass}
          >
            <option value="">Escolher uma parada</option>
            {stops.map((stop, index) => (
              <option key={stop.key} value={stop.key} disabled={index <= startIndex}>
                {stop.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {direction && stops.length === 0 && (
        <p className={messageClass}>Nenhuma parada disponível para este sentido.</p>
      )}
      {start && end && !path && (
        <p role="alert" className={errorClass}>
          Não foi possível traçar um caminho contínuo entre essas paradas.
        </p>
      )}

      <MapContainer
        center={[-23.5505, -46.6333]}
        zoom={12}
        className="relative z-0 isolate h-96 w-full overflow-hidden rounded-lg border border-gray-300"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <RouteViewport features={routeFeatures} />
        <TransitRoute
          routeRef={line}
          routeKey={direction}
          features={routeFeatures}
          highlightedPath={path}
          highlightKey={`${start?.key ?? ""}:${end?.key ?? ""}`}
        />
        {start && (
          <CircleMarker
            center={toLatLng(start.coordinates)}
            radius={8}
            pathOptions={{ color: "#167a52", fillColor: "#fff", fillOpacity: 1, weight: 3 }}
          >
            <Tooltip>Início: {start.name}</Tooltip>
          </CircleMarker>
        )}
        {end && (
          <CircleMarker
            center={toLatLng(end.coordinates)}
            radius={8}
            pathOptions={{ color: "#b33a3a", fillColor: "#fff", fillOpacity: 1, weight: 3 }}
          >
            <Tooltip>Fim: {end.name}</Tooltip>
          </CircleMarker>
        )}
      </MapContainer>
    </section>
  );
}
