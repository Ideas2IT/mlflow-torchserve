import "./getForm.css";
import { Component } from "react";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";

class GetForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      items: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.id;
    this.setState(
      {
        [name]: target.value,
      },
      () => {
        this.checkFormValidity();
      }
    );
  }

  checkFormValidity() {
    const keys = Object.keys(this.state);
    let i = 0;
    for (; i < keys.length; i++) {
      if (this.state[keys[i]] === "") {
        this.addDisabled();
        break;
      }
    }
    if (i === keys.length) {
      this.removeDisabled();
    }
  }

  addDisabled() {
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.setAttribute("disabled", true);
    submitBtn.classList.add("Mui-disabled");
  }

  removeDisabled() {
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.removeAttribute("disabled");
    submitBtn.classList.remove("Mui-disabled");
  }

  handleSubmit(event) {
    const formValue = this.state;
    console.log(formValue);
    event.preventDefault();
    fetch(`http://localhost:5000/get/${this.state.name}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
            items: [{"modelName":"squeezenet1_1","modelVersion":"1.0","modelUrl":"squeezenet1_1.mar","runtime":"python","minWorkers":1,"maxWorkers":1,"batchSize":1,"maxBatchDelay":100,"loadedAtStartup":false,"workers":[{"id":"9000","startTime":"2021-12-16T17:50:47.361Z","status":"READY","memoryUsage":345088000,"pid":18383,"gpu":false,"gpuUsage":"N/A"}]}]
          });
        }
    )
  }

  clearFields() {
    this.setState({
      name: "",
      items: null
    });
  }

  render() {
    return (
      <div className="form-cntr">
        <form onSubmit={this.handleSubmit}>
          {this.TextField("name", "Name", this.state.name, false)}

          {this.TextField("target", "Target", "torchserve", true)}

          <div className="form-cntr__btn-cntr">
            <Button variant="contained" type="submit" id="submitBtn" disabled>
              Submit
            </Button>
            <Button
              variant="text"
              id="submitBtn"
              onClick={() => {
                this.clearFields();
              }}
            >
              Clear
            </Button>
          </div>
        </form>

        <div style={{ marginTop: '50px' }}>
          <div><b>Output</b></div>
          <div className="output-form-cntr">
            {this.state.items ? 
            <pre>{JSON.stringify(this.state.items, null, 2)}</pre> : ''
            }
          </div>
        </div>
      </div>
    );
  }

  TextField(id, label, value, disabled) {
    if (!disabled) {
      return (
        <TextField
          id={id}
          className="form-cntr__textField form-cntr__textField--w50"
          label={label}
          variant="standard"
          value={value}
          onChange={this.handleChange}
        />
      );
    } else {
      return (
        <TextField
          id={id}
          className="form-cntr__textField form-cntr__textField--w50"
          label={label}
          variant="standard"
          defaultValue={value}
          disabled
        />
      );
    }
  }
}

export default GetForm;
