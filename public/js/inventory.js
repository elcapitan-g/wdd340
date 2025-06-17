"use strict";


const classificationList = document.querySelector("#classificationList");
classificationList.addEventListener("change", listChange);
listChange(); 

function listChange() {
  const classification_id = classificationList.value;

  if (!classification_id) {
    document.getElementById("inventoryDisplay").innerHTML = "";
    return;
  }

  const classIdURL = "/inv/getInventory/" + classification_id;

  fetch(classIdURL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not OK");
    })
    .then((data) => {
      buildInventoryList(data);
    })
    .catch((error) => {
      console.log("There was a problem: ", error.message);
      document.getElementById("inventoryDisplay").innerHTML =
        "<p class='notice'>No vehicles in this category.</p>";
    });
}


function buildInventoryList(data) {
  const inventoryDisplay = document.getElementById("inventoryDisplay");

  if (!data.length) {
    inventoryDisplay.innerHTML = "<p class='notice'>No vehicles found.</p>";
    return;
  }

  let dataTable = `
    <thead>
      <tr>
        <th>Vehicle Name</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
  `;

  data.forEach((element) => {
    dataTable += `
      <tr>
        <td>${element.inv_make} ${element.inv_model}</td>
        <td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>
        <td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td>
      </tr>
    `;
  });

  dataTable += "</tbody>";
  inventoryDisplay.innerHTML = dataTable;
}
