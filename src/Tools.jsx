import React from 'react'
import './App.css'

// Listen med verktøy-komponenter som brukes i navbaren
function Tools(props){
    return(
        <div>
          <AreaTool areaSubmit={props.areaSubmit} layers={props.layers}/>
          <BufferTool bufferSubmit={props.bufferSubmit} layers={props.layers}/>
          <UnionTool createSubmit={props.createSubmit}  layers={props.layers}/>
          <IntersectionTool createSubmit={props.createSubmit} layers={props.layers}/>
          <DifferenceTool createSubmit={props.createSubmit} layers={props.layers}/>
        </div>
    )
}

// Oppsettet til buffer-verktøyet
function BufferTool(props){
    return(
        <div className="tool">
            Buffer
            <form onSubmit={props.bufferSubmit}>
                <select className="bufferSelect">
                    {props.layers.map(layer => <option key={layer.id} > {layer.id}</option>)}
                </select> <br/>
                Bufferdistanse:
                <input type="number" className="bufferDist"/>
                meter
                <input type="submit" value="→"/>
            </form>
        </div>
    )
}

// Oppsettet til areal-verktøyet
function AreaTool(props){
    return(
        <div className="tool">
            Areal av polygon
            <form onSubmit={props.areaSubmit} className="area-form">
                <select className="measurement-select">
                    {props.layers.filter(layer => layer.source.data.geometry.type === "Polygon" || layer.source.data.geometry.type === "MultiPolygon").map(layer => <option key={layer.id} > {layer.id}</option>)}
                </select>
                <input type="submit" value="→"/>
            </form>
        </div>
    )
}

// Oppsettet til union-verktøyet
function UnionTool(props){
    return(
        <div className="tool">
            Union
            <form onSubmit ={props.createSubmit} className="union-form">
                <select className="select-one">
                    {props.layers.filter(layer => layer.source.data.geometry.type === "Polygon" || layer.source.data.geometry.type === "MultiPolygon" ).map(layer => <option key={layer.id} > {layer.id}</option>)}
                </select> <br/>
                <select className="select-two">
                    {props.layers.filter(layer => layer.source.data.geometry.type === "Polygon"|| layer.source.data.geometry.type === "MultiPolygon").map(layer => <option key={layer.id} > {layer.id}</option>)}
                </select>
                <input type="submit" value="→"/>
            </form>
        </div>
    )
}

// Oppsettet til snitt-verktøyet
function IntersectionTool(props){
    return(
        <div className="tool">
            Snitt
            <form onSubmit ={props.createSubmit} className="intersection-form">
                <select className="select-one">
                    {props.layers.filter(layer => layer.source.data.geometry.type === "Polygon" || layer.source.data.geometry.type === "MultiPolygon").map(layer => <option key={layer.id} > {layer.id}</option>)}
                </select><br/>
                <select className="select-two">
                    {props.layers.filter(layer => layer.source.data.geometry.type === "Polygon" || layer.source.data.geometry.type === "MultiPolygon").map(layer => <option key={layer.id} > {layer.id}</option>)}
                </select>
                <input type="submit" value="→"/>
            </form>
        </div>
    )
}

// Oppsettet til differanse-verktøyet
function DifferenceTool(props){
    return(
        <div className="tool">
            Differanse
            <form onSubmit ={props.createSubmit} className="difference-form">
                <select className="select-one">
                    {props.layers.filter(layer => layer.source.data.geometry.type === "Polygon" || layer.source.data.geometry.type === "MultiPolygon").map(layer => <option key={layer.id} > {layer.id}</option>)}
                </select>
                <select className="select-two">
                    {props.layers.filter(layer => layer.source.data.geometry.type === "Polygon" || layer.source.data.geometry.type === "MultiPolygon").map(layer => <option key={layer.id} > {layer.id}</option>)}
                </select>
                <input type="submit" value="→"/>
            </form>
        </div>
    )
}

export default Tools