import { StylesProvider } from "@mui/styles";
import "./home.css";
import Button from "@mui/material/Button";
import CreateForm from "../createForm/createForm";
import UpdateForm from "../updateForm/updateForm";
import ListForm from "../listForm/listForm";
import GetForm from "../getForm/getForm";
import { Component } from "react";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenForm: "create",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    console.log(event.target.value);
    // this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    alert("An essay was submitted: " + this.state.value);
    event.preventDefault();
  }

  render() {
    return [this.Services(), this.FormContainer()];
  }

  Services() {
    return (
      <StylesProvider injectFirst key="container">
        <div className="container" key="container">
          <Button
            variant="contained"
            className={
              this.state.chosenForm === "create"
                ? "container-btn container-btn--selected"
                : "container-btn"
            }
            onClick={() => {
              this.setState({ chosenForm: "create" });
            }}
          >
            Create
          </Button>
          <Button
            variant="contained"
            className={
              this.state.chosenForm === "update"
                ? "container-btn container-btn--selected"
                : "container-btn"
            }
            onClick={() => {
              this.setState({ chosenForm: "update" });
            }}
          >
            Update
          </Button>
          <Button
            variant="contained"
            className={
              this.state.chosenForm === "list"
                ? "container-btn container-btn--selected"
                : "container-btn"
            }
            onClick={() => {
              this.setState({ chosenForm: "list" });
            }}
          >
            List
          </Button>
          <Button
            variant="contained"
            className={
              this.state.chosenForm === "get"
                ? "container-btn container-btn--selected"
                : "container-btn"
            }
            onClick={() => {
              this.setState({ chosenForm: "get" });
            }}
          >
            Get
          </Button>
          {/* <Button variant="contained" className="container-btn">
            Delete
          </Button>
          <Button variant="contained" className="container-btn">
            Update
          </Button>
          <Button variant="contained" className="container-btn">
            Predict
          </Button>
          <Button variant="contained" className="container-btn">
            Explain
          </Button> */}
        </div>
      </StylesProvider>
    );
  }

  FormContainer() {
    let form = null;
    switch (this.state.chosenForm) {
      case "create":
        form = <CreateForm key="Create"/>;
        break;
      case "update":
        form = <UpdateForm key="Update"/>;
        break;
      case "list":
        form = <ListForm key="List"/>;
        break;
      case "get":
        form = <GetForm key="Get"/>;
        break;
      default:
        form = "";
    }
    return form;
  }
}

export default HomePage;
