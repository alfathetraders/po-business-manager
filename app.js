let items = []


// PAGE SWITCH

function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.classList.add("hidden")
})

document.getElementById(page).classList.remove("hidden")

if(page==="records"){
loadRecords()
}

}



// CALCULATE

function calculate(){

let poAmount=parseFloat(document.getElementById("amount").value)||0
let investment=parseFloat(document.getElementById("investment").value)||0
let extra=parseFloat(document.getElementById("extra").value)||0

let base=poAmount/1.18
let gst=poAmount-base

let incomeTax=poAmount*0.055
let govtGST=gst*0.20

let checkAmount=poAmount-incomeTax-govtGST

let profit=checkAmount-investment-extra

document.getElementById("result").innerHTML=
"Check Amount: "+checkAmount.toFixed(2)+"<br>"+
"Profit: "+profit.toFixed(2)

}



// ADD ITEM

function addItem(){

let item={

name:document.getElementById("itemName").value,
spec:document.getElementById("itemSpec").value,
unit:document.getElementById("itemUnit").value,
pack:document.getElementById("itemPack").value,
qty:document.getElementById("itemQty").value,
rate:document.getElementById("itemRate").value

}

items.push(item)

renderItems()

}



// RENDER ITEMS

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

<td><button onclick="deleteItem(${i})">Delete</button></td>

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

let poList = JSON.parse(localStorage.getItem("poList")) || []

let number=document.getElementById("poNumber").value
let client=document.getElementById("client").value
let department=document.getElementById("department").value

let amount=parseFloat(document.getElementById("amount").value)||0
let investment=parseFloat(document.getElementById("investment").value)||0
let extra=parseFloat(document.getElementById("extra").value)||0

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


alert("PO Saved Successfully")

items=[]
renderItems()

loadRecords()

}



// LOAD RECORDS

function loadRecords(){

let poList = JSON.parse(localStorage.getItem("poList")) || []

let table=document.getElementById("tableBody")

if(!table) return

table.innerHTML=""

let totalProfit=0


poList.forEach(po=>{

totalProfit+=po.profit

table.innerHTML+=`

<tr>

<td>${po.number}</td>

<td>${po.client}</td>

<td>${po.amount}</td>

<td>${po.check.toFixed(2)}</td>

<td>${po.investment}</td>

<td>${po.extra}</td>

<td>${po.profit.toFixed(2)}</td>

</tr>

`

})


let totalPO=document.getElementById("totalPO")
let totalProfitEl=document.getElementById("totalProfit")

if(totalPO) totalPO.innerText=poList.length
if(totalProfitEl) totalProfitEl.innerText=totalProfit.toFixed(2)

}



// PAGE LOAD

document.addEventListener("DOMContentLoaded",function(){

loadRecords()

})
