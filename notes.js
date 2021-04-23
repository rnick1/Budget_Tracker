const request = indexedDB.open("toDoList", 1);
// CREATE
      // Create schema
      request.onupgradeneeded = event => {
        const db = event.target.result;
        // Creates an object store with a listID keypath that can be used to query on.
        const toDoListStore = db.createObjectStore("toDoList", {keyPath: "listID"});
        // Creates a statusIndex that we can query on.
        toDoListStore.createIndex("statusIndex", "status");
      };
// ALLOWS INTERFACE
      // Opens a transaction, accesses the toDoList objectStore and statusIndex.
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(["toDoList"], "readwrite");
        const toDoListStore = transaction.objectStore("toDoList");
        const statusIndex = toDoListStore.index("statusIndex");
// ADDS DATA
        // Adds data to our objectStore
        toDoListStore.add({ listID: "1", status: "complete" });
        toDoListStore.add({ listID: "2", status: "in-progress" });
        toDoListStore.add({ listID: "3", status: "complete" });
        toDoListStore.add({ listID: "4", status: "backlog" });
//CURSOR!
// (Student Note): A cursor is an abstraction of an iteration of an object store   
        // Opens a Cursor request and iterates over the documents.
        const getCursorRequest = toDoListStore.openCursor();
        // (Student Note): on success callback for our cursor request. The callback is a function that will get a result from the event target. If the result exists, it will console.log the result, if it doesn't exist then it will console.log a message. 
        //(Student Note): This should be able to allow us to update our data. 
        getCursorRequest.onsuccess = e => {
          const cursor = e.target.result;
          if (cursor) {
            console.log(cursor.value);
            cursor.continue();
          } else {
            console.log("No documents left!");
          }
        };
      };
/*
If we wanted to add a property of "urgent" to our list we would:
        getCursorRequest.onsuccess = e => {
          const cursor = e.target.result;
          if (cursor) {
            console.log(cursor.value);
            const todo = cursor.value; (which is equal to the value of the)
            todo.urgent = true;
            cursor.update(todo);
            cursor.continue();
          } else {
            console.log("No documents left!");
          }
        };

        const getRequest = todoListStore.get("1");
        getRequest.onsuccess = (e) => {
          console.log(getRequest.result);
        }
*/
/*
To change the value of a single item:
toDoListStore.put({
  listID: "1",
  status: "complete",
  dueTomorrow: true
});
*/