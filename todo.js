//var listNum = 0;
var toDoTodayList =[];
var toDoTomorrowList =[];
var toDoSomedayList =[];

function save(e,day){
	if(e.keyCode === 13){
		addToList(day);
	}
}

function addToList(day){
	var listValue;
	var listDate; 
	var listItem;
	var dateAdded = Date.now();
	var completed = false;
	var position;
	switch (day){
		case 'TDY':
			listValue = document.getElementById("listTDYValue");
			listItem = [listValue.value,dateAdded,completed];
			toDoTodayList.push(listItem);
			position = toDoTodayList.length- 1;
			break;
		case 'TMR':
			listValue = document.getElementById("listTMRValue");
			listItem = [listValue.value,dateAdded,completed];
			toDoTomorrowList.push(listItem);
			position = toDoTomorrowList.length - 1;
			break;
		case 'SDY':
			listValue = document.getElementById("listSDYValue");
			listItem = [listValue.value,dateAdded,completed];
			toDoSomedayList.push(listItem);
			position = toDoSomedayList.length - 1;
			break;
	}

	listValue.value = "";
	//alert(toDoList);
	diplayList(listItem,day,position);
	//listNum++;
}

function diplayList(listItem,day,i){
	var listUL = document.getElementById("list"+day+"UL");
	var listLI = document.createElement("li");
	listLI.id = "li_"+day+"_"+i; ///give id to each tag
	var checkBox = document.createElement("input");
	checkBox.type = "checkbox";
	checkBox.onclick = function(){checkListItem(i,day)};
	listLI.appendChild(checkBox);
	listLI.appendChild(document.createTextNode(listItem[0]));
	listUL.appendChild(listLI);
}

function checkListItem(i,day){
	var strike;
	var litag = document.getElementById("li_"+day+"_"+i);
	litag.className = "line";
	switch (day){		
		case 'TDY':
			strike = toDoTodayList[i];			
			break;
		case 'TMR':
			strike = toDoTomorrowList[i];
			break;
		case 'SDY':
			strike = toDoSomedayList[i];
			break;
	}
	strike[2] = true;
	///alert(strike);
}

/*
var todoApp {
	items: []
	item: {
		time:
		completed:
		tag:
	}

	function markCompleted(item) {
		item.completed = true;
	}

	function add(item) {
		items.add(item);
	}
}*/
