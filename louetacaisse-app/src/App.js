import app from "./firebase";
import "./App.css";
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
import {Container, Col, Row, Button, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import {Route, Routes, Link, useParams} from "react-router-dom"
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, getDoc, addDoc } from "firebase/firestore";
import { getUA } from "@firebase/util";


const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);

let newName;

function Profil(props){
  console.log("props = " ,props)
  const [Profil, setProfils] = useState({})
  useEffect(async () => {
    async function getProfil(){
      if(! props.user) {
        return 
      }
      const docRef = doc(db, "Users", props.user.uid);
      const querySnapshot = await getDoc(docRef);
      console.log("query = ")
      console.log(querySnapshot.data())
      setProfils(querySnapshot.data())
    }
    
    newName = await checkInfos(Profil.Name)
    getProfil()
  }, [props.user])
  
  return <table id="userTable">
    <tbody>
      <tr>
        <td>UID : </td>
        <td>{props.user?.uid ?? ''}</td>
      </tr>
      <tr>
        <td>Name : </td>
        <td>{Profil.Name ?? ''}</td>
      </tr>
      <tr>
        <td>First Name : </td>
        <td>{Profil.Firstname ?? ''}</td>
      </tr>
      <tr>
        <td>Phone Number : </td>
        <td>{Profil.Phonenumber ?? ''}</td>
      </tr>
      <tr>
        <td>Email : </td>
        <td>{props.user?.email ?? ''}</td>
      </tr>
      <tr>
        <td>Licence Number : </td>
        <td>{Profil.Licencenumber ?? ''}</td>
      </tr>
    </tbody>
    <Button><Link to={`/Update/${props.user?.uid}`}>UPDATE</Link></Button>

  </table>
  
}

async function checkInfos(value){

   async function GetUser(){
    const path = window.location.href
    const uid = path.split('/').pop()
    const docRef = doc(db, "Users", uid);
    console.log(uid)
    const querySnapshot = await getDoc(docRef);
    console.log("query = ")

    return querySnapshot.data() === undefined
   }

   if(await GetUser() === true){
     const path = window.location.href
     const uid = path.split('/').pop()
     const querySnapshot = setDoc(doc(db, "Users", uid), {
      Name: "",
      Firstname: "",
      Birthdate: "",
      Adress: "",
      Phonenumber: "",
      Licencenumber: "",
      ProfilPicture: "",
    });
    value = "";
   }
  else{
    var value = "else"
  }
  console.log("ma value est : " + value);
  return value
}

function EditUser(props){

  const uid = useParams().uid ?? props.user.uid
  const [name, setName] = useState("")
  const [firstName, setfirstName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [Adress, setAdress] = useState("")
  const [Phone, setPhone] = useState("")
  const [Licence, setLicence] = useState("")
  const [ProfilPicture, setPicture] = useState("")
  const [users, setUsers] = useState()

  useEffect(() => {
    async function getProfil(){
      
      const docRef = doc(db, "Users", props.user.uid);
      console.log("hello")
      const querySnapshot = await getDoc(docRef);
      console.log("query = ")
      console.log(querySnapshot.data())
      setUsers(querySnapshot.data())
      if (querySnapshot.exists()){
        setName(querySnapshot.data().Name)
        setfirstName(querySnapshot.data().Firstname)
        setAdress(querySnapshot.data().Adress)
        setPhone(querySnapshot.data().Phonenumber)
        setLicence(querySnapshot.data().Licencenumber)
        setPicture(querySnapshot.data().ProfilPicture)
        // setBirthDate(querySnapshot.data().birthDate)
      }
    }
    getProfil()
    
  }, [props])

 

  async function addUser(user){

    const querySnapshot = await setDoc(doc(db, "Users", uid), {
      Name: name,
      Firstname: firstName,
      Birthdate: birthDate,
      Adress: Adress,
      Phonenumber: Phone,
      Licencenumber: Licence,
      ProfilPicture: ProfilPicture,
    });
    
  }
  return (
    <table id="tableSetting">
      {props.user && 
      <>
      <tr>
      <td>Name :</td>
      <td><input type="text" id="name" value={name} onChange={e=> setName(e.target.value)} /></td>
      </tr>
      <tr>
      <td>First name :</td>
      <td><input type="text" id="firstname" value={firstName} onChange={e=> setfirstName(e.target.value)}/></td>
      </tr>
      <tr>
      <td>Birth date :</td>
      <td><input type="date" id="birthdate"  onChange={e=> setBirthDate(e.target.value)}/></td>
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
      <tr>
      <td>Profil Picture :</td>
      <td><input type="text" id="ProfilPicture" value={ProfilPicture} onChange={e=> setPicture(e.target.value)}/></td>
      </tr>
      <Button><Link to={`/Profil/${props.user.uid}`}>Back</Link></Button>
      <Button onClick={addUser}>Valider</Button>
      </>
      }
            
    </table>
  )
}

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

/******************************** api get firebase ==> plusieurs useEffect possible ? ******************************************/ 


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
export default App;
