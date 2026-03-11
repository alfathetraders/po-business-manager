let poList = JSON.parse(localStorage.getItem("poList")) || []


function showPage(page){

document.querySelectorAll(".page").forEach(function(p){
p.classList.add("hidden")
})

document.getElementById(page).classList.remove("hidden")

if(page === "records"){
loadRecords()
}

if(page === "dashboard"){
loadDashboard()
}

}



function calculate(){

let po = parseFloat(document.getElementById("amount").value) || 0
let investment = parseFloat(document.getElementById("investment").value) || 0
let extra = parseFloat(document.getElementById("extra").value) || 0

let base = po / 1.18
let gst = po - base

let incomeTax = po * 0.055
let govtGST = gst * 0.20

let check = po - incomeTax - govtGST

let profit = check - investment - extra

document.getElementById("result").innerHTML =
"Check Amount: " + check.toFixed(2) + "<br>" +
"Profit: " + profit.toFixed(2)

}



function savePO(){

let number = document.getElementById("poNumber").value
let client = document.getElementById("client").value
let department = document.getElementById("department").value

let amount = parseFloat(document.getElementById("amount").value) || 0
let investment = parseFloat(document.getElementById("investment").value) || 0
let extra = parseFloat(document.getElementById("extra").value) || 0


let base = amount / 1.18
let gst = amount - base

let incomeTax = amount * 0.055
let govtGST = gst * 0.20

let check = amount - incomeTax - govtGST

let profit = check - investment - extra


let po = {

number: number,
client: client,
department: department,
amount: amount,
check: check,
investment: investment,
extra: extra,
profit: profit

}


poList.push(po)

localStorage.setItem("poList", JSON.stringify(poList))

alert("PO Saved")

loadRecords()
loadDashboard()

showPage("records")

}



function loadRecords(){

let poList = JSON.parse(localStorage.getItem("poList")) || []

let table = document.getElementById("tableBody")

if(!table){
return
}

table.innerHTML = ""

poList.forEach(function(po){

table.innerHTML += `
<tr>
<td>${po.number}</td>
<td>${po.client}</td>
<td>${po.amount}</td>
<td>${po.check.toFixed(2)}</td>
<td>${po.investment}</td>
<td>${po.extra}</td>
<td>${(po.profit || 0).toFixed(2)}</td>
<td><button onclick="deletePO(${index})">Delete</button></td>
</tr>
`

})

}



function loadDashboard(){

let poList = JSON.parse(localStorage.getItem("poList")) || []

let totalPO = poList.length

let totalProfit = 0

poList.forEach(function(po){
totalProfit += po.profit
})

document.getElementById("totalPO").innerText = totalPO
document.getElementById("totalProfit").innerText = totalProfit.toFixed(2)

}



document.addEventListener("DOMContentLoaded",function(){

loadDashboard()
loadRecords()

showPage("dashboard")

})
