document.getElementById('AllWebSItesLogout').addEventListener('click', LogOutAllwebSites);

function LogOutAllwebSites()
{
	if(localStorage["ShowMsg"]=="N")
	{
		if(localStorage["AutoLogoutAll"]=="" || localStorage["AutoLogoutAll"]=="N" || localStorage["AutoLogoutAll"]==null)
			{
				localStorage["AutoLogoutAll"]="Y";
			}
			else
			{
				localStorage["AutoLogoutAll"]="N";
			}
			localStorage["ShowMsg"]="Y";
	}
	else{
			if(localStorage["AutoLogoutAll"]=="" || localStorage["AutoLogoutAll"]=="N" || localStorage["AutoLogoutAll"]==null)
			{
		//		var r = confirm("You will be logged out of all websites from Chrome. Are you sure?");
			//	if (r == true) {
					localStorage["AutoLogoutAll"]="Y";
			//	}
			}
			else
			{
				localStorage["AutoLogoutAll"]="N";
			}
		}	
			var yourUl = document.getElementById("AutoLogoutListDiv");
			yourUl.style.display = yourUl.style.display === 'none' ? '' : 'none';
}

var checkLoad = function() {   
    document.readyState !== "complete" ? setTimeout(checkLoad,11) : SetLocalStorageValue();   
};  
checkLoad(); 

function SetLocalStorageValue()
{
		document.getElementById("data-policy").checked = false;
		if(localStorage["AutoLogoutAll"]!="" && localStorage["AutoLogoutAll"]!="N" && localStorage["AutoLogoutAll"]!=null){
			localStorage["AutoLogoutAll"]="N";
			localStorage["ShowMsg"]="N";
			document.getElementById('AllWebSItesLogout').click();
		}
		if(localStorage["AutoLogoutAllWebSitesList"]!="" && localStorage["AutoLogoutAllWebSitesList"]!=null)
		{
			var AutoLogoutWebsitesList=localStorage["AutoLogoutAllWebSitesList"].split(";");
			for (var i = 0; i < AutoLogoutWebsitesList.length; i++) {
				if(AutoLogoutWebsitesList[i]!=null && AutoLogoutWebsitesList[i]!=""){
					addRowWithURL(AutoLogoutWebsitesList[i]);
				}
				
			}
		}
		else
		{
			//addRowWithURL("");
		}
}

function addRowWithURL(URL) {  
	var tableId="dataTable";
       var table = document.getElementById(tableId);  
       var listCount = document.getElementById('hdnListCount').value;  
       var rowCount = table.rows.length;  
         var row = table.insertRow(rowCount);  
         // Column 2  
         var cell2 = row.insertCell(0);  
         var txtId = "txtDonationAmount" + ((rowCount - 1) + 1);  
         var element2 = document.createElement("input");  
         element2.setAttribute('id', txtId);  
         element2.type = "text";  
         element2.setAttribute('value', URL);  
         cell2.appendChild(element2);  
         // Column 3  
         var cell3 = row.insertCell(1);  
         var btnId = "btnDeleteTable" + ((rowCount - 1) + 1);  
         var element3 = document.createElement("input");  
         element3.setAttribute('id', btnId);  
         element3.type = "button";  
         element3.setAttribute('value', 'Delete');  
         element3.onclick = function() { removeRow(btnId); };  
         cell3.appendChild(element3);  
}  

function addRow() {  
	var tableId="dataTable";
       var table = document.getElementById(tableId);  
       var listCount = document.getElementById('hdnListCount').value;  
       var rowCount = table.rows.length;  
         var row = table.insertRow(rowCount);  
         // Column 2  
         var cell2 = row.insertCell(0);  
         var txtId = "txtDonationAmount" + ((rowCount - 1) + 1);  
         var element2 = document.createElement("input");  
         element2.setAttribute('id', txtId);  
         element2.type = "text";  
         element2.setAttribute('value', "");  
         cell2.appendChild(element2);  
         // Column 3  
         var cell3 = row.insertCell(1);  
         var btnId = "btnDeleteTable" + ((rowCount - 1) + 1);  
         var element3 = document.createElement("input");  
         element3.setAttribute('id', btnId);  
         element3.type = "button";  
         element3.setAttribute('value', 'Delete');  
         element3.onclick = function() { removeRow(btnId); };  
         cell3.appendChild(element3);  
}  
     function removeRow(btnDelete) {  
	   var table = document.getElementById('dataTable');  
       var rowCount = table.rows.length;  
       for (var i = 0; i < rowCount; i++) {  
         var row = table.rows[i];  
         var rowObj = row.cells[1].childNodes[0];  
         if (rowObj.id == btnDelete) {  
           table.deleteRow(i);  
           rowCount--;  
         }  
       }  
     }  
	 
	 function saveDetail() { 
var r = confirm("All these websites will be logged out of chrome each time you close chrome?Are you sure you want to save these websites to your Log out list?");
	if (r == true) {
	   var WebSiteList="";	 
       var table = document.getElementById('dataTable');  
       var rowCount = table.rows.length;  
       var rowState = "";  
       if (rowCount > 1) {  
         for (var i = 1; i <= rowCount-1; i++) {  
           var row = table.rows[i];  
		   WebSiteList+=row.cells[0].childNodes[0].value+";";
           }  
		}
		localStorage["AutoLogoutAllWebSitesList"]=WebSiteList;
		alert("Auto Log out list saved!");
	 }
} 
document.getElementById('AddMore').addEventListener('click', addRow);
document.getElementById('btnSave').addEventListener('click', saveDetail);
	 
