import "./listForm.css";
import { Component } from "react";

class ListForm extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     name: "",
  //     uri: "",
  //     modelFile: "",
  //     handler: "",
  //     switches: {
  //       uri: false,
  //       modelFile: false,
  //       handler: false,
  //     },
  //     files: {
  //       uriFileInput: null,
  //       modelFileInput: null,
  //       handlerFileInput: null,
  //     },
  //     output: {"models":[{"modelName":"squeezenet1_1","modelUrl":"squeezenet1_1.mar"},{"modelName":"squeezenet2_1","modelUrl":"squeezenet2_1.mar"},{"modelName":"squeezenet3_1","modelUrl":"squeezenet3_1.mar"}]}
  //   };

  // }

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:5000/list")
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
            items:{"models":[{"modelName":"squeezenet1_1","modelUrl":"squeezenet1_1.mar"},{"modelName":"squeezenet2_1","modelUrl":"squeezenet2_1.mar"},{"modelName":"squeezenet3_1","modelUrl":"squeezenet3_1.mar"}]}
          });
        }
      )
  }



  render() {
    return (
      <div className="form-cntr">
          <div><pre>{JSON.stringify(this.state.items, null, 2)}</pre></div>
      </div>
    );
  }
}

export default ListForm;
