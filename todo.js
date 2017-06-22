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
	switch (day){
		case 'TDY':
			listValue = document.getElementById("listTDYValue");
			listItem = [listValue.value,Date.now()];
			toDoTodayList.push(listItem);
			break;
		case 'TMR':
			listValue = document.getElementById("listTMRValue");
			listItem = [listValue.value,Date.now()];
			toDoTomorrowList.push(listItem);
			break;
		case 'SDY':
			listValue = document.getElementById("listSDYValue");
			listItem = [listValue.value,Date.now()];
			toDoSomedayList.push(listItem);
			break;
	}

	listValue.value = "";
	//alert(toDoList);
	diplayList(listItem,day);
	//listNum++;
}

function diplayList(listItem,day){
	var listUL = document.getElementById("list"+day+"UL");
	var listLI = document.createElement("li");
	listLI.appendChild(document.createTextNode(listItem[0]));
	listUL.appendChild(listLI);
}

