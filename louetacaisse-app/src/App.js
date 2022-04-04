import app from "./firebase";
import "./App.css";
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
import {Container, Col, Row, Button, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import {Route, Routes, Link} from "react-router-dom"
import { collection, doc, Firestore, getDocs, getFirestore } from "firebase/firestore";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);

function Home(){
  return <div>Home</div>
}



function Cars(){
  const [cars, setCars] = useState([])
  useEffect(() => {
    async function getCars(){
      const querySnapshot = await getDocs(collection(db, "Cars"));
      querySnapshot.forEach((car) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(car.id, " => ", car.data());
      });
      setCars(querySnapshot.docs.map(car => car.data()))
    }
    getCars()
  }, [])

  return <table id="carsTable">
    <thead>
        <td>Brand</td>
        <td>Model</td>
        <td>Plate</td>
        <td>Fuel</td>
        <td>Price</td>
        <td>Power</td>
        <td></td>
    </thead>
    <tbody>
      {cars.map((car) => {
        console.log(car);
        return (
          <tr>
            <td>
              <li>{car.Brand}</li>
            </td>
            <td>
              <li>{car.Model}</li>
            </td>
            <td>
              <li>{car.PlateNumber}</li>
            </td>
            <td>
              <li>{car.Fuel}</li>
            </td>
            <td>
              <li>{car.Price}</li>
            </td>
            <td>
              <li>{car.HP}</li>
            </td>
            <td>
              <li><Button>UPDATE</Button></li>
            </td>
          </tr>
        )
        
      }) }
      
    </tbody>
  </table>
}

function CreationVoiture(){
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
      <td><input type="text" id="NomVoiture"></input></td>
    </tr>
    <tr>
      <td>Plaque d'immatriculation</td>
      <td><input type="text" id="Immatriculation"></input></td>
    </tr>
    <tr>
      <td> Prix de vente (€)</td>
      <td><input type="text" id="PrixVente"></input></td>
    </tr>

    <button onClick={database}> Enregistrer voiture</button>

  </table>


  </div>
  )
}
function database(){
  
  var Model_voiture = document.getElementById('ModelVoiture').value;
  var EssenceVoiture = document.getElementById('EssenceVoiture').value;
  var NomVoiture = document.getElementById('NomVoiture').value;
  var Immatriculation = document.getElementById('Immatriculation').value;
  var PrixVente = document.getElementById('PrixVente').value;
  
  console.log('BTN clicked');
  console.log('Model_voiture = ' + Model_voiture);
  console.log('EssenceVoiture = ' + EssenceVoiture);
  console.log('NomVoiture = ' + NomVoiture);
  console.log('Immatriculation = ' + Immatriculation);
  console.log('PrixVente = ' + PrixVente);



}

function Liste_voiture(){
  //Je fais mes requêtes pour avoir une liste de mes voitures

  const [cars, setCars] = useState([])
  useEffect(() => {
    async function getCars(){
      const querySnapshot = await getDocs(collection(db, "Cars"));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());

      });
      setCars(querySnapshot.docs.map(doc => doc.data()))
    }
    getCars()
  }, [])

  
  return(
  <div>
    <table>
      <tr>
        <td>Modèle de la voiture</td>
        <td>Kilométrage</td>
        <td>Modèle</td>
      </tr>
      <tr>
        <li>key={doc.Model}</li>
      </tr>
    </table>
  </div>
 );

} 




function App() {
const [user, setUser] = useState(null)

/******************************** api get firebase ==> plusieurs useEffect possible ? ******************************************/ 

console.log("Test", user)
useEffect(() => onAuthStateChanged(auth, (newUser) => {
  console.log("auth",newUser)
  if (newUser){
    console.log(newUser.uid, newUser.email)
    setUser({uid: newUser.uid, email: newUser.email})
  } else {
    setUser(null)
  }
  }), [])


  return (
      <Container>
        <Navbar color="light" expand="md" light>
        <NavbarBrand href="/">
          <img width={"30%"} src="loutacaisse.png" />
        </NavbarBrand>
        <NavbarToggler onClick={function noRefCheck() { }}/>
        <Collapse navbar>
          <Nav className="me-auto" navbar >
            <NavItem>
              <NavLink to="/" tag={Link}>
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/Voitures" tag={Link}>
              Voitures
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to={`/Profil/${user?.uid}`} tag={Link}>
              Profil
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/Settings" tag={Link}>
              <img
          width={"20%"}
          src="gear.png" 
          />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/CreationVoiture" tag={Link}>
              Ajouter une voiture
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/Liste_voiture" tag={Link}>
              Liste des voitures 
              </NavLink>
            </NavItem>
          </Nav>
          <Button onClick={user ? () => signOut(auth) : () => signInWithRedirect(auth, provider)}>{user ? user.email : "Login"}</Button>
        </Collapse>
        </Navbar>
        <Row>
          <Col>
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="products" element={<Products />}/>
              <Route path="CreationVoiture" element={<CreationVoiture />}/>
              <Route path="Liste_voiture" element={<Liste_voiture />}/>
            </Routes>
          </Col>
        </Row>
      </Container>
  );
}



export default App;
export default App;
