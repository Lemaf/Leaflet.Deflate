L.Deflate = function(options) {
    var removedPaths = [];
    var minSize = options.minSize || 10;
    var layer, map;

    function isCollapsed(path, zoom) {
        var bounds = path.getBounds();

        var ne_px = map.project(bounds.getNorthEast(), zoom);
        var sw_px = map.project(bounds.getSouthWest(), zoom);

        var width = ne_px.x - sw_px.x;
        var height = sw_px.y - ne_px.y;
        return (height < minSize || width < minSize);
    }

    function getZoomThreshold(path) {
        var zoomThreshold = null;
        var zoom = map.getZoom();
        if (isCollapsed(path, map.getZoom())) {
            while (!zoomThreshold) {
                zoom += 1;
                if (!isCollapsed(path, zoom)) {
                    zoomThreshold = zoom - 1;
                }
            }
        } else {
            while (!zoomThreshold) {
                zoom -= 1;
                if (isCollapsed(path, zoom)) {
                    zoomThreshold = zoom;
                }
            }
        }
        return zoomThreshold;
    }

    function layeradd(event) {
        var feature = event.layer;
        if (!feature._layers && feature.getBounds && !feature.zoomThreshold && !feature.marker) {
            var zoomThreshold = getZoomThreshold(feature);

            if(options.icon && options.markerColor) {
                var pointStyle = L.VectorMarkers.icon({
                    markerColor: options.markerColor,
                    iconColor: options.iconColor ? options.iconColor : '#000000',
                    icon: options.icon
                });
            }

            var marker = L.marker(feature.getBounds().getCenter(), {icon: pointStyle});

            if (feature._popupHandlersAdded) {
                marker.bindPopup(feature._popup._content)
            }

            var events = feature._events;
            for (var event in events) {
                if (events.hasOwnProperty(event)) {
                    var listeners = events[event];
                    for (var i = 0, len = listeners.length; i < len; i++) {
                        marker.on(event, listeners[i].fn) 
                    }
                }
            }
            marker.options = feature.options;
            feature.zoomThreshold = zoomThreshold;
            feature.marker = marker;

            if (map.getZoom() <= zoomThreshold) {
                layer.removeLayer(feature);
                layer.addLayer(feature.marker);
                removedPaths.push(feature);
            }
        }
    }

    function zoomend() {
        if (layer !== map) { map.removeLayer(layer); }
        var removedTemp = [];

        layer.eachLayer(function (feature) {
            if (map.getZoom() <= feature.zoomThreshold) {
                layer.removeLayer(feature);
                layer.addLayer(feature.marker);
                removedTemp.push(feature);
            }
        });

        for (var i = 0; i < removedPaths.length; i++) {
            var feature = removedPaths[i];
            if (map.getZoom() > feature.zoomThreshold) {
                layer.removeLayer(feature.marker);
                layer.addLayer(feature);
                removedPaths.splice(i, 1);
                i = i - 1;
            }
        }

        if (layer !== map) { map.addLayer(layer); }
        removedPaths = removedPaths.concat(removedTemp);
    }

    function addTo(addToMap) {
        layer = options.featureGroup || addToMap;
        map = addToMap;

        layer.on('layeradd', layeradd);
        map.on('zoomend', zoomend);
    }

    return { addTo: addTo }
}
