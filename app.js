let poList = JSON.parse(localStorage.getItem("poList") || "[]")

let items=[]



function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.classList.add("hidden")
})

document.getElementById(page).classList.remove("hidden")

if(page==="records"){
loadRecords()
}

}



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



function deleteItem(i){

items.splice(i,1)

renderItems()

}



function savePO(){

let po={

number:document.getElementById("poNumber").value,

client:document.getElementById("client").value,

department:document.getElementById("department").value,

amount:parseFloat(document.getElementById("amount").value)||0,

investment:parseFloat(document.getElementById("investment").value)||0,

extra:parseFloat(document.getElementById("extra").value)||0

}



let base=po.amount/1.18

let gst=po.amount-base

let incomeTax=po.amount*0.055

let govtGST=gst*0.20

po.check=po.amount-incomeTax-govtGST

po.profit=po.check-po.investment-po.extra

po.items=items


poList.push(po)

localStorage.setItem("poList",JSON.stringify(poList))


items=[]

renderItems()


alert("PO Saved Successfully")


loadRecords()

}



function loadRecords(){

poList = JSON.parse(localStorage.getItem("poList") || "[]")

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


document.getElementById("totalPO").innerText=poList.length

document.getElementById("totalProfit").innerText=totalProfit.toFixed(2)

}



document.addEventListener("DOMContentLoaded",function(){

loadRecords()

})
