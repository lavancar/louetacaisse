import app from "./firebase";
import "./App.css"
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
import {Container, Col, Row, Button, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import {Route, Routes, Link, useParams} from "react-router-dom"
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, getDoc } from "firebase/firestore";


const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);



function Profil(props){
  console.log("props = " ,props)
  const [Profil, setProfils] = useState({})
  useEffect(() => {
    async function getProfil(){
      if(! props.user) {
        return 
      }
      const docRef = doc(db, "Users", props.user.uid);
      console.log("hello")
      const querySnapshot = await getDoc(docRef);
      console.log("query = ")
      console.log(querySnapshot.data())
      setProfils(querySnapshot.data())
    }
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


function EditUser(props){

  const uid = useParams().uid ?? props.user.uid
  const [name, setName] = useState("")
  const [firstName, setfirstName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [Adress, setAdress] = useState("")
  const [Phone, setPhone] = useState("")
  const [Licence, setLicence] = useState("")

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
      <Button><Link to={`/Profil/${props.user.uid}`}>Back</Link></Button>
      <Button onClick={addUser}>Valider</Button>      
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
        <Navbar
          color="light"
          expand="md"
          light>
        <NavbarBrand href="/">
        <img
          width={"30%"}
          src="loutacaisse.png" />
        </NavbarBrand>
        <NavbarToggler onClick={function noRefCheck() { }}/>
        <Collapse navbar>
          <Nav
            className="me-auto"
            navbar
          >
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
          width={"30%"}
          src="gear.png" />
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
              <Route path="Voitures" element={<Cars />}/>
              <Route path="Profil" element={<Profil user={user} />}>
                <Route path=":uid" element={<Profil/>}>
                </Route>
                
              </Route>
              <Route path="Update" element={<EditUser  user={user}/>}>
                    <Route path=":uid" element={<EditUser  user={user}/>}/>
                  </Route>
            </Routes>
          </Col>
        </Row>
      </Container>
  );
}



export default App;
export default App;
