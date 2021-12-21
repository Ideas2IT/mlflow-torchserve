import './App.css';
import HomePage from './components/home/home';

// let chosenForm = 'create';
function App() {
  return <HomePage />;
}

// function changeForm(form) {
//   console.log(form);
// }

// function Services() {
//   return <div className="container">
//     <Button variant="contained" className="container-btn" onClick={() => {
//       chosenForm = 'create';
//       FormContainer();
//     }}>Create</Button>
//     <Button variant="contained" className="container-btn" onClick={() => {
//       chosenForm = 'update';
//       FormContainer();
//     }}>Update</Button>
//     <Button variant="contained" className="container-btn" onClick={() => {
//       chosenForm = 'List';
//       FormContainer();
//     }}>List</Button>
//     <Button variant="contained" className="container-btn">Get</Button>
//     <Button variant="contained" className="container-btn">Delete</Button>
//     <Button variant="contained" className="container-btn">Update</Button>
//     <Button variant="contained" className="container-btn">Predict</Button>
//     <Button variant="contained" className="container-btn">Explain</Button>
//   </div>
// }

// function FormContainer() {
//   let form = null;
//   console.log(chosenForm);
//    switch(chosenForm) {
//     case 'create': 
//     form = <CreateForm/>;
//     break;
//     case 'update': 
//     form = <UpdateForm/>;
//     break;
//     default: 
//     form = '';
//   }
//   return form;
// }

export default App;
