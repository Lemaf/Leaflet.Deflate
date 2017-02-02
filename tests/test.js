describe('Leaflet.Deflate', function() {
    var map, l;

    beforeEach(function() {
        map = L.map("map").setView([51.505, -0.09], 10);
    });

    afterEach(function () {
        map.remove();
    });

    describe('Polygon', function () {
        var polygon, circle;
        beforeEach(function() {
            l = L.deflate({minSize: 20}).addTo(map);

            polygon = L.polygon([
                [51.509, -0.08],
                [51.503, -0.06],
                [51.51, -0.047]
            ]).addTo(l);
        });

        it('should be on map', function () {
            map.setZoom(13, {animate: false});

            var onMap = false;

            map.eachLayer(function (layer) {
                if (polygon === layer) {
                        onMap = true;
                }
            });
            onMap.should.equal(true);
        });

        it('should not be on map', function () {
            map.setZoom(10, {animate: false});

            var onMap = false;

            map.eachLayer(function (layer) {
                if (polygon === layer) {
                        onMap = true;
                }
            });
            onMap.should.equal(false);
        });

        it('should not be on map when outside bbox', function () {
            map.panTo([0, 0])
            map.setZoom(13, {animate: false});

            var onMap = false;

            map.eachLayer(function (layer) {
                if (polygon === layer) {
                        onMap = true;
                }
            });
            onMap.should.equal(false);
        });

        it('should on map when dragged inside bbox', function () {
            map.panTo([0, 0], {animate: false});
            map.setZoom(13, {animate: false});
            map.panTo([51.505, -0.09], {animate: false});

            var onMap = false;

            map.eachLayer(function (layer) {
                if (polygon === layer) {
                    onMap = true;
                }
            });
            onMap.should.equal(true);
        });

        it('should remove marker', function () {
            map.setZoom(10, {animate: false});
            l.removeLayer(polygon)

            var onMap = false;

            map.eachLayer(function (layer) {
                if (polygon.marker === layer || polygon.marker === layer ) {
                    onMap = true;
                }
            });
            onMap.should.equal(false);
        });

        it('should remove polygon', function () {
            map.setZoom(13, {animate: false});
            l.removeLayer(polygon)

            var onMap = false;

            map.eachLayer(function (layer) {
                if (polygon.marker === layer || polygon.marker === layer ) {
                    onMap = true;
                }
            });
            onMap.should.equal(false);
        });
    });

    describe('GeoJSON', function () {
        beforeEach(function() {
            l = L.deflate({minSize: 20}).addTo(map);

            var json = {
              "type": "FeatureCollection",
              "features": [
                {
                  "type": "Feature",
                  "properties": {
                    "id": 1
                  },
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                      [
                        [
                          -0.273284912109375,
                          51.60437164681676
                        ],
                        [
                          -0.30212402343749994,
                          51.572802100290254
                        ],
                        [
                          -0.276031494140625,
                          51.57194856482396
                        ],
                        [
                          -0.267791748046875,
                          51.587309751245456
                        ],
                        [
                          -0.273284912109375,
                          51.60437164681676
                        ]
                      ]
                    ]
                  }
                },
                {
                  "type": "Feature",
                  "properties": {
                    "id": 4
                  },
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                      [
                        [
                          -0.25543212890625,
                          51.600959780448626
                        ],
                        [
                          -0.2581787109375,
                          51.57621608189101
                        ],
                        [
                          -0.22247314453125,
                          51.6001067737997
                        ],
                        [
                          -0.24032592773437497,
                          51.613752957501
                        ],
                        [
                          -0.25543212890625,
                          51.600959780448626
                        ]
                      ]
                    ]
                  }
                },
                {
                  "type": "Feature",
                  "properties": {
                    "id": 2
                  },
                  "geometry": {
                    "type": "Point",
                    "coordinates": [
                      0.031585693359375,
                      51.4428807236673
                    ]
                  }
                },
                {
                  "type": "Feature",
                  "properties": {
                    "id": 3
                  },
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                      [
                        [
                          0.06866455078125,
                          51.59584150020809
                        ],
                        [
                          0.06866455078125,
                          51.61034179610212
                        ],
                        [
                          0.10162353515625,
                          51.61034179610212
                        ],
                        [
                          0.10162353515625,
                          51.59584150020809
                        ],
                        [
                          0.06866455078125,
                          51.59584150020809
                        ]
                      ]
                    ]
                  }
                }
              ]
            }

            L.geoJson(json).addTo(l);
        });

        it('zoom == 10: 2 polygons should be on the map', function () {
            map.setZoom(10, {animate: false});

            var count = 0;

            map.eachLayer(function (layer) {
                if (layer.zoomThreshold && layer.getBounds) { count++; }
            });
            count.should.equal(2);
        });

        it('zoom == 11: 3 polygons should be on the map', function () {
            map.setZoom(11, {animate: false});

            var count = 0;

            map.eachLayer(function (layer) {
                if (layer.zoomThreshold && layer.getBounds) { count++; }
            });
            count.should.equal(3);
        }); 
    });

    describe('Events', function () {
        it('passes event listeners to marker', function () {
            l = L.deflate({minSize: 20}).addTo(map);
            var callback = function() {}
            
            polygon = L.polygon([
                [51.509, -0.08],
                [51.503, -0.06],
                [51.51, -0.047]
            ]);
            polygon.on('click', callback);
            polygon.addTo(l);

            polygon.marker._events.should.have.property('click');
            polygon.marker._events['click'][0].fn.should.equal(callback);
        });
    });
});
