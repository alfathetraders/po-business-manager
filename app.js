let poList = JSON.parse(localStorage.getItem("poList") || "[]")

let items=[]

function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.classList.add("hidden")
})

document.getElementById(page).classList.remove("hidden")

}

function calculate(){

let amount=parseFloat(document.getElementById("amount").value)||0
let investment=parseFloat(document.getElementById("investment").value)||0

let profit=amount-investment

document.getElementById("result").innerText="Profit: "+profit.toFixed(2)

}

function addItem(){

let name=document.getElementById("itemName").value
let spec=document.getElementById("itemSpec").value
let unit=document.getElementById("itemUnit").value
let pack=document.getElementById("itemPack").value
let qty=parseFloat(document.getElementById("itemQty").value)||0
let rate=parseFloat(document.getElementById("itemRate").value)||0

let item={
name:name,
spec:spec,
unit:unit,
pack:pack,
qty:qty,
rate:rate
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

let number=document.getElementById("poNumber").value
let client=document.getElementById("client").value
let department=document.getElementById("department").value
let amount=parseFloat(document.getElementById("amount").value)||0
let investment=parseFloat(document.getElementById("investment").value)||0

let profit=amount-investment

let po={
number:number,
client:client,
department:department,
amount:amount,
investment:investment,
profit:profit,
items:items
}

poList.push(po)

localStorage.setItem("poList",JSON.stringify(poList))

items=[]

renderItems()

loadTable()

alert("PO Saved")

}

function loadTable(){

let table=document.getElementById("tableBody")

if(!table) return

table.innerHTML=""

poList.forEach((po,index)=>{

table.innerHTML+=`

<tr>

<td>${po.number}</td>
<td>${po.client}</td>
<td>${po.amount}</td>
<td>${po.investment}</td>
<td>${po.profit}</td>

<td>

<button onclick="openBill(${index})">Bill</button>

<button onclick="openInvoice(${index})">Sales Tax Invoice</button>

<button onclick="openDC(${index})">Delivery Challan</button>

</td>

</tr>

`

})

document.getElementById("totalPO").innerText=poList.length

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
