/*
Name:Lu Yu
Course: CSC 337
Assignment:final assignment  
Description: This app will allow user to build memos. When the page loads, 
it will show an input box for the user to write the title of the memo and a 
button to save the memo. The saved memo will be shown on the page. 
The user will be able to add more memos. New memo will be added to the page, 
displayed on top of old memos. When the mouse hovers over an old memo, 
two options will appear. One option is to delete this memo. 
The other option is to add more information and set the date for this memo. 
All memos and its information will be saved to a txt file.
Files: final.html, final.css, final.js,final_service.js
*/
(function () {
    var iContent = document.getElementById("icontent");
    var tTitle = document.getElementById("task-title");
    var tDesc = document.getElementById("task-desc");
    var tDate = document.getElementById("tdate");
    var tSubmit = document.getElementById("tsubmit");
    var tDetail = document.getElementById("task-detail");
    var lContent = document.getElementById("list-content");
    var dAlert = document.getElementById("delete-alert");
    var dCancel = document.getElementById("delete-cancel");

    var dataArray = [];
    var lastId = 0;
    var deleteId = 0;
    var editId = 0;

    var EventHandler = (function () {
        function addHandler(element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
        }

        function removeHandler(element, type, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else if (element.detachEvent) {
                element.detachEvent("on" + type, handler);
            } else {
                element["on" + type] = null;
            }
        }

        function getEvent(event) {
            return event ? event : window.event;
        }

        function getTarget(event) {
            var event = getEvent(event);
            return event.target || event.srcElement;
        }



        return {
            "addHandler": addHandler,
            "removeHandler": removeHandler,
            "getEvent": getEvent,
            "getTarget": getTarget
        };
    })();


    function saveNote(title, desc) {
        var obj = {};
        obj.id = lastId;
        obj.title = title;
        obj.desc = "";
        obj.date = "";
        dataArray.push(obj);
        addNodesToTxt();
    }



    function getNoteById(id) {
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i].id == id) {
                return dataArray[i];
            }
        }
    }

    function addNoteToDOM(note, noteKey) {
        var date = note.date;
        var title = note.title;

        var liElement = document.createElement("li");
        liElement.classList.add("task-item");
        liElement.setAttribute("id", noteKey);
        var str = "";
        if (date!="") {
            str = ":" + date;
        }
        liElement.innerHTML = "<span class='content'>" + title + str+ "</span>" +
            "<span class='edit'></span>"+
            "<span class='delete'></span>";
        lContent.insertBefore(liElement, lContent.firstElementChild);
        return liElement;
    };

    function showAllNotes() {
        let url= "https://memoluyu.herokuapp.com";
        fetch(url)
            .then(checkStatus)
            .then(function(responseText){
                let data = JSON.parse(responseText);
                console.log(data);
                for (var j = 0; j < data.length; j++) {
                    data[j].id = data[j].id.replace('"', '');
                    data[j].id = data[j].id.replace('"', '');
                    data[j].title = data[j].title.replace('"', '');
                    data[j].title = data[j].title.replace('"', '');
                    data[j].desc = data[j].desc.replace('"', '');
                    data[j].desc = data[j].desc.replace('"', '');
                    data[j].date = data[j].date.replace('"', '');
                    data[j].date = data[j].date.replace('"', '');
                    data[j].date = data[j].date.replace('}', '');
                    data[j].date = data[j].date.replace('\r', '');
                }

                dataArray = data;
                for (var i = 0; i < data.length; i++) {
                    if (lastId <= data[i].id) {
                        lastId = parseInt(data[i].id) + 1;
                    }
                    key = data[i].id;
                    note = data[i];
                    var liElement = addNoteToDOM(note, key);
                }

            })

            .catch(function(error){
                console.log(error);
            });
    }

    function save() {
        var title = iContent.value;
        if (title.trim() !== "") {
            saveNote(title, "");
            iContent.classList.remove("invalid");
            iContent.setAttribute("placeholder", "Enter the content");
        } else {
            iContent.classList.add("invalid");
            iContent.setAttribute("placeholder", "Content is empty. Reenter.");
        }
        iContent.value = "";
    }

    function deleteNote(e) {
        var target = EventHandler.getTarget(e);

        if (target.className !== "delete") {
            return;
        }
        deleteId = target.parentNode.id;
        dAlert.classList.add("show");
    }

    function editNote(e) {

        var target = EventHandler.getTarget(e),
            noteID = target.parentNode.id;
        editId = noteID;

        if (target.className !== "edit") {
            return;
        }

        tDetail.classList.add("show");
        var note = getNoteById(noteID);
        tTitle.innerHTML = note.title;
        tDesc.value = note.desc;
        note.date = note.date.replace("}", "");
        note.date = note.date.replace('"', '');
        note.date = note.date.replace('"', '');
        tDate.value = note.date;


    }

    EventHandler.addHandler(tSubmit, "click", save);
    EventHandler.addHandler(lContent, "click", deleteNote);
    EventHandler.addHandler(lContent, "click", editNote);
    EventHandler.addHandler(dCancel, "click", function () {
        dAlert.classList.remove("show");
    });

    $("#delete-confirm").on("click", function () {
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i].id === deleteId) {
                dataArray.splice(i, 1);
                break;
            }
        }
        addNodesToTxt();
    });

    showAllNotes();

    //edit the content
    $("#confirm").on("click", function () {
        for (var i = 0; i < dataArray.length; i++) {
            if (editId == dataArray[i].id) {
                dataArray[i].desc = tDesc.value;
                dataArray[i].date = tDate.value;
            }
        }
        addNodesToTxt();
        tDetail.classList.remove("show");
    });

    //close the edit area
    $("#cancel").on("click", function () {
        tDetail.classList.remove("show");
    });


    //add to txt
    function addNodesToTxt() {
        var content = JSON.stringify(dataArray);
        console.log(content);

        var url="https://memoluyu.herokuapp.com";
        const fetchOptions = {
            method : 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({ mode: "Write", content: content })
            //body : JSON.stringify({"text" : "hello"})
            
        };
        fetch(url, fetchOptions)
            .then(checkStatus)
            .then(function(responseText){
                //let data = JSON.parse(responseText);
                console.log(responseText);
                 location.reload();

            })

            .catch(function(error){
                console.log(error);
            });
    };

    function checkStatus(response) {  
    if (response.status >= 200 && response.status < 300) {  
        return response.text();
    } else if (response.status == 404) {
        // sends back a different error when we have a 404 than when we have
        // a different error
        return Promise.reject(new Error("Sorry, we couldn't find that page")); 
    } else {  
        return Promise.reject(new Error(response.status+": "+response.statusText)); 
    } 
}

})();
