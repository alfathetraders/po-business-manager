let poList = JSON.parse(localStorage.getItem("poList") || "[]")

let items=[]

function showPage(page){

document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"))

document.getElementById(page).classList.remove("hidden")

}

function calculate(){

let poAmount=parseFloat(document.getElementById("amount").value)||0

let investment=parseFloat(document.getElementById("investment").value)||0

let base=poAmount/1.18

let gst=poAmount-base

let incomeTax=poAmount*0.055

let govtGST=gst*0.20

let checkAmount=poAmount-incomeTax-govtGST

let profit=checkAmount-investment

document.getElementById("result").innerHTML=

"Check Amount: "+checkAmount.toFixed(2)+"<br>"+

"Profit: "+profit.toFixed(2)

}

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

}

function renderItems(){

let table=document.getElementById("itemsTable")

table.innerHTML=""

items.forEach((it,i)=>{

table.innerHTML+=`

<tr>

<td>${it.name}</td>

<td>${it.spec}</td>

<td>${it.unit}</td>

<td>${it.pack}</td>

<td>${it.qty}</td>

<td>${it.rate}</td>

<td><button onclick="removeItem(${i})">X</button></td>

</tr>

`

})

}

function removeItem(i){

items.splice(i,1)

renderItems()

}

function savePO(){

let poAmount=parseFloat(document.getElementById("amount").value)||0

let investment=parseFloat(document.getElementById("investment").value)||0

let base=poAmount/1.18

let gst=poAmount-base

let incomeTax=poAmount*0.055

let govtGST=gst*0.20

let checkAmount=poAmount-incomeTax-govtGST

let profit=checkAmount-investment

let po={

number:document.getElementById("poNumber").value,

client:document.getElementById("client").value,

department:document.getElementById("department").value,

amount:poAmount,

check:checkAmount,

investment:investment,

profit:profit,

items:items

}

poList.push(po)

localStorage.setItem("poList",JSON.stringify(poList))

items=[]

renderItems()

loadTable()

}

function loadTable(){

let table=document.getElementById("tableBody")

table.innerHTML=""

let totalProfit=0

poList.forEach((po,i)=>{

totalProfit+=po.profit

table.innerHTML+=`

<tr>

<td>${po.number}</td>

<td>${po.client}</td>

<td>${po.amount}</td>

<td>${po.check.toFixed(2)}</td>

<td>${po.investment}</td>

<td>${po.profit.toFixed(2)}</td>

<td>

<button onclick="openBill(${i})">Bill</button>

<button onclick="openInvoice(${i})">Invoice</button>

<button onclick="openDC(${i})">DC</button>

</td>

</tr>

`

})

document.getElementById("totalPO").innerText=poList.length

document.getElementById("totalProfit").innerText=totalProfit.toFixed(2)

}

function openBill(i){

localStorage.setItem("selectedPO",JSON.stringify(poList[i]))

window.open("bill.html")

}

function openInvoice(i){

localStorage.setItem("selectedPO",JSON.stringify(poList[i]))

window.open("stinvoice.html")

}

function openDC(i){

localStorage.setItem("selectedPO",JSON.stringify(poList[i]))

window.open("dc.html")

}

loadTable()
