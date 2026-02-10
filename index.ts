import h3 from "h3-js"

const server = Bun.serve({
    port: process.env.PORT || 8080,
    routes: {
        "/": () => new Response("hello chads"),
        "/ping": () => new Response("pong"),
        "/h3-index": () => getH3Index()
    }
})

function getH3Index() {
    const h3Index = h3.latLngToCell(23.0301216, 88.5257018, 10)

    return Response.json(h3Index);
}

console.debug(server.development)
console.debug(server.hostname)
console.debug(server.id)
console.debug(server.pendingRequests)
console.debug(server.port)
console.debug(server.protocol)

console.log("server running on " + server.url)

// getCurrentLocation

const options = {
    enableHighAccuracy: true,
    timeout: 3000,
    maximumAge: 0
}

function currentLocation(pos: GeolocationPosition) {
    const crds = pos.coords;
    console.log("your location");
    console.log("lat: " + crds.latitude);
    console.log("long: " + crds.longitude);
    console.log("accuracy: " + crds.accuracy);

    const resObj = {
        success: true,
        locationData: {
            lat: crds.latitude,
            long: crds.longitude,
            accuracy: crds.accuracy
        }
    }

    return Response.json(resObj)
}



