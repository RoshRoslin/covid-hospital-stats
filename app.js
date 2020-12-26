const locationBtn = document.getElementById("locate-btn");
const sectionDiv = document.getElementById("place-data");
const stateInput = document.getElementById("state-input");
const form = document.getElementById("form");

form.addEventListener("submit", getInputData);
locationBtn.addEventListener("click", getInputData);

// click to submit
function getInputData(event) {
  removePreviousData();
  event.preventDefault();

  // make two characters
  if (
    stateInput.value === "" ||
    stateInput.value.length < 2 ||
    stateInput.value.length > 2
  ) {
    return;
  } else {
    let stateValue = stateInput.value.toLowerCase();
    getCoronaData(stateValue);
  }
}

//show error
function showError() {
  locationBtn.insertAdjacentHTML(
    "afterend",
    "<h3 id ='error'>Error: Please Enter a Valid State</h3>"
  );
  const error = document.getElementById("error");
  setTimeout(() => {
    error.classList.add("hide");
  }, 3000);
}

//show data
function showData(data, stateValue) {
  const formattedDate = formatDate();
  const dataHTML = `
  <div id="old-data">
  <br>
  <button id="alert">Current ${stateValue.toUpperCase()} Stats</button>
  <br>
  <h3>Date: ${formattedDate} </h3>
  <br>
  <h3>Positive Cases: ${numberWithCommas(data.positive)} </h3>
  <br>
  <h3> Currently Hospitalized: ${numberWithCommas(
    data.hospitalizedCurrently
  )}</h3>
  <br>
  <h3>In ICU Currently: ${numberWithCommas(data.inIcuCurrently)}</h3>
 
  </div>
`;

  removePreviousData();
  locationBtn.insertAdjacentHTML("afterend", dataHTML);
}

//remove previous Data
function removePreviousData() {
  if (document.getElementById("alert")) {
    const oldData = document.getElementById("old-data");
    oldData.remove();
  } else {
    return;
  }
}

//number formatting
function numberWithCommas(x) {
  if (x === undefined) {
    showError();
  } else if (x === null) {
    return "No Data Provided";
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//date formatting

function formatDate() {
  var d = new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [month, day, year].join("/");
}

async function getCoronaData(stateValue) {
  const response = await fetch(
    `https://api.covidtracking.com/v1/states/${stateValue}/current.json`
  );

  const data = await response.json();
  if (response.status === 404) {
    console.log(response.status);
    showError();
  } else if (response.status === 200) {
    showData(data, stateValue);
    return;
  }

  console.log(response.status);
}
