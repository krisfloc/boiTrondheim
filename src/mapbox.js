// Lager kartlag til kart-komponenten fra GeoJson-data

import {midtbyen, kalvskinnet, torget, hovedvei, butikker, busstopp} from './geojson.js'

const midtbyen_layer = {
    "id": "Midtbyen",
    "type": "fill",
    "source": {
        type: 'geojson',
        data: midtbyen
    },
    "paint": {
        "fill-color": "#04ea10",
        "fill-opacity": 0.5
    },
    "layout": {
        "visibility": "none"
    }
}

const kalvskinnet_layer = {
    "id": "Kalvskinnet",
    "type": "fill",
    "source": {
        type: 'geojson',
        data: kalvskinnet
    },
    "paint": {
        "fill-color": "#dbdb00",
        "fill-opacity": 0.5
    },
    "layout": {
        "visibility": "none"
    }
}

const torget_layer = {
    "id": "Torget",
    "type": "fill",
    "source": {
        type: 'geojson',
        data: torget
    },
    "paint": {
        "fill-color": "#dbdb00",
        "fill-opacity": 0.5
    },
    "layout": {
        "visibility": "none"
    }
}

const hovedvei_layer = {
    "id": "Hovedvei",
    "type": "line",
    "source": {
        type: 'geojson',
        data: hovedvei
    },
    "paint": {
        "line-color": "#ff0000",
        "line-width": 3
    },
    "layout": {
        "visibility": "none"
    }
}

const butikker_layer = {
    "id": "Butikker",
    "type": "circle",
    "source": {
        type: 'geojson',
        data: butikker
    },
    "paint": {
        "circle-color": "#0080ff",
        "circle-radius": 5,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#00f0ff"
    },
    "layout": {
        "visibility": "none"
    }
}

const busstopp_layer = {
    "id": "Busstopp",
    "type": "circle",
    "source": {
        type: 'geojson',
        data: busstopp
    },
    "paint": {
        "circle-color": "#800080",
        "circle-radius": 5,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#df0070"
    },
    "layout": {
        "visibility": "none"
    }
}

const layers = [midtbyen_layer, kalvskinnet_layer, torget_layer, hovedvei_layer, butikker_layer, busstopp_layer]

export default layers