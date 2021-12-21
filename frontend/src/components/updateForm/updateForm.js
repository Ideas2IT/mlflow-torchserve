import { Component } from "react";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";

class UpdateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
          name: "",
          target: "",
          modelUri: "",
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
        return (
          <div className="form-cntr">
            <form onSubmit={this.handleSubmit}>
              <TextField
                id="standard-basic"
                className="form-cntr__textField"
                label="Name"
                variant="standard"
                defaultValue={this.state.name}
                onChange={this.handleChange}
              />
              <TextField
                id="standard-basic"
                className="form-cntr__textField"
                label="Target"
                variant="standard"
                defaultValue={this.state.target}
                onChange={this.handleChange}
              />
              {/* <TextField
                id="standard-basic"
                className="form-cntr__textField"
                label="Model-URI"
                variant="standard"
                defaultValue={this.state.modelUri}
                onChange={this.handleChange}
              /> */}
              <div className="form-cntr__btn-cntr">
                <Button variant="contained" type="submit" disabled>
                  Submit
                </Button>
              </div>
            </form>
          </div>
        );
      }
}

export default UpdateForm;
