/ GLOBAL DATA

let poList = JSON.parse(localStorage.getItem("poList")) || []

let items = []


// PAGE NAVIGATION

function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.classList.add("hidden")
})

document.getElementById(page).classList.remove("hidden")

if(page==="records"){
loadRecords()
}

if(page==="dashboard"){
loadDashboard()
}

}



// CALCULATION SYSTEM

function calculate(){

let poAmount=parseFloat(document.getElementById("amount").value)||0
let investment=parseFloat(document.getElementById("investment").value)||0
let extra=parseFloat(document.getElementById("extra").value)||0


// GST INCLUDED SYSTEM

let base=poAmount/1.18
let gst=poAmount-base


// TAXES

let incomeTax=poAmount*0.055
let govtGST=gst*0.20


// CHECK AMOUNT

let checkAmount=poAmount-incomeTax-govtGST


// PROFIT

let profit=checkAmount-investment-extra


document.getElementById("result").innerHTML=

"Base Amount: "+base.toFixed(2)+"<br>"+
"GST Included: "+gst.toFixed(2)+"<br>"+
"Income Tax (5.5%): "+incomeTax.toFixed(2)+"<br>"+
"Govt GST Share (20%): "+govtGST.toFixed(2)+"<br>"+
"Check Amount: "+checkAmount.toFixed(2)+"<br>"+
"Final Profit: "+profit.toFixed(2)

}



// ITEM ADD

function addItem(){

let item={

name:document.getElementById("itemName").value,

spec:document.getElementById("itemSpec").value,

unit:document.getElementById("itemUnit").value,

pack:document.getElementById("itemPack").value,

qty:parseFloat(document.getElementById("itemQty").value)||0,

rate:parseFloat(document.getElementById("itemRate").value)||0

}

items.push(item)

renderItems()

clearItemFields()

}



// CLEAR ITEM INPUT

function clearItemFields(){

document.getElementById("itemName").value=""
document.getElementById("itemSpec").value=""
document.getElementById("itemUnit").value=""
document.getElementById("itemPack").value=""
document.getElementById("itemQty").value=""
document.getElementById("itemRate").value=""

}



// RENDER ITEMS

function renderItems(){

let table=document.getElementById("itemsTable")

if(!table) return

table.innerHTML=""

items.forEach((it,i)=>{

let amount=it.qty*it.rate

table.innerHTML+=`

<tr>

<td>${it.name}</td>
<td>${it.spec}</td>
<td>${it.unit}</td>
<td>${it.pack}</td>
<td>${it.qty}</td>
<td>${it.rate}</td>
<td>${amount}</td>

<td>

<button onclick="deleteItem(${i})">Delete</button>

</td>

</tr>

`

})

}



// DELETE ITEM

function deleteItem(i){

items.splice(i,1)

renderItems()

}



// SAVE PO

function savePO(){

let number=document.getElementById("poNumber").value
let client=document.getElementById("client").value
let department=document.getElementById("department").value

let amount=parseFloat(document.getElementById("amount").value)||0
let investment=parseFloat(document.getElementById("investment").value)||0
let extra=parseFloat(document.getElementById("extra").value)||0


// GST INCLUDED CALC

let base=amount/1.18
let gst=amount-base

let incomeTax=amount*0.055
let govtGST=gst*0.20

let checkAmount=amount-incomeTax-govtGST

let profit=checkAmount-investment-extra


let po={

number:number,
client:client,
department:department,

amount:amount,
check:checkAmount,

investment:investment,
extra:extra,

profit:profit,

items:items,

date:new Date().toLocaleDateString()

}


poList.push(po)

localStorage.setItem("poList",JSON.stringify(poList))


items=[]

renderItems()

clearPOForm()

alert("PO Saved Successfully")

loadRecords()

loadDashboard()

}



// CLEAR FORM

function clearPOForm(){

document.getElementById("poNumber").value=""
document.getElementById("client").value=""
document.getElementById("department").value=""
document.getElementById("amount").value=""
document.getElementById("investment").value=""
document.getElementById("extra").value=""

}



// LOAD RECORDS

function loadRecords(){

poList = JSON.parse(localStorage.getItem("poList")) || []

let table=document.getElementById("tableBody")

if(!table) return

table.innerHTML=""

poList.forEach((po,i)=>{

table.innerHTML+=`

<tr>

<td>${po.number}</td>

<td>${po.client}</td>

<td>${po.amount}</td>

<td>${po.check.toFixed(2)}</td>

<td>${po.investment}</td>

<td>${po.extra}</td>

<td>${po.profit.toFixed(2)}</td>

<td>${po.date}</td>

<td>

<button onclick="openBill(${i})">Bill</button>

<button onclick="openInvoice(${i})">Invoice</button>

<button onclick="openDC(${i})">DC</button>

</td>

</tr>

`

})

}



// DASHBOARD

function loadDashboard(){

let totalPO=poList.length

let totalProfit=0

poList.forEach(po=>{
totalProfit+=po.profit
})

let poEl=document.getElementById("totalPO")
let profitEl=document.getElementById("totalProfit")

if(poEl) poEl.innerText=totalPO
if(profitEl) profitEl.innerText=totalProfit.toFixed(2)

}



// BILL OPEN

function openBill(i){

localStorage.setItem("selectedPO",JSON.stringify(poList[i]))

window.open("bill.html")

}



// INVOICE OPEN

function openInvoice(i){

localStorage.setItem("selectedPO",JSON.stringify(poList[i]))

window.open("stinvoice.html")

}



// DELIVERY CHALLAN

function openDC(i){

localStorage.setItem("selectedPO",JSON.stringify(poList[i]))

window.open("dc.html")

}



// INITIAL LOAD

document.addEventListener("DOMContentLoaded",function(){

loadRecords()

loadDashboard()

})
