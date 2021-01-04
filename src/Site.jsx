import React, { Component } from 'react'
import Map from './Map.jsx'
import Navbar from './Navbar.jsx'
import layers from './mapbox.js'


class Site extends Component {
  constructor(props) {
    super(props);
    // definerer funksjonene som kan brukes utenfor komponenten
    this.update = this.update.bind(this);
    this.addNew = this.addNew.bind(this);
    this.reset = this.reset.bind(this)
    // Kaller inn kart-komponenten med funksjoner
    this.mapElement = React.createRef()
    // Setter initielle lag og synlige lag for siden
    this.state = {
      allLayers: layers,
      visible: [],
    };
  }
 
  // Funksjon som brukes i navbar-komponenten når et nytt lag blir lagt til i kartet
  addNew(layer){
    const {allLayers, visible} = this.state
    this.setState({
      visible: [...visible, layer],
      allLayers: [...allLayers, layer],
    })
    this.mapElement.current.add(layer)
  }

  // Funksjon som brukes når kartlagene tilbakestilles
  reset(){
    this.mapElement.current.hide(this.state.visible.map(layer => layer.id))
    this.setState({
      allLayers: layers,
      visible: []
    })
  }

  // Funksjon som kalles når kartlags synlighet skal oppdateres
  update(updatedLayers){
    const current = this.state.visible
    updatedLayers.map(layer => layer.layout.visibility = "visible")
    this.setState({
      visible: updatedLayers
    })
    const newLayers = updatedLayers.filter(layer => !current.includes(layer)).map(layer => layer.id) //Filtrer ut slik at newLayers kun er lagene som ikke var synlige før
    const layersToHide = current.filter(layer => !updatedLayers.includes(layer)).map(layer => layer.id) //Filtrer ut slik at layersToHide kun er lagene som var synlige før, men som ikke skal være det etter oppdateringeen
    this.mapElement.current.display(newLayers)
    this.mapElement.current.hide(layersToHide)
  }

  // Setter sammen navbaren og kartet
  render() {
    const { allLayers, visible} = this.state
    return (
      <div>
        <Navbar layers={allLayers} visible={visible} update={this.update} addLayer={this.addNew} reset={this.reset}/>
        <div className="map-container">
         <Map allLayers={allLayers} visible={visible} ref={this.mapElement} />
        </div>
     </div>
    )
  }
}

export default Site;
