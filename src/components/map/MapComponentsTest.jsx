import { useEffect, useState } from "react";
import TransitMap from "./TransitMap";
import TransitTripMap from "./TransitTripMap";

const TEST_ROUTE_REF = "6200-10";

export default function MapComponentsTest() {
  const [tripFixture, setTripFixture] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadTripFixture() {
      try {
        const [routesResponse, stopsResponse] = await Promise.all([
          fetch("/data/transit_routes.geojson", { signal: controller.signal }),
          fetch("/data/transit_stops.geojson", { signal: controller.signal }),
        ]);

        if (!routesResponse.ok || !stopsResponse.ok) {
          throw new Error("Unable to load the test trip data.");
        }

        const [routesData, stopsData] = await Promise.all([
          routesResponse.json(),
          stopsResponse.json(),
        ]);
        const routeFeature = (routesData.features ?? []).find((feature) => {
          const properties = feature.properties ?? {};
          return (
            properties.route === "bus" &&
            String(properties.ref ?? "").trim() === TEST_ROUTE_REF &&
            properties.osm_relation_id != null &&
            ["LineString", "MultiLineString"].includes(feature.geometry?.type)
          );
        });

        if (!routeFeature) {
          throw new Error(`Test route ${TEST_ROUTE_REF} was not found.`);
        }

        const routeProperties = routeFeature.properties;
        const relationId = String(routeProperties.osm_relation_id);
        const routeName = String(routeProperties.name ?? "").trim();
        const routeFeatures = (routesData.features ?? []).filter(
          (feature) =>
            String(feature.properties?.osm_relation_id ?? "") === relationId &&
            ["LineString", "MultiLineString"].includes(feature.geometry?.type)
        );
        const stops = (stopsData.features ?? [])
          .map((feature, index) => ({ feature, index }))
          .filter(({ feature }) => {
            const properties = feature.properties ?? {};
            const stopName = String(properties.name ?? "").trim();
            return (
              String(properties.osm_relation_id ?? "") === relationId &&
              feature.geometry?.type === "Point" &&
              properties.role === "platform" &&
              Boolean(stopName) &&
              (!routeName ||
                stopName.localeCompare(routeName, undefined, { sensitivity: "base" }) !== 0)
            );
          })
          .map(({ feature, index }) => ({
            ...feature,
            stopKey: `${relationId}:${feature.properties?.osm_type ?? "stop"}:${feature.properties?.osm_id ?? index}`,
          }));

        setTripFixture({
          route: {
            ref: TEST_ROUTE_REF,
            relationId,
            from: routeProperties.from,
            to: routeProperties.to,
          },
          routeFeatures,
          stops,
        });
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message);
        }
      }
    }

    loadTripFixture();
    return () => controller.abort();
  }, []);

  return (
    <main className="map-component-tests">
      <section className="map-component-test">
        <h2>Location and route selection</h2>
        <TransitMap routeRef={TEST_ROUTE_REF} />
      </section>
      <section className="map-component-test">
        <h2>Departure and arrival</h2>
        {tripFixture ? (
          <TransitTripMap {...tripFixture} />
        ) : (
          <p className="route-message" role={error ? "alert" : undefined}>
            {error || "Loading test trip…"}
          </p>
        )}
      </section>
    </main>
  );
}