import app from "./firebase";
import "./App.css"
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
import {Container, Col, Row, Button, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import {Route, Routes, Link, useParams} from "react-router-dom"
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, getDoc, addDoc, updateDoc, where, query } from "firebase/firestore";


const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);

let newName;

function Profil(props){
  console.log("props = " ,props)
  const [Profil, setProfils] = useState({})
  const [users, setUsers] = useState([])
  useEffect(async () => {
    async function getProfil(){
      if(! props.user) {
        return
      }

      const query = await getDocs(collection(db, "Users"));
      query.forEach((user) => {
      // doc.data() is never undefined for query doc snapshots
        console.log(user.id, " => ", user.data());
      })

      const docRef = doc(db, "Users", props.user.uid);
      const querySnapshot = await getDoc(docRef);
      console.log("query = ")
      console.log(querySnapshot.data())
      setProfils(querySnapshot.data())
      setUsers(query.docs.map(user => ({id:user.id, ...user.data()})))
    }

    newName = await checkInfos(Profil.Name)
    getProfil()
  }, [props.user])

  return (
    <div>
      {console.log(Profil.Role)}
      {Profil.Role === "admin" ?
        // ListUsers()
        <table>
          <thead>
            <td>Name</td>
            <td>FirstName</td>
            <td>Phone Number</td>
            <td>Licence Number</td>
            <td>Role</td>
            <td></td>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr>
                {console.log(user.id, " => ", user)}
                <td>
                  <li>{user.Name}</li>
                </td>
                <td>
                  <li>{user.Firstname}</li>
                </td>
                <td>
                  <li>{user.Phonenumber}</li>
                </td>
                <td>
                  <li>{user.Licencenumber}</li>
                </td>
                <td>
                  <li>{user.Role}</li>
                </td>
                <td>
                <Button><Link to={`/Update/${user.id}`}>UPDATE</Link></Button>
                </td>
              </tr>
              )

            }) }
          </tbody>
        </table>
        :
        <table id="userTable">
          <tbody>
            <tr>
              <td>UID : </td>
              <td>{props.user?.uid ?? ''}</td>
            </tr>
            <tr>
              <td>Name : </td>
              { <td>{Profil.Name ?? ''}</td> }
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
            <tr>
              <td>Role : </td>
              <td>{Profil.Role}</td>
            </tr>
          </tbody>
          <Button><Link to={`/Update/${props.user.uid}`}>UPDATE</Link></Button>

        </table>
      }
    </div>


  )

}

// function ListUsers(props){

//   const [user, setUsers] = useState([])
//   useEffect(async () => {
//     async function getUserList(){
//     const querySnapshot = await getDocs(collection(db, "Users"));
//     querySnapshot.forEach((user) => {
//       // doc.data() is never undefined for query doc snapshots
//       console.log(user.id, " => ", user.data());
//     });
//     setUsers(querySnapshot.docs.map(user => user.data()))
//   }
//   getUserList()
//   }, [props.user])

//   return(
//   <p></p>
//   )

// }

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
  }
}

// le problème viens de la !!! ****************************************************************************

function EditUser(props){
  const path = window.location.href
  const uwu = path.split('/').pop()
  const docRef = doc(db, "Users", uwu);
  console.log(uwu)
  console.log(props)
  console.log(props.user)
  if(uwu != props.user.uid){
    console.log("salut")
  }
  else{
    console.log("same shit")
  }
  // console.log(props.user.uid)
  const uid = useParams().uid ?? props.user.uid
  const [name, setName] = useState("")
  const [firstName, setfirstName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [Adress, setAdress] = useState("")
  const [Phone, setPhone] = useState("")
  const [Licence, setLicence] = useState("")
  const [ProfilPicture, setPicture] = useState("")
  const [users, setUsers] = useState()
  const [Role, setRole] = useState("")

  useEffect(() => {
    async function getProfil(){

      // const docRef = doc(db, "Users", props.user.uid);
      const docRef = doc(db, "Users", uwu);
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
        setRole(querySnapshot.data().Role)
        // setBirthDate(querySnapshot.data().birthDate)
      }
    }
    getProfil()

  }, [props])



  async function addUser(user){
    console.log(props.user.uid)
    console.log(uid)
    if(props.user.uid != uid){
      console.log("different value !")
      const querySnapshot = await updateDoc(doc(db, "Users", uid), {
        Name: name,
        Firstname: firstName,
        Birthdate: birthDate,
        Adress: Adress,
        Phonenumber: Phone,
        Licencenumber: Licence,
        ProfilPicture: ProfilPicture,
        Role: Role
      });
      console.log(querySnapshot)
    }
    else if(props.user.uid == uid){
      const querySnapshot = await updateDoc(doc(db, "Users", props.user.uid), {
        Name: name,
        Firstname: firstName,
        Birthdate: birthDate,
        Adress: Adress,
        Phonenumber: Phone,
        Licencenumber: Licence,
        ProfilPicture: ProfilPicture,
        Role: Role
      });
      console.log(querySnapshot)

    }

    alert("The profil has corectly been updated !");
    // window.location.href = "/Profil/"+uid

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
      {Role === "admin" ?
      <tr>
        <td>Role :</td>
        <td><input type="text" id="role" value={Role} onChange={e=> setRole(e.target.value)}/></td>
      </tr>
      :
      <tr>
        <td>Role :</td>
        <td>{Role}</td>
      </tr>
      }

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

function UpdateCar(){
  return(
    <Button><Link to="/Voitures">BACK</Link></Button>
  )
}


function Cars(props){
  const [cars, setCars] = useState([])
  const [role, setRole] = useState("user")

  async function getCars(){
    const user = props.user
    if(!user ){
      setRole("user")
      return
    }
    console.log(user)
    console.log(user.uid)
    const docRef = doc(db, "Users", user.uid)
    const docSnap = await getDoc(docRef)
    const newRole = docSnap.data().Role
    console.log(newRole)
    setRole(newRole)

    if (document.getElementById("CarsPage").checked){
      const q = query(collection(db, "Cars"), where("Available", "==", true));
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((car) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(car.id, " => ", car.data());
        return role
      });
      setCars(querySnapshot.docs.map(car => ({id:car.id, ...car.data()})))
     }else{
      const q = query(collection(db, "Cars"));
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((car) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(car.id, " => ", car.data());
        return role
      });
      setCars(querySnapshot.docs.map(car => ({id:car.id, ...car.data()})))
     }
    //const q = query(collection(db, "Cars"));
    //const q = query(collection(db, "Cars"), where("Available", "==", true));

    // const querySnapshot = await getDocs(q)
    // querySnapshot.forEach((car) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(car.id, " => ", car.data());
    //   return role
    // });
    // setCars(querySnapshot.docs.map(car => ({id:car.id, ...car.data()})))
  }

  useEffect(() => {
    
    getCars()

  }, [props.user])



  return (
  <div>
    <input type="checkbox" id="CarsPage" onChange={() => getCars()}></input>
    <label> Available Only</label>
    <table id="carsTable">
      <thead>
          <td>Brand</td>
          <td>Model</td>
          <td>Plate</td>
          <td>Fuel</td>
          <td>Price</td>
          <td>Power</td>
          {role === "admin" ?
              <td><Button><Link to={`/AddCar`}>ADD</Link></Button></td>
                  :
                <td></td>
                }

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
                {role === "admin" ?
                  <li><Button><Link to={`/UpdateCar/${car.id}`} tag={Link}>UPDATE</Link></Button></li>
                  :
                  <li><Button>RENT</Button></li>
                }

              </td>
            </tr>
          )

        }) }

      </tbody>
    </table>
  </div>)
}


//Génère la page pour ajouter des voitures
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

          </Nav>
          <Button onClick={user ? () => signOut(auth) : () => signInWithRedirect(auth, provider)}>{user ? user.email : "Login"}</Button>
        </Collapse>
        </Navbar>
        <Row>
          <Col>
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="Voitures" element={<Cars user={user} />}/>

              <Route path="UpdateCar" element={<UpdateCar user={user}/>}>
                <Route path=":uid" element={<UpdateCar user={user} />}></Route>
              </Route>
              <Route path="Update" element={<EditUser  user={user}/>}>
                <Route path=":uid" element={<EditUser  user={user}/>}/>
              </Route>
              {/* <Route path="products" element={<Products />}/> */}
              <Route path="AddCar" element={<AddCar />}/>
              {/* <Route path="Liste_voiture" element={<Liste_voiture />}/> */}

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