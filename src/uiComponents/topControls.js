import React, { useState, useEffect } from 'react'
import { Animate } from "react-simple-animate";

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import 'leaflet-area-select';
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

import axios from 'axios';


export default function TopControls({onSave, onCancel, visible, placeholder, height}) {

    const [input, setInput] = useState("")
    const [map, setMap] = useState(true);
    const [bounds, setBounds] = useState({});

    const fetchData = () => {
        const data = `
        // @name home
        [out:json];
        (
           way['highway']
           ['highway'!~'pedestrian']
           ['highway'!~'footway']
           ['highway'!~'cycleway']
           ['highway'!~'path']
           ['highway'!~'service']
           ['highway'!~'corridor']
           ['highway'!~'track']
           ['highway'!~'steps']
           ['highway'!~'raceway']
           ['highway'!~'bridleway']
           ['highway'!~'proposed']
           ['highway'!~'construction']
           ['highway'!~'elevator']
           ['highway'!~'bus_guideway']
           ['access'!~'private']
           ['access'!~'no']
           (${bounds.SW.lat},${bounds.SW.lng},${bounds.NE.lat},${bounds.NE.lng});


        );
        out body;
        >;
        out skel;`.toString();
        
        console.log('data', data)
        axios.post('https://overpass-api.de/api/interpreter', 
            'data=' + encodeURIComponent(data), 
            { 
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
        .then(response => {
            // console.log(response.data);
            setMap(false);
            setInput(JSON.stringify(response.data));
        })
        .catch(error => {
            console.error('Error:', error);
            onCancel();
        });
    }

  return (   
    <Animate
        id={'i'}
        play={visible}
        start={{...topControls, top: "-560px" }}
        end={topControls}>

        {map && height == 10 && <div onClick={onCancel} style={{
            position: "relative",
            right: "35px",
            width: "30px",
            float: "right",
            marginLeft: "100%",
            fontSize: "x-large",
            fontWeight: "900",
            color: "white",
            cursor: "pointer"
        }}>
            X
        </div>}

        {
            map && height == 10 ?
            <div>
                <MapContainer center={[53.47064036824388, -2.2375926375389104]} zoom={16} style={{height: '456px', width: '700px', margin: '10px'}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                        <AreaSelect setBounds={setBounds}/>
                </MapContainer>   
                <div className={"saveCancelDiv"}>
                    {
                        bounds.dist < 2000 ?
                        <button onClick={() => fetchData()} className={"inputButton blue"}> Load </button> :
                        <label style={{ color: 'red', fontSize: 'x-large', fontWeight: '900'}}> Select an area between 0 and 100 kilometers squared</label>
                    }
                </div>                  
            </div>
            :
            <div>
                <textarea 
                    rows={height} 
                    cols={30} 
                    placeholder={placeholder} 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={"textInput"} />         
                <div className={"saveCancelDiv"}>
                    <button onClick={() => {setMap(true); onCancel()}} className={"inputButton red"}> Cancel </button>
                    <button onClick={() => {setMap(true); onSave(input)}} className={"inputButton blue"}> Save </button>
                </div>          
            </div>
        }
    </Animate>
  )
}

  
function AreaSelect({setBounds}) {
    const map = useMap();
    const [rectangle, setRectangle] = useState({});

    // map.whenReady(() => { map.locate() })
    map.on('locationfound', (e) => { map.flyTo(e.latlng, 16) })
  
    useEffect(() => {
        const editableLayers = new L.FeatureGroup();
        map.addLayer(editableLayers);

        const options = {
            position: "topleft",
            draw: {
                polyline: false,
                polygon: false,
                rectangle: { metric: true },
                marker: false,
                circlemarker: false,
                circle: false,
                edit: false
            }
        };

        const drawControl = new L.Control.Draw(options);
        map.addControl(drawControl);
        map.on(L.Draw.Event.DRAWSTART, (_) => { editableLayers.clearLayers(); });
        map.on(L.Draw.Event.DRAWSTOP, (_) => { console.log('circle', rectangle) });

        map.on(L.Draw.Event.CREATED, (e) => {
            const layer = e.layer;
            editableLayers.addLayer(layer);

            console.log('pp', { 
                NE: layer.getBounds().getNorthEast(), 
                SW: layer.getBounds().getSouthWest(), 
                dist: layer.getBounds().getNorthEast().distanceTo(layer.getBounds().getSouthWest())
            })
            setBounds({ 
                NE: layer.getBounds().getNorthEast(), 
                SW: layer.getBounds().getSouthWest(), 
                dist: layer.getBounds().getNorthEast().distanceTo(layer.getBounds().getSouthWest())
            })
            setRectangle({ 
                NE: layer.getBounds().getNorthEast(), 
                SW: layer.getBounds().getSouthWest(), 
                dist: layer.getBounds().getNorthEast().distanceTo(layer.getBounds().getSouthWest())
            });
        });

    }, []);
  
    return null;
  }

const topControls = {
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    top: "130px",
    backgroundColor: "rgba(87, 85, 63, 0.3)",
    backdropFilter: "blur(10px)",
    borderRadius: "10px",
    padding: "20px 30px"
}

const tab = {
    width: '100px',
    height: '100px',
    backgroundColor: 'red',
    bottom: 'anchor(top)'
}