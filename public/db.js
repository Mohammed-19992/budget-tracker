//Indexed database
// let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

let db;
// create a new db request for a "budget" database.
let request = indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
  let db = target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

// Navigator to check if online first before reading the database
request.onsuccess = ({ target }) => {
  db = target.result;

  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

// Checking if there is an error
request.onerror = function(event) {
  console.log("Woops! " + event.target.errorCode);
};

// Saving records
function saveRecord(record) {
  let transaction = db.transaction(["pending"], "readwrite");
  let store = transaction.objectStore("pending");
  store.add(record);
}
// Checking Database
function checkDatabase() {
  let transaction = db.transaction(["pending"], "readwrite");
  let store = transaction.objectStore("pending");
  let getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })

          .then(response => {
            return response.json();
          })
          
          .then(() => {

            // Deleting records
        let transaction = db.transaction(["pending"], "readwrite");
        let store = transaction.objectStore("pending");

        // Clearing all items in the store
        store.clear();
      });
    }
  };
}

// Listening for the app coming back online
window.addEventListener("online", checkDatabase);
