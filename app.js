let poList = JSON.parse(localStorage.getItem("poList")) || []



function showPage(page){

document.querySelectorAll(".page").forEach(function(p){

p.style.display="none"

})

document.getElementById(page).style.display="block"

if(page==="records"){
loadRecords()
}

if(page==="dashboard"){
loadDashboard()
}

}



function calculate(){

let po=parseFloat(document.getElementById("amount").value)||0
let investment=parseFloat(document.getElementById("investment").value)||0
let extra=parseFloat(document.getElementById("extra").value)||0


let base=po/1.18
let gst=po-base

let incomeTax=po*0.055
let govtGST=gst*0.20

let check=po-incomeTax-govtGST

let profit=check-investment-extra


document.getElementById("result").innerHTML=

"Check Amount: "+check.toFixed(2)+…
[5:49 pm, 11/03/2026] MSQ: let poList = JSON.parse(localStorage.getItem("poList")) || [];


// PAGE SWITCH SYSTEM

function showPage(page){

document.querySelectorAll(".page").forEach(function(p){
p.style.display="none";
});

let selected=document.getElementById(page);

if(selected){
selected.style.display="block";
}

if(page==="records"){
loadRecords();
}

if(page==="dashboard"){
loadDashboard();
}

}



// CALCULATE PROFIT

function calculate(){

let po=parseFloat(document.getElementById("amount").value)||0;
let investment=parseFloat(document.getElementById("investment").value)||0;
let extra=parseFloat(document.getElementById("extra").value)||0;


// GST already included

let base=po/1.18;
let gst=po-base;


// Income tax 5.5%

let incomeTax=po*0.055;


// GST govt share 20%

let govtGST=gst*0.20;


// Final check amount

let check=po-incomeTax-govtGST;


// profit

let profit=check-investment-extra;


document.getElementById("result").innerHTML=

"Check Amount: "+check.toFixed(2)+"<br>"+
"Profit: "+profit.toFixed(2);

}



// SAVE PO

function savePO(){

let number=document.getElementById("poNumber").value;
let client=document.getElementById("client").value;
let department=document.getElementById("department").value;

let amount=parseFloat(document.getElementById("amount").value)||0;
let investment=parseFloat(document.getElementById("investment").value)||0;
let extra=parseFloat(document.getElementById("extra").value)||0;


let base=amount/1.18;
let gst=amount-base;

let incomeTax=amount*0.055;

let govtGST=gst*0.20;

let check=amount-incomeTax-govtGST;

let profit=check-investment-extra;


let po={

number:number,
client:client,
department:department,
amount:amount,
check:check,
investment:investment,
extra:extra,
profit:profit,
date:new Date().toLocaleDateString()

};


poList.push(po);


// SAVE DATA

localStorage.setItem("poList",JSON.stringify(poList));


alert("PO Saved Successfully");


// REFRESH

loadRecords();
loadDashboard();

}



// LOAD RECORDS

function loadRecords(){

poList = JSON.parse(localStorage.getItem("poList")) || [];

let table=document.getElementById("tableBody");

if(!table){
return;
}

table.innerHTML="";


poList.forEach(function(po,i){

table.innerHTML += `

<tr>

<td>${po.number}</td>

<td>${po.client}</td>

<td>${po.amount}</td>

<td>${po.check.toFixed(2)}</td>

<td>${po.investment}</td>

<td>${po.extra}</td>

<td>${po.profit.toFixed(2)}</td>

<td>${po.date}</td>

</tr>

`;

});

}



// DASHBOARD

function loadDashboard(){

poList = JSON.parse(localStorage.getItem("poList")) || [];

let totalPO=poList.length;

let totalProfit=0;


poList.forEach(function(po){

totalProfit+=po.profit;

});


let poElement=document.getElementById("totalPO");
let profitElement=document.getElementById("totalProfit");


if(poElement){
poElement.innerText=totalPO;
}

if(profitElement){
profitElement.innerText=totalProfit.toFixed(2);
}

}



// INITIAL LOAD

document.addEventListener("DOMContentLoaded",function(){

showPage("dashboard");

loadRecords();

loadDashboard();

});
