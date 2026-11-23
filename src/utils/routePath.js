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

export function buildRouteGraph(features) {
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
      const { type, coordinates } = feature.geometry ?? {};
      const lines =
        type === "LineString" ? [coordinates] : type === "MultiLineString" ? coordinates : [];
      for (const line of lines) {
        for (let i = 1; i < line.length; i += 1) addEdge(line[i - 1], line[i]);
      }
    }
  
    return { graph, coordinatesByKey };
  }
  
  // startCoordinate / endCoordinate: [lng, lat]
  export function findPath({ graph, coordinatesByKey }, startCoordinate, endCoordinate) {
    if (graph.size === 0) return null;
  
    const startKey = findNearestVertex(startCoordinate, coordinatesByKey);
    const endKey = findNearestVertex(endCoordinate, coordinatesByKey);
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
      startCoordinate.slice(0, 2),
      ...pathKeys.map((key) => coordinatesByKey.get(key)),
      endCoordinate.slice(0, 2),
    ];
  }