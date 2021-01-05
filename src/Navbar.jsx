import React, { Component } from 'react'
import './App.css'
import { buffer, union, intersect, difference, area } from './turf.js'
import Tools from './Tools.jsx'
import Layer from './Layers.jsx'
import title from './pictures/title.png'

//Navbar-komponenten og tilhørende funksjonalitet
class Navbar extends Component{
  constructor(props){
    super(props)
    // definerer funksjonene som kan brukes utenfor komponenten
    this.bufferSubmit = this.bufferSubmit.bind(this)
    this.createSubmit = this.createSubmit.bind(this)
    this.areaSubmit = this.areaSubmit.bind(this)
    this.oppgaveOnClick = this.oppgaveOnClick.bind(this)
    this.answerSubmit = this.answerSubmit.bind(this)
    this.undisplayer = this.undisplayer.bind(this)
    // definerer oppgavene og svarene
    this.state = {
      oppgaver: [
        "Du skal finne et potensielt bosted i Trondheim sentrum, så først vil vi vite hvor stor Midtbyen er.",
        "Det er markert de forskjellige busstoppene som ligger i Midtbyen. Hvor stort er området som ligger innenfor 50 meter fra et stopp?",
        "Områdene som tilhører Kalvskinnet og Trondheim Torg kan man ikke bo på. Hvor store er disse områdene til sammen?",
        "Å bo i nærheten av en matbutikk er kjekt. Hvor stort er området som er maks 175 meter fra en butikk og fortsatt innenfor Midtbyen og ikke i Trondheimsfjorden?",
        "Hovedveien gjennom sentrum kan bråke litt, men å være nære bussen er fortsatt nyttig. Hvor stort er området som er innen 150 meter fra et busstopp, men også minst 80 meter fra veien?",
        "Du har nå bestemt deg for et sett med betingelser for der du skal bo i Midtbyen. Betingelsene er at det må være innenfor 200 meter fra en matbutikk og 250 meter fra et busstopp, men ikke nærmere enn 50 meter fra veien og kan ikke være på Kalvskinnet eller torget."
      ],
      oppgNr: 0,
      svar: ["846289", "33798", "68978", "402171", "138122", "241588"]
    };
  }

  // Lager listen med kartlag
  createList = (layers, visible) => {
    return layers.map(layer => {
      const active = visible.includes(layer)
      const layerTag = layer.id
      return(
        <div onClick={(e) => this.layerOnClick(layer.id, e)} key={layer.id}>
          <Layer active={active} name={layerTag} />
        </div>
      )
    })
  }

  // Behandler kartlag som blir trykket på i listen, setter synligheten til det motsatte
  layerOnClick = (id, event) => {
    event.preventDefault()
    const {layers, visible} = this.props
    let updatedLayers = []
    const clickedLayer = layers.find( layer => layer.id === id)
    if(visible.includes(clickedLayer)){
      updatedLayers = visible.filter(l => l.id !== id)
    }
    else{
      updatedLayers = [...visible, clickedLayer]
    }
    this.props.update(updatedLayers)

  }

  // Kjører buffer-verktøyet og legger til det nye laget i kartet når verktøyet blir brukt
  bufferSubmit(event){
    event.preventDefault()
    const layerId = event.target.getElementsByClassName("bufferSelect")[0].value
    const bufferDist = event.target.getElementsByClassName("bufferDist")[0].value
    if (bufferDist == 0 || bufferDist == "") {
      document.getElementById("header").innerHTML = "Buffer"
      document.getElementById("body").innerHTML = "Må ha en bufferdistanse"
      document.getElementById("footer").innerHTML = ""
      this.displayer()
      event.target.getElementsByClassName("bufferDist")[0].value = ""
    }
    else {
      const layer = this.props.layers.find(layer => layer.id === layerId)
      const bufferedLayer = buffer(layer.source.data, bufferDist, layerId)
      this.props.addLayer(bufferedLayer)
      event.target.getElementsByClassName("bufferDist")[0].value = ""
    }
  }

  // Kjører snitt-, differanse- eller union-verktøyet og legger til det nye laget i kartet når verktøyet blir brukt
  createSubmit(event){
    event.preventDefault()
    const tool = event.target.className
    const layer1Id = event.target.getElementsByClassName("select-one")[0].value
    const layer2Id = event.target.getElementsByClassName("select-two")[0].value
    const layer1 = this.props.layers.find(layer => layer.id === layer1Id)
    const layer2 = this.props.layers.find(layer => layer.id === layer2Id)
    let newLayer;
    switch (tool){
      case 'intersection-form':
        newLayer = intersect(layer1.source.data, layer2.source.data, layer1Id +"-" + layer2Id)
        break
      case 'difference-form':
        newLayer = difference(layer1.source.data, layer2.source.data, layer1Id +"-" + layer2Id)
        break
      case 'union-form':
        newLayer = union(layer1.source.data, layer2.source.data, layer1Id +"-" + layer2Id)
        break
      default:
        document.getElementById("header").innerHTML = tool
        document.getElementById("body").innerHTML = "Error, dette var det noe rart med"
        document.getElementById("footer").innerHTML = ""
        this.displayer()
    }
    if (newLayer) this.props.addLayer(newLayer)
  }

  // Kjører areal-verktøyet og viser resultatet på skjermen i en pop-up
  areaSubmit(event){
    event.preventDefault()
    const tool = event.target.className
    const layerId = event.target.getElementsByClassName("measurement-select")[0].value
    const layer = this.props.layers.find(layer => layer.id === layerId)
    switch (tool){
      case 'area-form':
        area(layer.source.data, layerId)
        break
      default:
        document.getElementById("header").innerHTML = tool
        document.getElementById("body").innerHTML = "Error, dette var det noe rart med"
        document.getElementById("footer").innerHTML = ""
        this.displayer()
    }
  }

  // Viser den nåværende oppgaven til brukeren i en pop-up
  oppgaveOnClick() {
    if (this.state.oppgNr < this.state.oppgaver.length) {
      var nr = this.state.oppgNr + 1
      document.getElementById("header").innerHTML = "Oppgave " + nr
      document.getElementById("body").innerHTML = this.state.oppgaver[this.state.oppgNr]
      document.getElementById("footer").innerHTML = ""
      this.displayer()
    }
    else {
      document.getElementById("header").innerHTML = ""
      document.getElementById("body").innerHTML = "Du er ferdig!"
      document.getElementById("footer").innerHTML = ""
      this.displayer()
    }
  }

  // Sender inn svaret og sjekker mot fasit, resultatet vises på skjermen som en pop-up
  answerSubmit(event) {
    event.preventDefault()
    const answer = event.target.getElementsByClassName("input")[0].value
    if (this.state.oppgNr < this.state.oppgaver.length) {
      switch (answer) {
        case this.state.svar[this.state.oppgNr]:
          var nr = this.state.oppgNr + 1
          document.getElementById("header").innerHTML = "Oppgave " + nr
          document.getElementById("body").innerHTML = "Riktig!"
          document.getElementById("footer").innerHTML = ""
          this.displayer()
          event.target.getElementsByClassName("input")[0].value = ""
          this.props.reset()
          this.setState((state) => {
            return {oppgNr: state.oppgNr + 1}
            })
          break
        default:
          var nr = this.state.oppgNr + 1
          document.getElementById("header").innerHTML = "Oppgave " + nr
          document.getElementById("body").innerHTML = "Feil!"
          document.getElementById("footer").innerHTML= ""
          this.displayer()
          event.target.getElementsByClassName("input")[0].value = ""
          break
      }
    }
    else {
      document.getElementById("header").innerHTML = ""
      document.getElementById("body").innerHTML = "Du er ferdig!"
      document.getElementById("footer").innerHTML = ""
      this.displayer()
      event.target.getElementsByClassName("input")[0].value = ""
    }
  }

  // Brukes når noe skal vises i en pop-up til brukeren
  displayer() {
    document.getElementById("myModal").style.display = "block"
  }
  
  // Brukes når en pop-up lukkes
  undisplayer() {
    document.getElementById("myModal").style.display = "none"
  }

  render() {
    const {layers, visible} = this.props
    return (
      // Ytterste laget av navbaren
      <ul>
        {/* Logo/tittelen til prosjektet */}
        <div>
          <img src={title} class="title" alt=""/>
        </div>
        {/* Knapp for å laste inn lagene på nytt */}
        <li class="refresh">
          <a onClick={this.props.reset}>Tilbakestill kartlagene</a>
        </li>
        {/* Kartlaglisten */}
        <li class="dropdown">
          <a href="javascript:void(0)" class="dropbtn">Kartlag</a>
          <div class="dropdown-content">
            {this.createList(layers, visible)}
          </div>
        </li>
        {/* Verktøylisten */}
        <li class="dropdown">
          <a href="javascript:void(0)" class="dropbtn">Verktøy</a>
          <div class="dropdown-content">
            <Tools bufferSubmit={this.bufferSubmit} createSubmit={this.createSubmit} areaSubmit={this.areaSubmit} layers={layers}/>
          </div>
        </li>
        {/* Knappen for å vise oppgaven */}
        <li>
          <a onClick={this.oppgaveOnClick}>Oppgave</a>
        </li>
        {/* Felt og knapp for å sende inn svar */}
        <form onSubmit={this.answerSubmit}>
          <input type="text" className="input" placeholder="Svar..."/>
          <input type="submit" className="submit" value="Send inn"/>
        </form>
        {/* Pop-up-vinduet */}
        <div id="myModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <span class="close" onClick={this.undisplayer}>&times;</span>
              <h2 id="header">Bo i Trondheim</h2>
            </div>
            <div class="modal-body">
              <p id="body">Hei og velkommen til Bo i Trondheim, en introduksjon til geografiske informasjonssystemer, GIS.
              Gjennom disse oppgavene skal du bli kjent med grunnleggende verktøy i GIS.
              Hovre over "Karltag" og "Verktøy" for å se og bruke dem.
              Trykk på "Tilbakestill kartlagene" for å gå tilbake til den originale listen med kartlag.
              Trykk på "Oppgave" for å lese oppgavene, du får beskjed når du er ferdig.
              Svarene i alle oppgavene er arealet av kartlag, der kun tall er med i svaret.</p>
            </div>
            <div class="modal-footer">
              <h3 id="footer">Lykke til!</h3>
            </div>
          </div>
        </div>
      </ul>
    )
  }
}

export default Navbar
