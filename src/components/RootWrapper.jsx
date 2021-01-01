import React, { Component } from 'react'
import Map from './Map/Map.jsx'
import MapMenu from './MapMenu/MapMenu.jsx'
import allLayers from '../datasets/layers.js'


class RootWrapper extends Component {

  constructor(props) {
    super(props);

    //Binding av funksjonene
    this.handleLayerChange = this.handleLayerChange.bind(this);
    this.newLayerAdded = this.newLayerAdded.bind(this);

    this.mapElement = React.createRef() //Lager en referanse til map-komponenten som gjør at map-komponentens funksjoner kan kalles fra RootWrapper-komponeenten

    //Setter allAvailableLayers til alle lagene som importeres fra dataset-filen med alle kartlagene
    this.state = {
      allAvailableLayers: allLayers,
      visibleLayers: [],
    };
  }

  //Tar inn et lag, legger det til å lag-listene og kaller addNewLayer-funksjonen i Map-komponenten for å legge til laget i kartet
  newLayerAdded(layer){
    const {allAvailableLayers, visibleLayers} = this.state
    this.setState({
      visibleLayers: [...visibleLayers, layer],
      allAvailableLayers: [...allAvailableLayers, layer],
    })

    this.mapElement.current.addNewLayer(layer)
  }

  //Tar inn en liste med de oppdaterte synlige lagene, oppdaterer state og kaller funksjoneni Map-komponenten som sørger for at lagene som vises på kartet oppdateres
  handleLayerChange(updatedLayers){
    const currentVisibleLayers = this.state.visibleLayers
    updatedLayers.map(layer => layer.layout.visibility = "visible")
    this.setState({
      visibleLayers: updatedLayers
    })

    const newLayers = updatedLayers.filter(layer => !currentVisibleLayers.includes(layer)).map(layer => layer.id) //Filtrer ut slik at newLayers kun er lagene som ikke var synlige før
    const layersToHide = currentVisibleLayers.filter(layer => !updatedLayers.includes(layer)).map(layer => layer.id) //Filtrer ut slik at layersToHide kun er lagene som var synlige før, men som ikke skal være det etter oppdateringeen

    this.mapElement.current.updateLayers(newLayers, layersToHide)
  }

  render() {
    const { allAvailableLayers, visibleLayers} = this.state

    return (
      <div className="RootWrapper">
        <MapMenu layers={allAvailableLayers} visibleLayers={visibleLayers} layersChanged={this.handleLayerChange} addLayer={this.newLayerAdded}/>
        <div className="map-container">
         <Map allAvailableLayers={allAvailableLayers} visibleLayers={visibleLayers} ref={this.mapElement} />
        </div>
     </div>
    )
  }
}

export default RootWrapper;
