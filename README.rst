===============
Leaflet.Deflate
===============

.. image:: https://api.travis-ci.org/oliverroick/Leaflet.Deflate.svg?branch=master
    :target: https://travis-ci.org/oliverroick/Leaflet.Deflate

Substitutes polygons and lines with markers when their screen size falls below a defined threshold.

.. image:: https://cloud.githubusercontent.com/assets/159510/7164588/090c06fe-e399-11e4-956d-0283ef7e69cf.gif

Usage
=====

Include `L.Deflate.js` from UNPKG:

.. code-block:: html

    <script src="https://unpkg.com/Leaflet.Deflate@0.3.0/dist/L.Deflate.js"></script>

Initialize with the `minSize` option and add to map. `minSize` defines the minimum width and height in pixels for a path to be displayed in its actual shape. It defaults to `20`.

.. code-block:: javascript

    var map = L.map("map");
    L.Deflate({minSize: 10}).addTo(map);

    // add layers
    L.circle([51.508, -0.11], 500).addTo(map);

    // works with GeoJSONLayer too
    L.geoJson(json).addTo(map);


FeatureGroup
------------

You can apply deflating to one `FeatureGroup`—only features inside that feature group will be affected by `Leaflet.Deflate`.

.. code-block:: javascript

    var map = L.map("map");

    var featureGroup = L.featureGroup().addTo(map)
    L.Deflate({minSize: 10, featureGroup: featureGroup}).addTo(map);

    // The polygon will be deflated
    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]);
    featureGroup.addLayer(polygon);

    // The circle will NOT be deflated
    L.circle([51.508, -0.11], 500).addTo(map);


Cluster Markers
---------------

With a little help from `Leaflet.Markercluster <https://github.com/Leaflet/Leaflet.markercluster>`_ and  `Leaflet.Markercluster.LayerSupport <https://github.com/ghybs/Leaflet.MarkerCluster.LayerSupport>`_ you can cluster markers on your map.

.. code-block:: javascript

    var map = L.map("map");

    var featureGroup = L.featureGroup();
    featureGroup.addTo(map);
    L.Deflate({minSize: 10, featureGroup: featureGroup}).addTo(map);

    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]);
    featureGroup.addLayer(polygon);

    L.circle([51.508, -0.11], 500).addTo(map);
    featureGroup.addLayer(circle);

    var markerGroup = L.markerClusterGroup.layerSupport()
    markerGroup.addTo(map);
    markerGroup.checkIn(featureGroup);

    // Dirty hack; otherwise the cluster won't appear on the map.
    map.zoomIn(0);
    map.zoomOut(0);

Developing
==========

You'll need to install the dev dependencies to test and write the distribution file.

.. code-block::

    npm install
    
To run tests:

.. code-block::

    gulp test
    
To write a minified JS into dist:

.. code-block::

    gulp dist

Authors
=======

- `Lindsey Jacks <https://github.com/linzjax>`_
- `Oliver Roick <http://github.com/oliverroick>`_

License
=======

Apache 2.0


.. image:: https://badges.greenkeeper.io/oliverroick/Leaflet.Deflate.svg
   :alt: Greenkeeper badge
   :target: https://greenkeeper.io/