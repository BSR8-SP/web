const ROUTES_URL = "/data/transit_routes.geojson";
const STOPS_URL = "/data/transit_stops.geojson";
const MODES = ["bus"]; // adicione "subway", "train"... se quiser outros modos
const LINE_TYPES = ["LineString", "MultiLineString"];

let cache = null;

// Baixa e indexa uma única vez; todos os componentes compartilham o resultado.
export function loadTransitData() {
  if (!cache) {
    cache = fetchAndIndex().catch((error) => {
      cache = null; // permite tentar de novo depois de uma falha
      throw error;
    });
  }
  return cache;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Falha ao carregar ${url} (HTTP ${response.status})`);
  return response.json();
}

async function fetchAndIndex() {
  const [routesData, stopsData] = await Promise.all([
    fetchJson(ROUTES_URL),
    fetchJson(STOPS_URL),
  ]);
  return buildIndex(routesData, stopsData);
}

function compareStops(a, b) {
  const orderA = Number.isFinite(a.order) ? a.order : Infinity;
  const orderB = Number.isFinite(b.order) ? b.order : Infinity;
  if (orderA !== orderB) return orderA < orderB ? -1 : 1;
  return a.name.localeCompare(b.name);
}

function pushTo(map, key, value) {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

function buildIndex(routesData, stopsData) {
  const featuresByRelation = new Map();
  const relations = new Map(); // relationId -> metadados do sentido

  for (const feature of routesData.features ?? []) {
    const p = feature.properties ?? {};
    const ref = String(p.ref ?? "").trim();
    if (!MODES.includes(p.route) || !ref || p.osm_relation_id == null) continue;
    if (!LINE_TYPES.includes(feature.geometry?.type)) continue;

    const relationId = String(p.osm_relation_id);
    if (!relations.has(relationId)) {
      relations.set(relationId, {
        relationId,
        ref,
        name: String(p.name ?? "").trim(),
        from: p.from ?? "",
        to: p.to ?? "",
      });
    }
    pushTo(featuresByRelation, relationId, feature);
  }

  const directionsByLine = new Map();
  for (const relation of relations.values()) pushTo(directionsByLine, relation.ref, relation);

  const stopsByRelation = new Map();
  (stopsData.features ?? []).forEach((feature, index) => {
    const p = feature.properties ?? {};
    const relationId = String(p.osm_relation_id ?? "");
    const relation = relations.get(relationId);
    const name = String(p.name ?? "").trim();

    if (!relation || !name) return;
    if (feature.geometry?.type !== "Point" || p.role !== "platform") return;
    // ignora "paradas" com o mesmo nome da linha (ruído do OSM)
    if (
      relation.name &&
      name.localeCompare(relation.name, undefined, { sensitivity: "base" }) === 0
    ) return;

    const [lng, lat] = feature.geometry.coordinates;
    pushTo(stopsByRelation, relationId, {
      key: `${relationId}:${p.osm_type ?? "stop"}:${p.osm_id ?? index}`,
      name,
      osmId: p.osm_id ?? null,
      order: Number(p.stop_order),
      coordinates: [lng, lat],
    });
  });
  for (const stops of stopsByRelation.values()) stops.sort(compareStops);

  const lines = [...directionsByLine.keys()].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );

  return {
    lines,
    getDirections: (ref) => directionsByLine.get(ref) ?? [],
    getRouteFeatures: (relationId) => featuresByRelation.get(relationId) ?? [],
    getStops: (relationId) => stopsByRelation.get(relationId) ?? [],
  };
}