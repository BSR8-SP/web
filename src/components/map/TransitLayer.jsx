
import { useEffect, useState } from "react";
import { GeoJSON, CircleMarker, Tooltip, Popup } from "react-leaflet";
import L from "leaflet";

const ROUTES_URL = "/data/transit_routes.geojson";
const STOPS_URL = "/data/transit_stops.geojson";

const COLORS = {
    bus: "#1565c0",
    subway: "#e53935",
    train: "#7b1fa2",
    tram: "#ef6c00",
    light_rail: "#00897b",
    ferry: "#039be5",
};

export default function TransitLayer() {
    const [routes, setRoutes] = useState(null);
    const [stops, setStops] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadData() {
            try {
                const [routesResponse, stopsResponse] = await Promise.all([
                    fetch(ROUTES_URL, { signal: controller.signal }),
                    fetch(STOPS_URL, { signal: controller.signal }),
                ]);

                if (!routesResponse.ok) {
                    throw new Error(
                        `Erreur de chargement des lignes : HTTP ${routesResponse.status}`
                    );
                }

                if (!stopsResponse.ok) {
                    throw new Error(
                        `Erreur de chargement des arrêts : HTTP ${stopsResponse.status}`
                    );
                }

                const [routesData, stopsData] = await Promise.all([
                    routesResponse.json(),
                    stopsResponse.json(),
                ]);

                if (
                    routesData.type !== "FeatureCollection" ||
                    !Array.isArray(routesData.features)
                ) {
                    throw new Error("Le fichier des lignes n'est pas un GeoJSON valide.");
                }

                if (
                    stopsData.type !== "FeatureCollection" ||
                    !Array.isArray(stopsData.features)
                ) {
                    throw new Error("Le fichier des arrêts n'est pas un GeoJSON valide.");
                }

                const validRoutes = {
                    ...routesData,
                    features: routesData.features.filter(
                        (feature) =>
                            feature.geometry &&
                            ["LineString", "MultiLineString"].includes(
                                feature.geometry.type
                            )
                    ),
                };

                const validStops = {
                    ...stopsData,
                    features: stopsData.features.filter(
                        (feature) =>
                            feature.geometry?.type === "Point" &&
                            Array.isArray(feature.geometry.coordinates)
                    ),
                };

                setRoutes(validRoutes);
                setStops(validStops);

                console.log("Lignes chargées :", validRoutes.features.length);
                console.log("Arrêts chargés :", validStops.features.length);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Erreur de chargement :", err);
                    setError(err.message);
                }
            }
        }

        loadData();

        return () => controller.abort();
    }, []);

    if (error) {
        return (
            <div style={{ color: "red", padding: "8px" }}>
                Erreur de chargement des transports : {error}
            </div>
        );
    }

    if (!routes || !stops) {
        return <div>Chargement des lignes et des arrêts...</div>;
    }

    return (
        <>
            {/* Tracés des lignes */}
            <GeoJSON
                key="transit-routes"
                data={routes}
                style={(feature) => ({
                    color:
                        feature?.properties?.colour ||
                        COLORS[feature?.properties?.route] ||
                        "#1565c0",
                    weight: 3,
                    opacity: 0.8,
                })}
                onEachFeature={(feature, layer) => {
                    const p = feature.properties ?? {};
                    const name = p.name || p.ref || "Ligne sans nom";

                    const popup = document.createElement("div");
                    popup.innerHTML = `
                        <strong></strong><br/>
                        Mode : <span></span><br/>
                        Opérateur : <span></span><br/>
                        Relation OSM : <span></span><br/>
                        Chemin OSM : <span></span>
                    `;

                    popup.querySelector("strong").textContent = name;

                    const spans = popup.querySelectorAll("span");
                    spans[0].textContent = p.route || "inconnu";
                    spans[1].textContent = p.operator || "inconnu";
                    spans[2].textContent = p.osm_relation_id ?? "inconnu";
                    spans[3].textContent = p.osm_way_id ?? "inconnu";

                    layer.bindPopup(popup);
                }}
            />

            {/* Arrêts et quais */}
            <GeoJSON
                key="transit-stops"
                data={stops}
                pointToLayer={(feature, latlng) => {
                    const mode = feature?.properties?.route;
                    const color = COLORS[mode] || "#222222";

                    return L.circleMarker(latlng, {
                        radius: 5,
                        color,
                        weight: 1.5,
                        fillColor: "#ffffff",
                        fillOpacity: 1,
                    });
                }}
                onEachFeature={(feature, layer) => {
                    const p = feature.properties ?? {};

                    const popup = document.createElement("div");
                    const title = document.createElement("strong");
                    title.textContent = p.name || "Arrêt sans nom";
                    popup.appendChild(title);

                    const details = [
                        ["Ligne", p.ref],
                        ["Mode", p.route],
                        ["Opérateur", p.operator],
                        ["Ordre dans la ligne", p.stop_order],
                        ["Rôle", p.role],
                        ["Relation OSM", p.osm_relation_id],
                        ["Identifiant OSM", p.osm_id],
                    ];

                    for (const [label, value] of details) {
                        if (value === undefined || value === null || value === "") {
                            continue;
                        }

                        const row = document.createElement("div");
                        row.textContent = `${label} : ${value}`;
                        popup.appendChild(row);
                    }

                    layer.bindPopup(popup);
                }}
            />
        </>
    );
}
