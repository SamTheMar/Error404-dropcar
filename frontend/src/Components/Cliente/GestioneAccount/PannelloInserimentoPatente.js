import React, { Component } from "react";

import { Jumbotron, Button, Form, FormGroup, Label, Input, } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import "../../../ComponentsCss/Pannel.css";
import Axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';
import "../../../ComponentsCss/PannelloInserimentoPatente.css"
import NavbarCliente from "../../NavbarCliente";

export default class Registrazione extends Component {

	state = {
		number: "",
		date: "",
		a: false,
		am: false,
		a1: false,
		a2: false,
		b: false,
		error: false,
		success: false,
		string: ""
	};

	handleChange = (input) => (e) => {
		this.setState({ [input]: e.target.value });
	};

	stampa = () => {
		console.log(this.state);
	}

	change = (input) => (e) =>{
		this.setState({ [input]: !this.state[input]})
	}

	addCarLicense = () => {
		Axios.post('/api/guest/addcarlicense', this.state)
			.then((res) =>{
				this.setState({ error: false });
				this.setState({ success: true });
			}).catch((err) => {
				if (err.response.status === 513) {
					this.setState({ string: "hai già inserito una patente" });
					this.setState({ error: true });
				} else if (err.response.status === 422) {
					this.setState({ string: "errore nell'inserimento dei dati" });
					this.setState({ error: true });
				} else if (err.response.status === 503) {
					this.setState({ string: "impossibile inserie la patente al momento, riprova più tardi" });
					this.setState({ error: true });
				} else {
					window.location.href = "/serverError"
				}
			});
	}

	onValidSubmit = (event) => {
		event.preventDefault();
		this.addCarLicense();
	};



	render() {
		// definisco il lower bound per la data di nascita
		let today = new Date();
		today.setFullYear(today.getFullYear());
		today = today.toJSON().split("T")[0];

		return (
			<div className="ez sfondo">
				<NavbarCliente/>
				{this.state.error && <Alert severity="error">{this.state.string}</Alert>}
				{this.state.success && <Alert severity="success">Patente inserita correttamente</Alert>}

				<AvForm onValidSubmit={this.onValidSubmit}	>
					<div className="row h-100 justify-content-md-center boxpannel ">
						
						<div className="col-9 bg-pannell">
							<div >
								<div className="title">Inserisci Patente</div>
								{/* Riga numero e scadenza */}
								<div className="row">
									<div className="col-12 col-md-6">
										<AvField
											name="number"
											type="text"
											label="Codice Patente"
											onChange={this.handleChange("number")}
											style={{ label: { color: "white" } }}
											validate={{
												required: {
													value: true,
													errorMessage: "Il campo è richiesto",
												},
											}}
										/>
									</div>

									<div className="col-12 col-md-6">
										<AvField
											name="dataScadenza"
											label="Data di Scadenza"
											type="date"
											min={today}
											onChange={this.handleChange("date")}
											validate={{
												required: {
													value: true,
													errorMessage: "Il campo è richiesto.",
												},
											}}
										/>
									</div>
								</div>



								<center>
									<Form>
										<FormGroup check inline>
											<Label check>
												<Input type="checkbox"
													onChange={this.change("a")}
												/> A
											</Label>
										</FormGroup>
										<FormGroup check inline>
											<Label check>
												<Input type="checkbox"
													onChange={this.change("am")}
												/>
												AM
											</Label>
										</FormGroup>
										<FormGroup check inline>
											<Label check>
												<Input type="checkbox"
													onChange={this.change("a1")}
												/>
												A1
											</Label>
										</FormGroup>
										<FormGroup check inline>
											<Label check>
												<Input type="checkbox"
													onChange={this.change("a2")}
												/> A2
											</Label>
										</FormGroup>
										<FormGroup check inline>
											<Label check>
												<Input type="checkbox"
													onChange={this.change("b")}
												/>
												B
											</Label>
										</FormGroup>
									</Form>
								</center>





								<div className="text-center" style={{ paddingTop: "2%" }}>
									<Button className="buttonCyano" type="submit" >
										Insert
									</Button>
								</div>



							</div>
						</div>
						
					</div>
				</AvForm>

			</div>
		);
	}
}