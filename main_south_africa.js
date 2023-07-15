window.onload = init;
function init() {
    var map, geojson, layer_name, layerSwitcher, featureOverlay;
    var container, content, closer;
    var container = document.getElementById("popup");
    var content = document.getElementById("popup-content");
    var closer = document.getElementById("popup-closer");

    /**
     * Create an overlay to anchor the popup to the map.
     */
    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250,
        },
    });

    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    var view = new ol.View({
        projection: "EPSG:4326",
        center: [27.73, -26.55],
        zoom: 10.5,
    });
    var view_ov = new ol.View({
        projection: "EPSG:4326",
        center: [80, 17.5],
        zoom: 5,
    });

    var base_maps = new ol.layer.Group({
        title: "Base maps",
        layers: [
            new ol.layer.Tile({
                title:"Bing Map",
                type:"base",
                visible: true,
                source: new ol.source.BingMaps({
                  key: "AvcmFjEs4wUeEgcoyiNcImmFiKaHQA6-yWGPH5cEV4Sru8tQwjyOutXchQ_QLyX-",
                  imagerySet: "AerialWithLabels",
                })
              }),
            new ol.layer.Tile({
                title: "OSM",
                type: "base",
                visible: true,
                source: new ol.source.OSM(),
            }),
        ],
    });

    var OSM = new ol.layer.Tile({
        source: new ol.source.OSM(),
        type: "base",
        title: "OSM",
    });

    var overlays = new ol.layer.Group({
        title: "Overlays",
        layers: [
            new ol.layer.Tile({
                title: "RIETSPRUIT BOUNDARY",
                source: new ol.source.TileWMS({
                    url: "http://localhost:8080/geoserver/wms",
                    params: { LAYERS: "BRICS:RIETSPRUIT BOUNDARY", TILED: true },
                    serverType: "geoserver",
                    transition: 0,
                }),
            }),
            new ol.layer.Tile({
                title: "STREAMS",
                source: new ol.source.TileWMS({
                    url: "http://localhost:8080/geoserver/wms",
                    params: { LAYERS: "BRICS:STREAMS", TILED: true },
                    serverType: "geoserver",
                    transition: 0,
                }),
            }),
            new ol.layer.Tile({
                title: "WEATHER SERVICES DATA",
                source: new ol.source.TileWMS({
                    url: "http://localhost:8080/geoserver/wms",
                    params: { LAYERS: "BRICS:WEATHER SERVICES DATA", TILED: true },
                    serverType: "geoserver",
                    transition: 0,
                }),
            }),
            new ol.layer.Tile({
                title: "WATER QUALITY POINTS",
                source: new ol.source.TileWMS({
                    url: "http://localhost:8080/geoserver/wms",
                    params: { LAYERS: "BRICS:WATER QUALITY POINTS", TILED: true },
                    serverType: "geoserver",
                    transition: 0,
                }),
            }),
            new ol.layer.Tile({
                title: "CORDEX POINTS",
                source: new ol.source.TileWMS({
                    url: "http://localhost:8080/geoserver/wms",
                    params: { LAYERS: "BRICS:CORDEX POINTS", TILED: true },
                    serverType: "geoserver",
                    transition: 0,
                }),
            }),
            new ol.layer.Tile({
                title: "RAINGUAGE",
                source: new ol.source.TileWMS({
                    url: "http://localhost:8080/geoserver/wms",
                    params: { LAYERS: "BRICS:RAINGUAGE", TILED: true },
                    serverType: "geoserver",
                    transition: 0,
                }),
            }),
        ],
    });

    var map = new ol.Map({
        target: "map",
        view: view,
        overlays: [overlay],
    });

    map.addLayer(base_maps);
    map.addLayer(overlays);

    var mouse_position = new ol.control.MousePosition();
    map.addControl(mouse_position);

    var overview = new ol.control.OverviewMap({
        view: view_ov,
        collapseLabel: "O",
        label: "O",
        layers: [OSM],
    });

    map.addControl(overview);

    var full_sc = new ol.control.FullScreen({ label: "F" });
    map.addControl(full_sc);

    var zoom = new ol.control.Zoom({ zoomInLabel: "+", zoomOutLabel: "-" });
    map.addControl(zoom);

    var slider = new ol.control.ZoomSlider();
    map.addControl(slider);

    var zoom_ex = new ol.control.ZoomToExtent({
        extent: [65.9, 7.48, 98.96, 40.3],
    });
    map.addControl(zoom_ex);

    var layerSwitcher = new ol.control.LayerSwitcher({
        activationMode: "click",
        startActive: true,
        tipLabel: "Layers", // Optional label for button
        groupSelectStyle: "children", // Can be 'children' [default], 'group' or 'none'
        collapseTipLabel: "Collapse layers",
    });
    map.addControl(layerSwitcher);

    function legend() {
        //	$('#legend').empty();

        var no_layers = overlays.getLayers().get("length");

        var head = document.createElement("h4");

        var txt = document.createTextNode("Legend");

        head.appendChild(txt);
        var element = document.getElementById("legend");
        element.appendChild(head);
        var ar = [];
        var i;
        for (i = 0; i < no_layers; i++) {
            ar.push(
                "http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" +
                overlays.getLayers().item(i).get("title")
            );
            //alert(overlays.getLayers().item(i).get('title'));
        }
        for (i = 0; i < no_layers; i++) {
            var head = document.createElement("p");

            var txt = document.createTextNode(
                overlays.getLayers().item(i).get("title")
            );
            //alert(txt[i]);
            head.appendChild(txt);
            var element = document.getElementById("legend");
            element.appendChild(head);
            var img = new Image();
            img.src = ar[i];

            var src = document.getElementById("legend");
            src.appendChild(img);
        }
    }

    legend();
}
