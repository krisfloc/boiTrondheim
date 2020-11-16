import React, { Component } from 'react'
import { bufferTool, unionTool, intersectionTool, differenceTool, lineLengthTool, areaTool } from '../../mapTools/tools.js'
import './menu.css'
import ToolMenu from './ToolMenu.jsx'
import check from '../../icons/check.png'
import uncheck from '../../icons/uncheck.png'
import title from '../../icons/title.png'

//LayerDiv-komponent, er komponenten som utgjør et lag i Lag-menyen
function LayerDiv(props){
  const { name, active} = props
  if (active){
    return <div className="active-layer layer">  {name} <img src={check} className="icon"/> </div>
  }
  else{
    return (
      <div className="disabled-layer layer">  {name} <img src={uncheck} className="icon"/> </div>
    )
  }
}

//MapMenu-komponenten
class MapMenu extends Component{
  constructor(props){
    super(props)
    this.handleBufferSubmit = this.handleBufferSubmit.bind(this)
    this.handleOtherSubmit = this.handleOtherSubmit.bind(this)
    this.handleMeasurementSubmit = this.handleMeasurementSubmit.bind(this)
    this.oppgaveOnClick = this.oppgaveOnClick.bind(this)
    this.submitAnswer = this.submitAnswer.bind(this)

    this.state = {
      oppgaver: ["Universet", "Sex"],
      oppgNr: 0,
      svar: ["42", "69"]
    };
  }


  //Tar inn to lister med kartlag, layers og visibleLayers, og returnerer en liste JSX-elementer som representerer lagene i layers
  renderLayerList = (layers, visibleLayers) => {
    return layers.map(layer => {
      const active = visibleLayers.includes(layer)
      const layerTag = layer.id
      return(
        <div onClick={(e) => this.handleLayerOnClick(layer.id, e)} key={layer.id}>
          <LayerDiv active={active} name={layerTag} />
        </div>
      )
    })
  }


  //håndterer klikk på et LayerDiv-element i Lag-lista.
  //Tar inn id-en til det klikkede elementet og kaller RootWrapper sin funksjon layersChanged med den oppdaterte lista med synlige lag
  handleLayerOnClick = (id, event) => {
    event.preventDefault()
    const {layers, visibleLayers} = this.props
    let updatedLayers = []
    const clickedLayer = layers.find( layer => layer.id === id)
    if(visibleLayers.includes(clickedLayer)){
      updatedLayers = visibleLayers.filter(l =>  l.id !== id)
    }
    else{
      updatedLayers = [...visibleLayers, clickedLayer]
    }

    //Kaller funksjonen layersChanged som er gitt inn som prop
    this.props.layersChanged(updatedLayers)

  }

  //Kjøres når buffer-verktøyet brukes. Kaller bufferTool-funksjonen, og så sender det nye laget til addLayer-funksjonen som er gitt inn som prop
  handleBufferSubmit(event){
    event.preventDefault()
    const layerID = event.target.getElementsByClassName("bufferSelect")[0].value
    const bufferDist = event.target.getElementsByClassName("bufferDist")[0].value
    const layer = this.props.layers.find(layer => layer.id === layerID)
    const bufferedLayer = bufferTool(layer.source.data, bufferDist, layerID)
    this.props.addLayer(bufferedLayer)
    event.target.getElementsByClassName("bufferDist")[0].value = ""
  }

  //Kjøres når uniton, difference eller intersection-verktøyet brukes. Kaller den tilhørende tool-funksjonen, og så sender det nye laget til addLayer-funksjonen som er gitt inn som prop
  handleOtherSubmit(event){
    event.preventDefault()
    const toolType = event.target.className
    const layerOneID = event.target.getElementsByClassName("select-one")[0].value
    const layerTwoID = event.target.getElementsByClassName("select-two")[0].value
    const layerOne = this.props.layers.find(layer => layer.id === layerOneID)
    const layerTwo = this.props.layers.find(layer => layer.id === layerTwoID)
    let newLayer;
    switch (toolType){
      case 'intersection-form':
        newLayer = intersectionTool(layerOne.source.data, layerTwo.source.data, layerOneID +"-" + layerTwoID)
        break
      case 'difference-form':
        newLayer = differenceTool(layerOne.source.data, layerTwo.source.data, layerOneID +"-" + layerTwoID)
        break
      case 'union-form':
        newLayer = unionTool(layerOne.source.data, layerTwo.source.data, layerOneID +"-" + layerTwoID)
        break
      default:
        console.log("ToolType not recognized")
      }
    if (newLayer) this.props.addLayer(newLayer)
  }

  //Kjøres når linjelengde- eller areal-verktøyet brukes. Kaller tilhørende måle-funskjon, og så displayer resultatet til brukren
  handleMeasurementSubmit(event){
    event.preventDefault()
    const toolType = event.target.className
    const layerID = event.target.getElementsByClassName("measurement-select")[0].value
    const layer = this.props.layers.find(layer => layer.id === layerID)
    switch (toolType){
      case 'line-lenght-form':
        lineLengthTool(layer.source.data, layerID)
        break
      case 'area-form':
        areaTool(layer.source.data, layerID)
        break
      default:
        console.log("ToolType not recognized")
    }
  }

  oppgaveOnClick() {
    if (this.state.oppgNr < 2) {
      alert(this.state.oppgaver[this.state.oppgNr])
    }
    else {
      alert("Du er ferdig!")
    }
  }

  submitAnswer(event) {
    event.preventDefault()
    const answer = event.target.getElementsByClassName("input")[0].value
    if (this.state.oppgNr < 2) {
      switch (answer) {
        case this.state.svar[this.state.oppgNr]:
          alert("det funka")
          event.target.getElementsByClassName("input")[0].value = ""
          this.state.oppgNr += 1
          break
        default:
          alert ("feil")
          event.target.getElementsByClassName("input")[0].value = ""
          break
      }
    }
    else {
      alert("Du er ferdig!")
      event.target.getElementsByClassName("input")[0].value = ""
    }
  }

  render() {
    const {layers, visibleLayers} = this.props

    return (
      <ul>
        <div>
          <img src={title} class="title"/>
        </div>
        <li class="refresh">
          <a href="/">Last inn på nytt</a>
        </li>
        <li class="dropdown">
          <a href="javascript:void(0)" class="dropbtn">Kartlag</a>
          <div class="dropdown-content">
            {this.renderLayerList(layers, visibleLayers)}
          </div>
        </li>
        <li class="dropdown">
          <a href="javascript:void(0)" class="dropbtn">Verktøy</a>
          <div class="dropdown-content">
            <ToolMenu
              bufferToolSumbit={this.handleBufferSubmit}
              handleSubmit={this.handleOtherSubmit}
              measurementSubmit={this.handleMeasurementSubmit}
              layers={layers}
            />
          </div>
        </li>
        <li>
          <a onClick={this.oppgaveOnClick}>Oppgave</a>
        </li>
        <form onSubmit={this.submitAnswer}>
          <input type="text" className="input" placeholder="Svar..."/>
          <input type="submit" className="submit"/>
        </form>
      </ul>

    )
  }
}

export default MapMenu
