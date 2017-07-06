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

function GUID() {
  return Math.random().toString(16).substr(2, 10);
}

function allowDrop(e) {
	//alert("allowDrop");
	e.preventDefault();
	//alert(e.target.id);
}

function dragStart(e) {
  //alert(JSON.stringify(e));
	//alert(this.id);
  this.style.opacity = "0.5";
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('liID', e.target.id);
}
function dragEnd(e) {
  this.style.opacity = "1";
}
function dragEnter(e) {
  e.target.style.border = "1px dotted red";
}
function dragLeave(e) {
  e.target.style.border = "";
}
function drop(e) {
  // Don't do anything if dropping the same column we're dragging.
    // Set the source column's HTML to the HTML of the column we dropped on.
    // dragElement.innerHTML = this.innerHTML;
    // this.innerHTML = e.dataTransfer.getData('text/html');
		event.preventDefault();
		e.target.style.border = "";
		var data = e.dataTransfer.getData("liID");
		var UL = document.getElementById(e.target.parentNode.id);
	  UL.insertBefore(document.getElementById(data),e.target);
		var targetLI = e.target.id;
		var targetLITag = todoList[targetLI].tag;
		var dragItem = todoList[data];
		dragItem.tag = targetLITag;
		saveListItem(dragItem, false);

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
  listLI.draggable = "true"; //make draggable
  listLI.addEventListener("dragstart", dragStart); //make opacity 0.5 to show drag
	listLI.addEventListener("dragend", dragEnd); //make opacity 0.5 to show drag
	listLI.addEventListener("dragenter", dragEnter);
	listLI.addEventListener("dragleave", dragLeave);
  //listLI.addEventListener("drop", drop);//make opacity 0.5 to show drag
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
  $.post(saveURL, JSON.stringify(item), function(response) {
      if (is_new == true) {
				todoList[item.id] = item;///check drag for new one
        updateDisplay(item);
        //counter = counter + 1;
      }
    })
    .fail(function() {
      alert("Oops something went wrong! Cannot add todo item. Please try again.");
    });

}

function loadData() {
  var getURL = api.getSearchAPI();
  $.get(getURL, function(response) {
      //$('#result').text(JSON.stringify(response));
      var result = JSON.parse(JSON.stringify(response));
      $.each(result.hits.hits, function(key, value) {
        var source = value._source;
        var item = new ToDo(source.todo, source.create_time, source.completed, source.tag, source.id);
        updateDisplay(item);
				todoList[source.id] = item; //store dataset for later
      });
    })
    .fail(function() {
      alert("Ooops! Unable to load data!");
    });
}

// api uri
var api = new API("localhost", "9200", "todo", "list3");
var todoList = {};
loadData();
