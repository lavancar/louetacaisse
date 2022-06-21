import app from "./firebase";
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, getDoc, addDoc, updateDoc, where, query } from "firebase/firestore";
import { useEffect, useState } from 'react';
import {Container, Col, Row, Button} from "reactstrap";
import {Route, Routes, Link, useParams} from "react-router-dom"
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);

function AddCar(){

    return (<div id="div_CreationVoiture" >
    <table border="1">
      <tr colspan="2">Ajout d'une voiture dans le catalogue</tr>
      <br/>
      <tr
      >
        <td>Modèle de la voiture</td>
        <td><input type="text" id="ModelVoiture"></input></td>
      </tr>
      <tr>
        <td>Type d'essence</td>
        <td><input type="text" id="EssenceVoiture"></input></td>
      </tr>
      <tr>
        <td>Marque de la voiture</td>
        <td><input type="text" id="MarqueVoiture"></input></td>
      </tr>
      <tr>
        <td>Plaque d'immatriculation</td>
        <td><input type="text" id="Immatriculation"></input></td>
      </tr>
      <tr>
        <td> Prix de vente (€)</td>
        <td><input type="number" id="PrixVente"></input></td>
      </tr>
      <tr>
        <td> Puissance </td>
        <td><input type="text" id="Puissance"></input></td>
      </tr>
  
      <button onClick={PutCar}> Enregistrer voiture</button>
  
    </table>
  
    </div>
    )
  }

  //Fct pour ajouter des voitures
async function PutCar(){

    // const [Adress, setAdress] = useState("")
  
    var Model_voiture = document.getElementById('ModelVoiture').value;
    var EssenceVoiture = document.getElementById('EssenceVoiture').value;
    var MarqueVoiture = document.getElementById('MarqueVoiture').value;
    var Immatriculation = document.getElementById('Immatriculation').value;
    var PrixVente = document.getElementById('PrixVente').value;
    var Puissance = document.getElementById('Puissance').value;
    //addDoc => remplir la base

    if(Model_voiture =="" || MarqueVoiture =="" || Immatriculation =="" || PrixVente =="" || Puissance ==""){
        alert("Missing information")
    } 
    else {
    const PUSH = await addDoc(collection(db,'Cars'), {
      Brand: MarqueVoiture,
      Model: Model_voiture,
      PlateNumber: Immatriculation,
      Fuel: EssenceVoiture,
      Price: PrixVente,
      HP: Puissance,
      Available: true,
    });
    //Je retire les données écrites dans les inputs
    document.getElementById('ModelVoiture').value = "";
    document.getElementById('EssenceVoiture').value = "";
    document.getElementById('MarqueVoiture').value = "";
    document.getElementById('Immatriculation').value = "";
    document.getElementById('PrixVente').value = "";
    document.getElementById('Puissance').value = "";
  
    alert("The car is correctly created !");
    window.location.href = "/Voitures"
    }
}

  export default AddCar