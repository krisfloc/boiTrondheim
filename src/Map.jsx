import React, { Component } from 'react'
import './App.css'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1Ijoia3Jpc2Zsb2MiLCJhIjoiY2s2cnRoeGhpMDZoeTNvcXA1MHl0MHdtbiJ9.7HrL3KohbKy-w0xQ5Te2uQ';

// kart-komponenten som brukes på siden og alle funksjoner for visning av data på kartet
class Map extends Component{
  constructor(props) {
    super(props);
    // Setter initielle koordinater og zoom-nivå for kartet
    this.state = {
      lat: 63.43,
      lng: 10.38,
      zoom: 13.5
    };
  }

  // funksjon som kalles når kartet lastes første gang
  componentDidMount() {
    const { lng, lat, zoom } = this.state
    const  allLayers  = this.props.allLayers

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom,
    });

    // Laster in alle forhåndsdefinerte data til kartet når det selv lastes inn
    map.on('load', () => {
      allLayers.forEach( layer => {
        map.addLayer(layer)
      })
    })

    // Sørger for at man kan bevege seg og zoome i kartet
    map.on('move', () => {
      const { lng, lat } = map.getCenter()
      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      })
    })
    this.map = map
  }

  // Legger nye data i kartet
  add(newLayer){
    this.map.addLayer(newLayer)
    this.map.setLayoutProperty(newLayer.id, 'visibility', 'visible')
  }

  // Skjuler spesifiserte lag
  hide(layers){
    layers.forEach(id => {
      const layer = this.map.getLayer(id)
      this.map.setLayoutProperty(layer.id, 'visibility', 'none')
    })
  }

  // Viser spesifiserte lag
  display(layers){
    layers.forEach(id => {
      const layer = this.map.getLayer(id)
      this.map.setLayoutProperty(layer.id, 'visibility', 'visible')
    })
  }

  render() {
    return (
      <div className="map" ref={el => this.mapContainer = el} />
    );
  }
}

export default Map
