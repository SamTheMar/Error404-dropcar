import React, { Component } from "react";
import { Button } from "reactstrap";
import * as moment from "moment";
import Axios from "axios";

export default class CardRitiraConsegnaAutista extends Component {
  state = {
    ritiro: false,
    consegna: false,
    disabled: true,
  };

  setting = () => {
    if (this.props.state === "withdrawn") {
      this.setState({ ritiro: false });
      this.setState({ consegna: true });
    } else {
      let dateNow = moment(new Date());
      let dateR = moment(this.props.dateR);
      console.log(dateNow + " " + dateR);
      if (dateNow > dateR) {
        console.log("sono dentro");
        this.setState({ ritiro: true });
        this.setState({ consegna: false });
      }
    }
  };

  componentDidMount() {
    this.setting();
  }

  componentDidUpdate(propsPrecedenti) {
    if (this.props !== propsPrecedenti) {
      this.setting();
    }
  }

  ritira = () => {
    const data = {
      id: this.props.id,
      refVehicle: this.props.refVehicle,
    };
    console.log(data);
    Axios.put("/api/driver/retirecar/", data)
      .then((res) => {
        this.setState({ ritiro: false });
        this.setState({ consegna: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="card card-css-RC">
        <div className="row no-gutters">
          <div className="col">
            <div className="card-body">
              <div className="row no-gutters">
                <div className="col-md-12">
                  <p className="infoCard">
                    <strong>ID veicolo: {this.props.refVehicle}</strong>
                  </p>
                  <hr style={{ backgroundColor: "white" }} />
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col-md-6">
                  <p className="infoCard">
                    <strong>Tipo:</strong> {this.props.type}{" "}
                    {this.props.category}
                  </p>
                  <p className="infoCard">
                    <strong>Posizione di ritiro:</strong> {this.props.positionR}
                  </p>
                  <p className="infoCard">
                    <strong>Data ritiro:</strong> {this.props.dateR}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="infoCard">
                    <strong>Cliente:</strong> {this.props.name}{" "}
                    {this.props.surname}
                  </p>
                  <p className="infoCard">
                    <strong>Posizione di consegna:</strong>{" "}
                    {this.props.positionC}
                  </p>
                  <p className="infoCard">
                    <strong>Data consegna:</strong> {this.props.dateC}
                  </p>
                </div>
              </div>
              <center>
                <Button
                  type="button"
                  className="buttonRitiro"
                  onClick={() => this.ritira()}
                  style={{ marginRight: "10px", marginTop: "20px" }}
                  size="lg"
                  disabled={!this.state.ritiro}
                >
                  Ritiro
                </Button>
                <Button
                  type="button"
                  className="buttonConsegna"
                  onClick={() =>
                    this.props.consegna(this.props.id, this.props.refVehicle)
                  }
                  style={{ marginRight: "10px", marginTop: "20px" }}
                  size="lg"
                  disabled={!this.state.consegna}
                >
                  Consegna
                </Button>
              </center>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
