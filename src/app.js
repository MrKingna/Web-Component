import { html, render } from '../node_modules/lit-html/lit-html.js';

class AddressComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        let streets = [];
        let http = new XMLHttpRequest();
        const url = 'https://cors-anywhere.herokuapp.com/https://www.postdirekt.de/plzserver/PlzAjaxServlet';
        let responseJSON = null;


        const form = {
            zip: "",
            cityValue: "",
            streetValue: "",
            houseNumberValue: "",
            country: "Germany"
        };

        const getAddresses = (zipCode) => {
            http.open('POST', url, true);

            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            http.send('finda=city&city=' + zipCode +'&lang=de_DE');

            http.onreadystatechange = () => {
                if(http.readyState === 4 && http.status === 200) {
                    responseJSON = JSON.parse(http.responseText);

                    if (responseJSON.count) {
                        form.cityValue = responseJSON.rows[0].city;
                        streets = [{ key: "Please select a street", value: "" }];
                        for (let i = 0; i < responseJSON.rows.length; i++) {
                            streets.push({ key: responseJSON.rows[i].street, value: responseJSON.rows[i].street });
                        }
                    }
                    render(template(form), this.shadowRoot);
                }
            }
        }

        const handleZipChange = (ev) => {
            form.zip = ev.currentTarget.value;
            form.cityValue = "";
            form.streetValue = "";
            streets = [];
            getAddresses(form.zip);
        };

        const printForm = () => alert(JSON.stringify(form, undefined, 4));
        
        const template = (form) => html`
            <form>
                <div class="form-group">

                    <h3>Address</h3>
                    
                    <input
                        type="zip" 
                        class="form-control h-all f-all" 
                        id="inputZip" 
                        placeholder="Zip"
                        @change="${(ev) => handleZipChange(ev)}"
                        .value=${form.zip}>
 
                    <input
                        type="city" 
                        class="form-control h-all" 
                        id="inputCity"
                        .value=${form.cityValue}
                        placeholder="City"
                        disabled
                    >

                    <select
                         type="street" 
                         class="form-control h-all" 
                         id="inputStreet" 
                         ?disabled=${!streets.length}
                         @change="${(ev) => { form.streetValue = ev.currentTarget.value }}"
                         .value=${form.streetValue}
                     >

                        ${streets.map(obj => html`
                            <option value="${obj.value}" ?selected=${form.streetValue === obj.value}>${obj.key}</option>
                        `)}
                    </select>

                    <input
                        type="houseNumber" 
                        class="form-control h-all" 
                        id="inputHouseNumber" 
                        placeholder="House No."
                        @change="${(ev) => { form.houseNumberValue = ev.currentTarget.value; }}"
                        .value=${form.houseNumberValue}
                    >

                    <input 
                        type="country" 
                        class="form-control h-all" 
                        id="inputCountry" 
                        placeholder="Germany"
                        disabled
                    >

                    <button id="info" @click=${printForm} style="cursor: pointer" type="button">Info</button>

                </div>
            </form>

            <style>
                input, button {
                    margin: 5px 5px;
                }

                .form-group {
                    margin: 20px auto;
                    max-width: 100vh;
                    padding: 10px 5px 10px 40px;
                    font: 15px "Lucida Sans Unicode", "Lucida Grande", sans-serif;
                    border: solid 1px #D2D9DA;
                    border-radius: 10px;
                    overflow: hidden;
                    box-sizing: border-box;
                    align-content: center;
                }

                .form-control {
                    display: inline-block;
                    border-radius: 4px;
                    margin: 5px auto;
                    border: none;
                    background-color: #E9ECED;
                }

                .form-control:focus {
                    background-color: #AFD9E4;
                    outline: none;
                    border-radius: 4px;
                    border: none;
                }

                .h-all {
                    height: 30px;
                    font-size: 15px;
                    padding: 0px 0px 0px 10px;
                    margin: 10px auto;
                }

                #inputZip {
                    width: 20%;
                    transition: width 0.4s ease-in-out;
                }
                #inputZip:focus {
                    width: 21%;
                }


                #inputCity {
                    width: 70%;
                    transition: width 0.4s ease-in-out;
                }
                #inputCity:focus {
                    width: 71%;
                }


                #inputStreet {
                    width: 70%;
                    transition: width 0.4s ease-in-out;
                }
                #inputStreet:focus {
                    width: 71%;
                }


                #inputHouseNumber {
                    width: 21%;
                    transition: width 0.4s ease-in-out;
                }
                #inputHouseNumber:focus {
                    width: 22%;
                }


                #inputCountry {
                    width: 91.5%;
                    background-color: #D2D9DA;
                }

                #info {
                    background-color: #19647E;
                    font: 15px "Lucida Sans Unicode", "Lucida Grande", sans-serif;
                    border: none;
                    height: auto;
                    margin: 10px auto;
                    color: white;
                    border-radius: 4px;
                    width: auto;
                    padding: 10px 20px;
                }
                #info:hover {
                    background-color: #119DA4;
                    box-shadow: none;
                    -moz-box-shadow: none;
                    -webkit-box-shadow: none;
                }  

            </style>

        `;

        render(template(form), this.shadowRoot);

    }
}

window.customElements.define('address-component', AddressComponent);