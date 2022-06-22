import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, getDoc, addDoc, updateDoc, where, query } from "firebase/firestore";
import { querystring } from '@firebase/util';
import { QuerySnapshot } from 'firebase/firestore';
import { getMultiFactorResolver } from 'firebase/auth';
import firebase from "firebase/compat/app";
import app from "./firebase";

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2FzYWxob3YiLCJhIjoiY2t3cTJrODdsMGljcjJvcW85NG92ZGFmOSJ9.sEh4Jqk6ayavIzxJWXH8uQ';


function Map(){
    // const db = firebase.firestore();
    const db = getFirestore(app);
    const mapContainer = useRef(null);
    let  map = useRef(null);
    const [lng, setLng] = useState(6.12249493660376);
    const [lat, setLat] = useState(45.90938374062595);
    const [zoom, setZoom] = useState(12);
    const getCars = [];
    const [car, setCars] = useState([]);
    const [carsCoord, setCarsCoord] = useState([]);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
    },[]);
    // useEffect(()=>{
    //     // const q = query(collection(db, "Cars"));
    //     db.collection("Cars")
    //     // q
    //     .get()
    //     .then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //             getCars.push(doc.data());
    //         });
    //         setCars(getCars)
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     });

    //     const getCoords = async () => {
    //         let carCoord = []
    //         getCars.map((element,index)=>{
    //             carCoord.push({
    //                 lat : element.lat,
    //                 lng :element.lng,
    //             })
    //         })
    //         setCarsCoord(carCoord)
    //     }
    //     getCoords()

    //     carsCoord.map(element =>{
    //             var otherMarker = new mapboxgl.Marker({ "color": "#008000" })
    //             .setLngLat([element.lng,element.lat])
    //             .setPopup(new mapboxgl.Popup().setHTML("c une voiture"))
    //             .addTo(map.current);
    //     })
    // }, [carsCoord])

    return (
        <div>
        <div ref={mapContainer} style={{height : '400px'}}/>
        </div>
        );
    
}

export default Map