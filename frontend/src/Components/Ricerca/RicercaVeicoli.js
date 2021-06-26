import React, { Component } from "react";
import DateFnsUtils from '@date-io/date-fns';
import "../../ComponentsCss/Pannel.css";
import * as moment from 'moment';


import {
	DatePicker,
	TimePicker,
	DateTimePicker,
	MuiPickersUtilsProvider,
} from '@material-ui/pickers';


import {
	ListGroup,
	ListGroupItem,
	Button,
	Input,
	Jumbotron,
	FormGroup,
	Label,
	Col,
	Form,
	ButtonGroup,
} from "reactstrap";

import {
	AvForm,
	AvGroup,
	AvField,
	AvRadio,
	AvRadioGroup,
} from "availity-reactstrap-validation";
import Alert from '@material-ui/lab/Alert';

import CardPrenotaVeicolo from './CardPrenotaVeicolo';
import Axios from 'axios';

export default class FormRicerca extends Component {
	state = {
		list: [],
		type: "car",
		refParkingR: "Via Libertà",
		refParkingC: "Via Libertà",
		dateR: moment(new Date()).format('YYYY-MM-DD HH:mm'),
		dateC: moment(new Date()).format('YYYY-MM-DD HH:mm'),
		category: "",
		payment: false,
	};

	componentDidMount(){
		if (localStorage.getItem("utente") === null) {
			window.location.href = '/login';
		}
	}


	handleChange = (input) => (e) => {
		this.setState({ [input]: e.target.value });
	};

	handleChangeDataArrivo = (date) => {
		const d = (moment(date).format('YYYY-MM-DD HH:mm'));
		this.setState({ dateC: d });
	};

	handleChangeDataPartenza = (date) => {
		const d = (moment(date).format('YYYY-MM-DD HH:mm'));
		this.setState({ dateR: d });
	};

	search = () => {
		Axios.post('/api/search/searchvehicles', this.state)
			.then((res) => {
				this.setState({ list: res.data });
			}).catch((err) => {
				console.log(err);
			})
	}

	onValidSubmit = async (event) => {
		let payment = false;
		Axios.get('/api/guest/listpayments')
			.then((res) => {

				if (res.data.length !== 0) {
					payment= true;
				}

				if (payment){
					console.log("sono dentro VERO")
					this.search();
					const reservation = {
						refVehicle: null,
						type: this.state.type,
						refParkingR: this.state.refParkingR,
						refParkingC: this.state.refParkingC,
						dateR: this.state.dateR,
						dateC: this.state.dateC,
						category: null,
						positionR: null,
						positionC: null,
						refDriver: null
					};
					window.localStorage.setItem("reservation", JSON.stringify(reservation));
				} else {
					//fare spuntare messaggio di errore 
				}
				
			}).catch((err) => {
				console.log(err);
				//window.location.href = '/errorServer';
			});
	};

	render() {
		return (
			<div>

				<AvForm onValidSubmit={this.onValidSubmit} >
					<ListGroup>
						<ListGroupItem >
							<div>
								<div style={{ display: "flex", justifyContent: "center", paddingTop: "20px", paddingBottom: "20px" }}>
									<AvRadioGroup
										inline
										name="TipoVeicolo"
										label=""
										value="car"
										onClick={this.handleChange("type")}
									>
										<AvRadio label="Auto" value="car" />
										<AvRadio label="Moto" value="scooter" />
										<AvRadio label="Bici" value="bicycle" />
										<AvRadio label="Monopattino" value="electric scooter" />
									</AvRadioGroup>
								</div>
								<div style={{ paddingBottom: "20px" }}>
									<AvField type="select" name="select" label="Ritiro" onClick={this.handleChange("refParkingR")}>
										<option>Via Libertà</option>
										<option>Via Roma</option>
										<option>Via Ernesto Basile</option>
										<option>Viale Regione</option>
										<option>Via Tersicore</option>
									</AvField>
								</div>

								<div style={{ paddingBottom: "30px" }}>
									<AvField type="select" name="select" label="Consegna" onClick={this.handleChange("refParkingC")}>
										<option>Via Libertà</option>
										<option>Via Roma</option>
										<option>Via Ernesto Basile</option>
										<option>Viale Regione</option>
										<option>Via Tersicore</option>
									</AvField>
								</div>
							</div>

							<center>
								<div className="row " style={{ paddingBottom: "30px" }}>
									<div className="col">
										<MuiPickersUtilsProvider utils={DateFnsUtils}>
											<DateTimePicker format={"dd/MM/yyyy hh:mm"} minDateTime={new Date()} label="Ritiro" inputVariant="outlined" value={this.state.dateR} selected={this.state.dateR} onChange={this.handleChangeDataPartenza} />
										</MuiPickersUtilsProvider>
									</div>
									<div className="col">
										<MuiPickersUtilsProvider utils={DateFnsUtils}>
											<DateTimePicker format={"dd/MM/yyyy hh:mm"} minDateTime={this.state.dateR} label="Consegna" inputVariant="outlined" value={this.state.dateC} selected={this.state.dateC} onChange={this.handleChangeDataArrivo} />
										</MuiPickersUtilsProvider>
									</div>
								</div>

								<div style={{ paddingBottom: "30px" }}>
									<Button color="primary" type="submit" size="lg"  >
										CERCA
									</Button>
								</div>

							</center>
						</ListGroupItem>


					</ListGroup>
				</AvForm>
				{this.state.list.map(((item) => (
					<CardPrenotaVeicolo id={item.id} type={item.type} category={item.category} />
				)))}
			</div>
		);
	}
}