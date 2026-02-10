const server = Bun.serve({
    port: process.env.PORT || 8080,
    routes: {
        "/": () => new Response("hello chads"),
        "/ping": () => new Response("pong")
    }
})

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

function success(pos: GeolocationPosition) {

}



