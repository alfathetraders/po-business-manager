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
let roi = 0
if(investment > 0){
roi = (profit / investment) * 100
}

document.getElementById("result").innerHTML =
"Check Amount: " + check.toFixed(2) + "<br>" +
"Profit: " + profit.toFixed(2) + "<br>" +
"Investment ROI: " + roi.toFixed(2) + "%"

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
let roi = 0
if(investment > 0){
roi = (profit / investment) * 100
}


let po = {
  number: number,
  client: client,
  department: department,
  amount: amount,
  check: check,
  investment: investment,
  extra: extra,
  profit: profit,
  roi: roi
};

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

poList.forEach(function(po,index){

let roi = 0
if(po.investment > 0){
roi = (po.profit / po.investment) * 100
}

table.innerHTML += `
<tr>
<td>${po.number}</td>
<td>${po.client}</td>
<td>${po.amount}</td>
<td>${po.check.toFixed(2)}</td>
<td>${po.investment}</td>
<td>${po.extra}</td>
<td>${(po.profit || 0).toFixed(2)}</td>

<td>
<button onclick="editPO(${index})">Edit</button>
<button onclick="deletePO(${index})">Delete</button>
</td>

<td>${roi.toFixed(2)}%</td>

</tr>
`
})
}



function loadDashboard(){

let poList = JSON.parse(localStorage.getItem("poList")) || []

let totalPO = poList.length

let totalProfit = 0

poList.forEach(function(po){
totalProfit += po.profit || 0
})

document.getElementById("totalPO").innerText = totalPO
document.getElementById("totalProfit").innerText = totalProfit.toFixed(2)

loadProfitChart()

}


document.addEventListener("DOMContentLoaded",function(){

loadDashboard()
loadRecords()

showPage("dashboard")

})
function deletePO(index){

let poList = JSON.parse(localStorage.getItem("poList")) || []

poList.splice(index,1)

localStorage.setItem("poList", JSON.stringify(poList))

loadRecords()
loadDashboard()

}
function editPO(index){

let poList = JSON.parse(localStorage.getItem("poList")) || []

let po = poList[index]

document.getElementById("poNumber").value = po.number
document.getElementById("client").value = po.client
document.getElementById("department").value = po.department
document.getElementById("amount").value = po.amount
document.getElementById("investment").value = po.investment
document.getElementById("extra").value = po.extra

showPage("addpo")

poList.splice(index,1)

localStorage.setItem("poList", JSON.stringify(poList))

}
function searchPO(){

let input = document.getElementById("searchPO").value.toLowerCase()

let rows = document.querySelectorAll("#tableBody tr")

rows.forEach(function(row){

let text = row.innerText.toLowerCase()

if(text.includes(input)){
row.style.display=""
}else{
row.style.display="none"
}

})

}
function loadProfitGraph(){

let poList = JSON.parse(localStorage.getItem("poList")) || []

let labels = []
let profits = []

poList.forEach(function(po){
labels.push("PO " + po.number)
profits.push(po.profit)
})

let ctx = document.getElementById("profitChart")

if(window.profitChart){
window.profitChart.destroy()
}

window.profitChart = new Chart(ctx,{
type:'bar',
data:{
labels:labels,
datasets:[{
label:"Profit",
data:profits
}]
}
})

}
