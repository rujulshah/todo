class API {
	constructor(host, port, index_name, type_name) {
		this.host = host;
		this.port = port;
		this.index_name = index_name;
		this.type_name = type_name;
	}

	getBaseAPI() {
		return "http://" + this.host + ":" + this.port + "/" + this.index_name + "/" + this.type_name;
	}

	getSearchAPI() {
		return this.getBaseAPI() + "/_search";
	}

	getCreateUpdateAPI(id) {
		return this.getBaseAPI() + "/" + id;
	}
}

class ToDo {
	constructor(todo, create_time, completed, tag, id) {
		this.todo = todo;
		this.create_time = create_time;
		this.completed = completed;
		this.tag = tag;
		this.id = id;
	}

	markCompleted() {
		this.completed = true;
	}

	unmarkCompleted() {
		this.completed = false;
	}
}

function GUID(){
	return Math.random().toString(16).substr(2, 10);
}

function saveIfEnterKey(e, day, element_id) {
	if (e.keyCode === 13) {
		addTodo(day, element_id);
	}
}

function addTodo(day, element_id) {
	// create tdo object
	var text_box = document.getElementById(element_id);
	var todo = new ToDo(text_box.value, Date.now(), false, day, GUID());
	// save to db & if successful update display
	saveListItem(todo, true);
	text_box.value = "";
}

function updateDisplay(todo) {
	var listUL = document.getElementById("list" + todo.tag + "UL"); 
	var listLI = document.createElement("li");
	var list_span = document.createElement("span");
	list_span.innerHTML = todo.todo;
	list_span.contentEditable = "true";
	listLI.id = todo.id; ///give id to each tag1
	var checkBox = document.createElement("input");
	checkBox.type = "checkbox";
	checkBox.checked = todo.completed;
	listLI.className = todo.completed == true ? "line" : "none";
	checkBox.onclick = function() {
		checkListItem(this, todo);
	};
	listLI.contenteditable = "true";
	listLI.appendChild(checkBox);
	listLI.appendChild(list_span);
	listUL.insertBefore(listLI, listUL.firstChild);
}


function checkListItem(cbox, todo) {
	var litag = document.getElementById(todo.id);
	var list_UL = document.getElementById("list" + todo.tag + "UL");

	var first = list_UL.firstChild;
	var last = list_UL.lastChild;
	if (cbox.checked == true) {
		litag.className = "line";
		todo.markCompleted();
		list_UL.insertBefore(litag, last.nextSibling);
	} else {
		litag.className = "none";
		todo.unmarkCompleted();
		list_UL.insertBefore(litag, first);
	}

	saveListItem(todo, false);
}

function saveListItem(item, is_new) {
	var saveURL = api.getCreateUpdateAPI(item.id);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && (this.status == 200 || this.status == 201)) {
			if (is_new == true) {
				updateDisplay(item);
				//counter = counter + 1;
			}
		} else if (this.status >= 400) {
			alert("Oops something went wrong! Cannot add todo item. Please try again.");
		}
	};
	xhttp.open("PUT", saveURL, true);
	xhttp.send(JSON.stringify(item));

}

function loadData() {
	var getURL = api.getSearchAPI();
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && (this.status == 200 || this.status == 201)) {
			var result = JSON.parse(xhttp.responseText);
			$.each(result.hits.hits, function(key, value) {
				var source = value._source;
				var item = new ToDo(source.todo, source.create_time, source.completed, source.tag, source.id);
				updateDisplay(item);

			});
			// if (result.hits.hits.length > 0) {
			// 	counter = result.hits.hits.length;
			// }
		}
	};
	xhttp.open("GET", getURL, true);
	xhttp.send();
}

// api uri
var api = new API("localhost", "9200", "todo", "list3");
//var counter = 0;
loadData();