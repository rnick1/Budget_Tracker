let db;

const request = indexedDB.open ('BudgetDB', 1);

request.onupgradeneeded = function (e) {
  db = e.target.result;
  db.createOBjectStore('BudgetStore', {autoIncrement: true});
};

request.onerror = function (e) {
  console.log(`${e.target.errorCode}`);
};

function checkDatabase() {
  let transaction = db.transaction (['BudgetStore'], 'readwrite');
  const store = transaction.objectStore('BudgetStore');
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if(getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((res) => {
        if(res.length !== 0) {
        transaction = db.transaction(['BudgetStore'], 'readwrite');
        const currentStore = transaction.objectStore('BudgetStore');
        currentStore.clear();
        }
      });
    }
  };
}

request.onsuccess = function (e) {
  db = e.target.result;
  if(navigator.onLine) {
    checkDatabase();
  }
};

const saveRecord = (record) => {
  const transaction = db.transaction(['BudgetStore'], 'readwrite');
  const store = transaction.objectStore('BudgetStore');
  store.add();
};

window.addEventListener('online', checkDatabase);