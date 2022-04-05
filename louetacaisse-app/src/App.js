import app from "./firebase";
import "./App.css";
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
import {Container, Col, Row, Button, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import {Route, Routes, Link, useParams} from "react-router-dom"
import { addDoc, collection, doc, Firestore, getDocs, getFirestore, setDoc} from "firebase/firestore";


const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);

function Home(){
  return <div>Home</div>
}
function Products(){
  return <div>Products</div>
}

//Génère la page pour ajouter des voitures
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

    <button onClick={database}> Enregistrer voiture</button>

  </table>


  </div>
  )
}
//Fct pour ajouter des voitures 
async function database(){
  
  var Model_voiture = document.getElementById('ModelVoiture').value;
  var EssenceVoiture = document.getElementById('EssenceVoiture').value;
  var MarqueVoiture = document.getElementById('MarqueVoiture').value;
  var Immatriculation = document.getElementById('Immatriculation').value;
  var PrixVente = document.getElementById('PrixVente').value;
  var Puissance = document.getElementById('Puissance').value;
  //addDoc => remplir la base
  const PUSH = await addDoc(collection(db,'Cars'), {
    Brand: MarqueVoiture,
    Model: Model_voiture,
    PlateNumber: Immatriculation,
    Fuel: EssenceVoiture,
    Price: PrixVente,
    HP: Puissance,
  });
  //Je retire les données écrites dans les inputs
  document.getElementById('ModelVoiture').value = "";
  document.getElementById('EssenceVoiture').value = "";
  document.getElementById('MarqueVoiture').value = "";
  document.getElementById('Immatriculation').value = "";
  document.getElementById('PrixVente').value = "";
  document.getElementById('Puissance').value = "";

}

function Liste_voiture(){
  //Je fais mes requêtes pour avoir une liste de mes voitures
  const [cars, setCars] = useState([])
  useEffect(() => {
    async function getCars(){
      const querySnapshot = await getDocs(collection(db, "Cars"));
      querySnapshot.forEach((car) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(car.id, " => ", car.data());
      });
      setCars(querySnapshot.docs.map(car => {
        return {
          id: car.id, //Place un id : dans mon tableau
          ...car.data()//... => clone | car.data() => toutes les données que j'ai récupéré  
        }
      }))
    }
    getCars()
  }, [])


 async function EditVoiture(carsID){
      console.log(carsID);
      const docRef = doc(db, "Cars", carsID);
      const docSnap = await getDocs(docRef);
      const tempoVAR = docSnap.data();
      
      return(
        <table border="1">
        <tr colspan="2">Ajout d'une voiture dans le catalogue</tr>
        <br/>
        <tr>
          <td>Modèle de la voiture</td>
          <td><input type="text" id="ModelVoiture" value={tempoVAR.Brand}></input></td>
        </tr>
        <tr>
          <td>Type d'essence</td>
          <td><input type="text" id="EssenceVoiture" value={tempoVAR.Model}></input></td>
        </tr>
        <tr>
          <td>Marque de la voiture</td>
          <td><input type="text" id="MarqueVoiture" value={tempoVAR.Brand}></input></td>
        </tr>
        <tr>
          <td>Plaque d'immatriculation</td>
          <td><input type="text" id="Immatriculation" value={tempoVAR.Brand}></input></td>
        </tr>
        <tr>
          <td> Prix de vente (€)</td>
          <td><input type="number" id="PrixVente" value={tempoVAR.Brand}></input></td>
        </tr>
        <tr>
          <td> Puissance </td>
          <td><input type="text" id="Puissance" value={tempoVAR.Brand}></input></td>
        </tr>
    
        <button onClick={database}> Enregistrer voiture</button>
    
        </table>
      );
     
   
  }


  return (<table id="carsTable">
    <thead>
        <td>Brand</td>
        <td>Model</td>
        <td>Plate</td>
        <td>Fuel</td>
        <td>Price</td>
        <td>Power</td>
        <td>Edition</td>
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
              <button onClick={() => EditVoiture(car.id)}>Edit</button>
            </td>

          </tr>
        )
        
      }) }
      
      
    </tbody>
  </table>
  );

}





function Profil(props){
  
  const uid = useParams().uid ?? props.user.uid
  const [name, setName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [Adress, setAdress] = useState("")
  const [Phone, setPhone] = useState("")
  const [Licence, setLicence] = useState("")


  const [Users, setCars] = useState([])
  useEffect(() => {
    async function getCars(){
      const querySnapshot = await getDocs(collection(db, "Users"));
      querySnapshot.forEach((user) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(user.id, " => ", user.data());
      });
      setCars(querySnapshot.docs.map(user => user.data()))
    }
    getCars()
  }, [])

    // {cars.map((car) => {
    //  console.log(car);



  async function addUser(user){

    const querySnapshot = await setDoc(doc(db, "Users", uid), {
      Name: name,
      Firstname: firstName,
      Birthdate: birthDate,
      Adress: Adress,
      Phonenumber: Phone,
      Licencenumber: Licence
    });
      
  }

  return (
    <table id="tableSetting">
      <tr>
        <td>UID :</td>
        <td><input type="text" id="name" value={uid} /></td>
      </tr>
      <tr>
        <td>Name :</td>
        <td><input type="text" id="name" value={name} onChange={e=> setName(e.target.value)} /></td>
      </tr>
      <tr>
        <td>First name :</td>
        <td><input type="text" id="firstname" value={firstName} onChange={e=> setFirstName(e.target.value)}/></td>
      </tr>
      <tr>
        <td>Birth date :</td>
        <td><input type="date" id="birthdate" value={birthDate} onChange={e=> setBirthDate(e.target.value)}/></td>
      </tr>
      <tr>
        <td>Adress :</td>
        <td><input type="text" id="adress" value={Adress} onChange={e=> setAdress(e.target.value)}/></td>
      </tr>
      <tr>
        <td>Phone number :</td>
        <td><input type="number" id="phonenumber" value={Phone} onChange={e=> setPhone(e.target.value)}/></td>
      </tr>
      <tr>
        <td>Licence number :</td>
        <td><input type="number" id="licencenumber" value={Licence} onChange={e=> setLicence(e.target.value)}/></td>
      </tr>
      <Button onClick={addUser}>Valider</Button>      
    </table>
  )
}




function App() {
const [user, setUser] = useState(null)

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
              <NavLink to="/Products" tag={Link}>
                Products
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
            <NavItem>
              <NavLink to="/Profil" tag={Link}>
              Profil
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

              <Route path="Profil" element={<Profil user={user} />}>
                <Route path=":uid" element={<Profil/>}/>
              </Route>

            </Routes>
          </Col>
        </Row>
      </Container>
  );
}


export default App;