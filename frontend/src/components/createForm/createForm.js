import "./createForm.css";
import { Component } from "react";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";

class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      uri: "",
      modelFile: "",
      handler: "",
      extraFile: "",
      exportPath: "",
      switches: {
        uri: false,
        modelFile: false,
        handler: false,
      },
      files: {
        uriFileInput: null,
        modelFileInput: null,
        handlerFileInput: null,
      },
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

    const postObj = {
      "model_file": this.state.modelFile,
      "handler_file": this.state.handler,
      "model_name": this.state.name,
      "model_uri": this.state.uri,
      "extra_files": this.state.extraFile,
      "model_export_path": this.state.exportPath
    }

    console.log(postObj);

    event.preventDefault();
    fetch('http://localhost:5000/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postObj),
    })
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
          items: {"status": "created"}
        });
      }
  )
  }

  clearFields() {
    this.setState({
      name: "",
      uri: "",
      modelFile: "",
      handler: "",
      extraFile: "",
      exportPath: "",
      switches: {
        uri: false,
        modelFile: false,
        handler: false,
      },
      files: {
        uriFileInput: null,
        modelFileInput: null,
        handlerFileInput: null,
      },
      items: null
    });
  }

  render() {
    return (
      <div className="form-cntr">
        <form onSubmit={this.handleSubmit}>
          {this.TextField("name", "Name", this.state.name, false)}

          {this.TextField("target", "Target", "torchserve", true)}

          <br />

          {this.TextField("uri", "Model-URI", this.state.uri, false)}

          {this.TextField("modelFile", "Model File", this.state.modelFile, false)}

          <br />

          {this.TextField("handler", "Handler", this.state.handler, false)}

          {this.TextField("extraFile", "Extra File", this.state.extraFile, false)}

          <br />

          {this.TextField("exportPath", "Export Path", this.state.exportPath, false)}


          {/* <div className="form-cntr__switchBlk">
            {this.SwitchBlock(
              "Is Model URI:",
              "File Upload",
              "Text Input",
              "modelURISwitch",
              "uri"
            )}

            {this.state.switches.uri
              ? this.SwitchTextField("uri", "Model-URI", this.state.uri)
              : this.Fileupload("uriFileInput")}
          </div>

          <div className="form-cntr__switchBlk">
            {this.SwitchBlock(
              "Is Model File:",
              "File Upload",
              "Text Input",
              "modelFileSwitch",
              "modelFile"
            )}

            {this.state.switches.modelFile
              ? this.SwitchTextField(
                  "modelFile",
                  "Model File",
                  this.state.modelFile
                )
              : this.Fileupload("modelFileInput")}
            <br />
          </div>

          <div className="form-cntr__switchBlk">
            {this.SwitchBlock(
              "Is Handler:",
              "File Upload",
              "Text Input",
              "handlerSwitch",
              "handler"
            )}

            {this.state.switches.handler
              ? this.SwitchTextField("handler", "Handler", this.state.handler)
              : this.Fileupload("handlerFileInput")} 
            <br />
          </div>*/}

          {/* {this.TextField("handler", "Handler", this.state.handler, false)} */}

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
          {/* <div>Output</div>
          <div><pre>{JSON.stringify(this.state.output, null, 2)}</pre></div> */}
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

  Fileupload(id) {
    return (
      <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
        <Button
          variant="contained"
          className="form-cntr__uploadBtn"
          onClick={() => {
            document.getElementById(id).click();
          }}
        >
          Upload
        </Button>
        <input
          type="file"
          id={id}
          onChange={(event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
              this.SetFiles(reader.result, event.target.files[0], id);
            };
            reader.readAsText(file);
          }}
          style={{ display: "none" }}
        />
        {
        this.state.files[id] ? (
          <div style={{ marginLeft: "20px" }}>{this.state.files[id].details.name}</div>
        ) : (
          null
        )}
      </div>
    );
  }

  SetFiles(fileContent, file, id) {
    this.setState(
      (prevState) => {
        let files = Object.assign({}, prevState.files);
        files[id] = {
          content: fileContent,
          details: file,
        };
        return { files };
      },
      () => {
        console.log(this.state);
      }
    );
  }

  SwitchBlock(question, option1, option2, id, stateProp) {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: "150px" }}>{question}</div>
        <div>{option1}</div>
        <Switch
          id={id}
          className="form-cntr__switch"
          onChange={() => {
            this.setState((prevState) => {
              let switches = Object.assign({}, prevState.switches);
              switches[stateProp] = document.getElementById(id).checked;
              return { switches };
            });
          }}
        />
        <div style={{ width: "150px" }}>{option2}</div>
      </div>
    );
  }

  SwitchTextField(id, label, value) {
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
  }
}

export default CreateForm;
