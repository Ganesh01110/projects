
Where to Use Cache?
We will use different caching strategies based on the use case:
Service                 API                      Cache Type         Why?

User        GET /api/user/profile           Cache Aside           Reduce DB calls for user data.
User        GET /api/user/drivers              Read Through        Preload driver data into cache for faster lookup.
Ride        GET /api/ride/status/:rideId        Cache Aside        Store active ride status in Redis (frequent reads).
Location      POST /api/location/update        Write Through        Ensure real-time driver location updates.
Location      GET /api/location/nearby        Read Through        Fetch nearby drivers from cache first.

Kafka (Pub-Sub)

Kafka will be used where events need to be broadcasted to multiple services asynchronously.

Publisher           Event                       Subscribers                  Why?

Ride Service         ride.booked               Notification Service         Notify driver & user when a ride is booked.
Ride Service          ride.status.updated        Notification Service         Send real-time updates on ride status.
Location Service     driver.location.updated        Ride Service            Improve ride matching based on location.

gRPC Communication

gRPC is best for low-latency, synchronous service-to-service communication.

Client                      gRPC Method                                      Server              Why?

Ride Service             findNearestDrivers(userLocation)        Location Service        Fast lookup for drivers near the user.
Notification Service        sendNotification(userId, message)        Ride Service        Ensure ride updates are delivered.

WebSockets (Real-Time Updates)


WebSockets will be used for real-time push updates to the frontend.

Service                     Event                           WebSocket Clients             Why?

Ride Service             ride.status.changed                  Rider & Driver            Notify both parties of ride status changes.
Location Service        driver.location.updated        Ride Matching System        Show live driver tracking.
Notification Service        new.notification                 User                           Push notifications for ride updates.