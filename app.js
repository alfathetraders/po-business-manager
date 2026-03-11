let poList = JSON.parse(localStorage.getItem("poList")) || []

// ================= PAGE SWITCH =================

function showPage(page){

document.querySelectorAll(".page").forEach(function(p){
p.classList.add("hidden")
})

document.getElementById(page).classList.remove("hidden")

if(page === "records"){ loadRecords() }
if(page === "dashboard"){ loadDashboard() }

}

// ================= CALCULATE =================

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

// ================= SAVE PO =================

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
number,
client,
department,
amount,
check,
investment,
extra,
profit,
roi
}

poList.push(po)

localStorage.setItem("poList", JSON.stringify(poList))

alert("PO Saved Successfully")

loadRecords()
loadDashboard()

showPage("records")

}

// ================= RECORDS =================

function loadRecords(){

let table = document.getElementById("tableBody")

if(!table) return

table.innerHTML = ""

poList.forEach(function(po,index){

table.innerHTML += `
<tr>
<td>${po.number}</td>
<td>${po.client}</td>
<td>${po.department}</td>
<td>${po.amount}</td>
<td>${po.check.toFixed(2)}</td>
<td>${po.investment}</td>
<td>${po.extra}</td>
<td>${po.profit.toFixed(2)}</td>
<td>${po.roi.toFixed(2)}%</td>
<td>
<button onclick="editPO(${index})">Edit</button>
<button onclick="deletePO(${index})">Delete</button>
</td>
</tr>
`

})

}

// ================= DASHBOARD =================

function loadDashboard(){

let totalPO = poList.length
let totalProfit = 0

poList.forEach(function(po){
totalProfit += po.profit || 0
})

document.getElementById("totalPO").innerText = totalPO
document.getElementById("totalProfit").innerText = totalProfit.toFixed(2)

loadProfitGraph()

}

document.addEventListener("DOMContentLoaded",function(){

loadDashboard()
loadRecords()
showPage("dashboard")

})

// ================= DELETE =================

function deletePO(index){

poList.splice(index,1)

localStorage.setItem("poList", JSON.stringify(poList))

loadRecords()
loadDashboard()

}

// ================= EDIT =================

function editPO(index){

let po = poList[index]

document.getElementById("poNumber").value = po.number
document.getElementById("client").value = po.client
document.getElementById("department").value = po.department
document.getElementById("amount").value = po.amount
document.getElementById("investment").value = po.investment
document.getElementById("extra").value = po.extra

showPage("addpo")

poList.splice(index,1)

}

// ================= SEARCH =================

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

// ================= GRAPH =================

function loadProfitGraph(){

let labels = []
let profits = []

poList.forEach(function(po){
labels.push("PO " + po.number)
profits.push(po.profit)
})

let chart = document.getElementById("profitChart")
if(!chart) return

let ctx = chart.getContext("2d")

if(window.profitGraph){
window.profitGraph.destroy()
}

window.profitGraph = new Chart(ctx,{
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

// ================= OCR READER =================

function readPOImage(){

let file = document.getElementById("poImage").files[0]

if(!file){
alert("Upload PO Image or PDF")
return
}

if(file.type === "application/pdf"){

let reader = new FileReader()

reader.onload = function(){

let typedarray = new Uint8Array(this.result)

pdfjsLib.getDocument(typedarray).promise.then(function(pdf){

pdf.getPage(1).then(function(page){

let viewport = page.getViewport({scale:2})

let canvas = document.createElement("canvas")
let context = canvas.getContext("2d")

canvas.height = viewport.height
canvas.width = viewport.width

page.render({
canvasContext:context,
viewport:viewport
}).promise.then(function(){

Tesseract.recognize(canvas,'eng').then(({data:{text}})=>{

aiSmartPOReader(text)

})

})

})

})

}

reader.readAsArrayBuffer(file)

}else{

Tesseract.recognize(file,'eng').then(({data:{text}})=>{

aiSmartPOReader(text)

})

}

}

// ================= AI SMART PO READER =================

function aiSmartPOReader(text){

text = text.replace(/\n/g," ")

console.log("OCR TEXT:",text)

// ===== PO NUMBER =====

let poMatch = text.match(/PO\s*(No|#)?\s*[:\-]?\s*([0-9]+)/i)

if(poMatch){
document.getElementById("poNumber").value = poMatch[2]
}

// ===== AMOUNT =====

let amountMatch = text.match(/Total\s*Inclusive\s*Tax\s*Amount\s*PKR\s*([0-9,.]+)/i)

if(!amountMatch){
amountMatch = text.match(/Total\s*Exclusive\s*Tax\s*Amount\s*PKR\s*([0-9,.]+)/i)
}

if(!amountMatch){
amountMatch = text.match(/Grand\s*Total\s*PKR\s*([0-9,.]+)/i)
}

if(!amountMatch){
amountMatch = text.match(/PKR\s*([0-9]{5,}[0-9,.]*)/i)
}

if(amountMatch){

let amount = amountMatch[1]
amount = amount.replace(/,/g,"")

document.getElementById("amount").value = amount

}

// ===== CLIENT =====

if(text.includes("Punjab Police")){
document.getElementById("client").value = "Punjab Police"
}

// ===== DEPARTMENT =====

if(text.includes("Riot Management")){
document.getElementById("department").value = "Riot Management Police"
}

alert("AI PO Data Extracted Successfully")

}
