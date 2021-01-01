//Denne filen inneholder funksjonaliteten bak verktøyene
import * as turf from '@turf/turf'

/**
  * @desc Kjører buffer-operasjon på  input-lag og bufferdistanse, returnerer nytt lag
  * @return layer-object - Resultatet fra buffer-verktøyet
*/
export function bufferTool(layer, bufferDistance, layerName){
    const bufferData =  turf.buffer(layer, bufferDistance, {units: 'meters'})
    return createLayerFromGeoJSON(bufferData, 'fill', layerName + bufferDistance + "m")
}

/**
  * @desc Kjører union-operasjon på  input-lagene, returnerer nytt lag
  * @return layer-object - Resultatet fra union-verktøyet
*/
export function unionTool(l1, l2, layerName){
    const data =  turf.union(l1, l2)
    if(data === null){
        alert("NULL")
        return
    }else{
        return createLayerFromGeoJSON(data, 'fill', 'Union-' + layerName)
    }

}

/**
  * @desc Kjører snitt-operasjon på  input-lagene, returnerer nytt lag
  * @return layer-object - Resultatet fra snitt-verktøyet
*/
export function intersectionTool(l1, l2, layerName){

    const data=  turf.intersect(l1, l2)
    //Hvis turf.intersect returnerer null er enten et eller begge inn-lagene MultiPolygoner, eller det finnes ingen overlapp mellom de to inndatalagene
    if(data === null){
        if(isMultiPolygon(l1.geometry.coordinates) && isMultiPolygon(l2.geometry.coordinates)){

            const polygonsl1 = multiPolygonToPolygons(l1.geometry.coordinates)
            const polygonsl2 = multiPolygonToPolygons(l2.geometry.coordinates)

            return createLayerFromGeoJSON(getIntersectingPolygonsFeatureFromArraysOfFeatures(polygonsl1, polygonsl2), 'fill', layerName + '-intersection')
        }else if(isMultiPolygon(l1.geometry.coordinates)){
            console.log("l1 is multipoly")
            const polygons = multiPolygonToPolygons(l1.geometry.coordinates)
            return createLayerFromGeoJSON(getIntersectingPolygonsFeature(l2, polygons), 'fill', layerName + '-intersection')
        }else if(isMultiPolygon(l2.geometry.coordinates)){

            const polygons = multiPolygonToPolygons(l2.geometry.coordinates)
            return createLayerFromGeoJSON(getIntersectingPolygonsFeature(l1, polygons), 'fill', layerName + '-intersection')
        }else{
            alert("NULL, ingen overlapp mellom lagene")
            return
        }
    }else{
        return createLayerFromGeoJSON(data, 'fill', layerName + '-intersection')
    }
}

/**
  * @desc Måler linjelengde av input-laget, viser resultatet til brukeren
*/
export function lineLengthTool(layer, layerName){
    const length = turf.length(layer, {units: 'meters'});
    alert("Lengden av " + layerName + " er " + length.toFixed(2) + " meter");
}

/**
  * @desc Måler arealeet av input-laget, viser resultatet til brukeren
*/
export function areaTool(layer, layerName){
    const area = turf.area(layer);
    document.getElementById("header").innerHTML = layerName
    document.getElementById("body").innerHTML = "Arealet er " + Math.round(area) + " kvm"
    document.getElementById("footer").innerHTML = ""
    document.getElementById("myModal").style.display = "block"
    // alert("Arealet av " + layerName + " er " + Math.round(area) + " kvm");
}

/**
  * @desc Tar inn to lister med Polygoner, finner snitt-resultatene for polygonene i den ene lista med polygonene i den andre lista, setter sammen resultatene og returnerer et multipolygon med alle snitt-resultatene
  * @return GeoJSON Polygon - resultat av snittoperasjon
*/
function getIntersectingPolygonsFeatureFromArraysOfFeatures(arrayOfFeaturesOne, arrayOfFeaturesTwo){
    let intersectedPolygons = []
    for (var i = 0; i < arrayOfFeaturesOne.length; i++) {
        for (var j = 0; j < arrayOfFeaturesTwo.length; j++) {
            const data = turf.intersect(arrayOfFeaturesOne[i], arrayOfFeaturesTwo[j])
            if(data !== null) intersectedPolygons.push(data.geometry.coordinates)
        }
    }
    const  multiPoly = turf.multiPolygon(intersectedPolygons)
    return multiPoly
}

/**
  * @desc Tar inn en lister med Polygoner og et enkelt Polygon, finner snitt-resultatene for polygonene i lista med enkelpolygonet, setter sammen resultatene  returnerer et multipolygon med snitt-resultatene
  * @return GeoJSON Polygon - resultat av snittoperasjon
*/
function getIntersectingPolygonsFeature(singleFeature, arrayOfFeatures){
    let intersectedPolygons = []
    for (var i = 0; i < arrayOfFeatures.length; i++) {
        const data = turf.intersect(singleFeature, arrayOfFeatures[i])
        if(data !== null) intersectedPolygons.push(data.geometry.coordinates)
    }
    const  multiPoly = turf.multiPolygon(intersectedPolygons)
    return multiPoly
}

/**
  * @desc Tar inne en liste med koordinater og sjekker om den utgjør et MultiPolygon
  * @return bool - true hvis MultiPolygon, false hvis ikke
*/
function isMultiPolygon(coordinates){
    const x = coordinates[0][0][0]
    const type = typeof x
    if(type  !== "number"){
        return true
    }else{
        return false
    }
}

/**
  * @desc Gjør om et MultiPolygon til en liste med enkeltpolygoner
  * @return liste med GeeoJSON Polygoner
*/
function multiPolygonToPolygons(multipolygon){
    let arrayOfPolygons = []

    for (const pol of multipolygon) {
        const polygon = turf.polygon(pol)
        arrayOfPolygons.push(polygon)
    }
    return arrayOfPolygons
}

/**
  * @desc Kjører differanse-operasjon på  input-lagene, returnerer nytt lag
  * @return layer-object - Resultatet fra differanse-verktøyet
*/
export function differenceTool(layer, layerToSubtract, layerName){
    const data =  turf.difference(layer, layerToSubtract)
    if(data === null){
        alert("NULL")
        return
    }else{
        return createLayerFromGeoJSON(data, 'fill', layerName + '-difference')
    }

}

/**
  * @desc Tar inn et GeoJSON-objekt, type lag som skal returneres, og navn på resultatlaget g returnerer et layer-object
  * @return layer-object
*/
export function createLayerFromGeoJSON(data, layerType, layerName){
    switch (layerType){
        case 'fill':
            return createFillLayer(data, layerName)
        case 'circle':
            return createPointLayer(data, layerName)
        case 'line':
            return createLineLayer(data, layerName)
        default:
            console.log("LayerType not recognized")
    }
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
  * @desc Tar inn et GeoJSON-objekt og navn på resultatlaget, returnerer et layer-object av typen fill
  * @return layer-object
*/
function createFillLayer(data, layerName){
    return {
      "id": layerName,
      "type": "fill",
      "source": {
        type: 'geojson',
        data: data
      },
      "paint": {
        "fill-color": getRandomColor(),
        "fill-opacity": 0.4
      },
      "layout":{
        "visibility":"visible"
      }
    }
}

/**
  * @desc Tar inn et GeoJSON-objekt og navn på resultatlaget, returnerer et layer-object av typen circle
  * @return layer-object
*/
function createPointLayer(data, layerName){
    return {
      "id": layerName,
      "type": "circle",
      "source": {
        type: 'geojson',
        data: data
      },
      "paint": {
          "circle-color": "#e23f04",
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff"
      },
      "layout":{
        "visibility":"visible"
      }
    }
}

/**
  * @desc Tar inn et GeoJSON-objekt og navn på resultatlaget, returnerer et layer-object av typen line
  * @return layer-object
*/
function createLineLayer(data, layerName){
    return  {
      "id": layerName,
      "type": "line",
      "source": {
        type: 'geojson',
        data: data
      },
      "paint": {
         "line-color": "#ff69b4",
         "line-width": 1
      },
      "layout":{
        "visibility":"visible"
      }
    }
}
