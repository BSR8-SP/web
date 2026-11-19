import { GeoJSON } from "react-leaflet";

function lightenColor(color, amount = 0.35) {
    let hex = String(color).replace(/^#/, "");
    if (/^[\da-f]{3}$/i.test(hex)) {
        hex = hex.split("").map((character) => character + character).join("");
    }
    if (!/^[\da-f]{6}$/i.test(hex)) {
        return color;
    }

    const channels = hex.match(/[\da-f]{2}/gi).map((channel) => parseInt(channel, 16));
    return `#${channels
        .map((channel) => Math.round(channel + (255 - channel) * amount).toString(16).padStart(2, "0"))
        .join("")}`;
}

export default function TransitRoute({ routeRef, routeKey, features, highlightedPath, highlightKey }) {
    if (!features?.length) {
        return null;
    }

    const routeColor = features.find((feature) => feature.properties?.colour)?.properties.colour || "#1565c0";
    const hasHighlight = highlightedPath?.length > 1;

    return (
        <>
            <GeoJSON
                key={`route-${routeKey ?? routeRef}`}
                data={{ type: "FeatureCollection", features }}
                style={(feature) => {
                    const color = feature?.properties?.colour || "#1565c0";
                    return {
                        color: hasHighlight ? lightenColor(color) : color,
                        weight: 5,
                        opacity: 1,
                    };
                }}
                onEachFeature={(feature, layer) => {
                    layer.bindPopup(
                        `<strong>${feature.properties?.name ?? routeRef}</strong><br/>` +
                        `Référence : ${feature.properties?.ref ?? routeRef}`
                    );
                }}
            />
            {hasHighlight && (
                <GeoJSON
                    key={`route-highlight-${routeKey ?? routeRef}-${highlightKey}`}
                    data={{
                        type: "Feature",
                        properties: {},
                        geometry: { type: "LineString", coordinates: highlightedPath },
                    }}
                    style={{ color: routeColor, weight: 7, opacity: 1 }}
                />
            )}
        </>
    );
}