import React from 'react'
import './menu.css'

//Tool-menu komponenten.
//Tar inn funksjoner som håndterer bruk av verktøyene, og kartlagene
function ToolMenu(props){
    return(
        <div>
          <AreaTool handleMeasurementSubmit={props.measurementSubmit} layers={props.layers}/>
          <BufferTool bufferToolSumbit={props.bufferToolSumbit} layers={props.layers}/>
          <UnionTool handleSubmit={props.handleSubmit}  layers={props.layers}/>
          <IntersectionTool handleSubmit={props.handleSubmit} layers={props.layers}/>
          <DifferenceTool handleSubmit={props.handleSubmit} layers={props.layers}/>
        </div>
    )
}
//BufferTool-komponenten
function BufferTool(props){
    return(
        <div className="tool">
            Buffer
            <form onSubmit={props.bufferToolSumbit}>
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

//AreaTool-komponenten
function AreaTool(props){
    return(
        <div className="tool">
            Areal av polygon
            <form onSubmit={props.handleMeasurementSubmit} className="area-form">
                <select className="measurement-select">
                    {props.layers.filter(layer => layer.source.data.geometry.type === "Polygon" || layer.source.data.geometry.type === "MultiPolygon").map(layer => <option key={layer.id} > {layer.id}</option>)}
                </select>
                <input type="submit" value="→"/>
            </form>
        </div>
    )
}

//UnionTool-komponenten
function UnionTool(props){
    return(
        <div className="tool">
            Union
            <form onSubmit ={props.handleSubmit} className="union-form">
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

//IntersectionTool-komponenten
function IntersectionTool(props){
    return(
        <div className="tool">
            Snitt
            <form onSubmit ={props.handleSubmit} className="intersection-form">
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

//DifferenceTool-komponenten
function DifferenceTool(props){
    return(
        <div className="tool">
            Differanse
            <form onSubmit ={props.handleSubmit} className="difference-form">
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

export default ToolMenu
