// Funksjonaliteten til verktøyene
import * as turf from '@turf/turf'

// Buffer-verktøyet
export function buffer(layer, radius, name){
  const data = turf.buffer(layer, radius, {units: 'meters'})
  return makeLayer(data, 'Buffer(' + name +')' + radius + 'm')
}

// Union-verktøyet, gir beskjed om noe går galt i en pop-up
export function union(layer1, layer2, name){
  const data = turf.union(layer1, layer2)
  if(data === null){
    document.getElementById("header").innerHTML = name
    document.getElementById("body").innerHTML = "Error, dette var det noe rart med"
    document.getElementById("footer").innerHTML = ""
    document.getElementById("myModal").style.display = "block"
    return
  }else{
    return makeLayer(data, 'Union(' + name + ')')
  }

}

// Snitt-verktøyet, gir beskjed om lagene ikke overalpper i en pop-up
export function intersect(layer1, layer2, name){
  const data = turf.intersect(layer1, layer2)
  if(data === null){
    if(isMultiPolygon(layer1.geometry.coordinates) && isMultiPolygon(layer2.geometry.coordinates)){
      const polyLayer1 = multiPolyToPoly(layer1.geometry.coordinates)
      const polyLayer2 = multiPolyToPoly(layer2.geometry.coordinates)
      return makeLayer(intersectArrayToPoly(polyLayer1, polyLayer2), 'Snitt(' + name + ')')
    }
    else if(isMultiPolygon(layer1.geometry.coordinates)){
      const polygons = multiPolyToPoly(layer1.geometry.coordinates)
      return makeLayer(intersectPoly(layer2, polygons), 'Snitt(' + name + ')')
    }
    else if(isMultiPolygon(layer2.geometry.coordinates)){
      const polygons = multiPolyToPoly(layer2.geometry.coordinates)
      return makeLayer(intersectPoly(layer1, polygons), 'Snitt(' + name + ')')
    }
    else{
      document.getElementById("header").innerHTML = name
      document.getElementById("body").innerHTML = "Lagene overlapper ikke"
      document.getElementById("footer").innerHTML = ""
      document.getElementById("myModal").style.display = "block"
      return
    }
  }
  else{
    return makeLayer(data, 'Snitt(' + name + ')')
  }
}

// Areal-verktøyet
export function area(layer, name){
  const area = turf.area(layer);
  document.getElementById("header").innerHTML = name
  document.getElementById("body").innerHTML = "Arealet er " + Math.round(area) + " kvm"
  document.getElementById("footer").innerHTML = ""
  document.getElementById("myModal").style.display = "block"
}

// Differanse-verktøyet, gir beskjed om noe går galt i en pop-up
export function difference(layer, minusLayer, name){
  const data =  turf.difference(layer, minusLayer)
  if(data === null){
    document.getElementById("header").innerHTML = name
    document.getElementById("body").innerHTML = "Error, dette var det noe rart med"
    document.getElementById("footer").innerHTML = ""
    document.getElementById("myModal").style.display = "block"
    return
  }
  else{
    return makeLayer(data, 'Differanse(' + name + ')')
  }
}

// Finner snitt av to lister med polygoner og returnerer et GeoJson-multipolygon
function intersectArrayToPoly(array1, array2){
  let intersect = []
  for (var i = 0; i < array1.length; i++) {
    for (var j = 0; j < array2.length; j++) {
      const data = turf.intersect(array1[i], array2[j])
      if(data !== null) intersect.push(data.geometry.coordinates)
    }
  }
  const  poly = turf.multiPolygon(intersect)
  return poly
}

// Finner snitt av en liste med polygoner og et enkeltpolygon og returnerer et GeoJson-multipolygon
function intersectPoly(feature, arrayFeatures){
  let intersect = []
  for (var i = 0; i < arrayFeatures.length; i++) {
    const data = turf.intersect(feature, arrayFeatures[i])
    if(data !== null) intersect.push(data.geometry.coordinates)
  }
  const  poly = turf.multiPolygon(intersect)
  return poly
}

// Sannhetsfunksjon for testing av potensielle GeoJson-multipolygoner
function isMultiPolygon(coords){
  const x = coords[0][0][0]
  const type = typeof x
  if(type  !== "number"){
    return true
  }
  else{
    return false
  }
}

// Gjør et multipolygon om til en liste med enkeltpolygoner
function multiPolyToPoly(multiPoly){
  let arrayPoly = []
  for (const poly of multiPoly) {
    const polygon = turf.polygon(poly)
    arrayPoly.push(polygon)
  }
  return arrayPoly
}

// Genererer en tilfledig farge
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Lager et nytt lag som kan legges til i kartet
function makeLayer(data, name){
  if(data === null){
    document.getElementById("header").innerHTML = name
    document.getElementById("body").innerHTML = "Error, dette var det noe rart med"
    document.getElementById("footer").innerHTML = ""
    document.getElementById("myModal").style.display = "block"
    return
  }
  else{
    return {
      "id": name,
      "type": "fill",
      "source": {
        type: 'geojson',
        data: data
      },
      "paint": {
        "fill-color": getRandomColor(),
        "fill-opacity": 0.5
      },
      "layout":{
        "visibility":"visible"
      }
    }
  }
}