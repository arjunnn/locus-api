# Locus API

## Introduction
Locus API provides a barebones API for Locus Android app. The api
is available at [http://locus.arjun.ninja/api](http://locus.arjun.ninja/api) and is powered
by a [Node.js](http://nodejs.org/) server on [Microsoft Azure](https://azure.microsoft.com/en-in/)
## Routes
All the routes must begin with `/api`.
The following routes are available:

  [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/06b947504dab45445355)

1. ### `GET /geocode`

    This route takes a HTTP GET request with three custom headers, `lat`, `lng`, `radius` (in meters) and returns
    a JSON response with details of nearby places. It contains the following arrays:
    - `names[]` : Names of places
    - `codes[]` : `place_id` code of places, which is a unique identifier for each place.
    - `lats[]`  : latitudes of places
    - `lngs[]`  : longitudes of places
    - `ratings[]` : average ratings of places out of 5. Could be `null` in some cases, so the default rating is now 2.5

    #### Examples
    - cURL
      ```
      curl -X GET -H "lat: 17.3937175" -H "lng: 78.5340408" -H "radius: 500"  "http://locus.arjun.ninja/api/geocode"
      ```
    - Java (using [OkHttp](https://square.github.io/okhttp/))
      ```
      OkHttpClient client = new OkHttpClient();

      Request request = new Request.Builder()
      .url("http://locus.arjun.ninja/api/geocode")
      .get()
      .addHeader("lat", "17.3937175")
      .addHeader("lng", "78.5340408")
      .addHeader("radius", "500")
      .build();

      Response response = client.newCall(request).execute();
      ```
2. ### `GET /place/`

    This route takes just the `place_id` custom header, and returns a JSON
    response with the following keys:
    - `address` : Address of the place. Defaults to `null` if key is not available.
    - `phone_number` : international phone number of the place. Defaults to `null` if key is not available.
    - `open_now` : will return `true` or `false` depending on whether place is open right now. Defaults to `null` if key is not available.
    - `website` : website of the place. Defaults to `null` if key is not available.
    <!-- - `image_url` : URL of the featured image -->
    <!-- - `cost_for_two` : Average cost for two people -->

    #### Examples
    - cURL
      ```
      curl -X GET -H "place_id: ChIJ40jBSAKZyzsROhGhME26ZCo" "http://locus.arjun.ninja/api/place/"
      ```
    - Java
      ```
      OkHttpClient client = new OkHttpClient();

      Request request = new Request.Builder()
        .url("http://locus.arjun.ninja/api/place/")
        .addHeader("place_id", "ChIJ40jBSAKZyzsROhGhME26ZCo")
        .get()
        .build();

      Response response = client.newCall(request).execute();
      ```

<!-- NOTE: THIS API IS POWERED BY GOOGLE PLACES WEB API -->
