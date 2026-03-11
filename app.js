let poList = JSON.parse(localStorage.getItem("poList")) || []

let poItems = []

// ================= PAGE SWITCH =================

function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.classList.add("hidden")
})

document.getElementById(page).classList.remove("hidden")

if(page==="records") loadRecords()
if(page==="dashboard") loadDashboard()

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
if(investment>0){
roi = (profit/investment)*100
}

document.getElementById("result").innerHTML =
"PO Base Amount: "+base.toFixed(2)+"<br>"+
"GST (18%): "+gst.toFixed(2)+"<br>"+
"Govt GST Cut: "+govtGST.toFixed(2)+"<br>"+
"Income Tax (5.5%): "+incomeTax.toFixed(2)+"<br>"+
"Check Amount: "+check.toFixed(2)+"<br>"+
"Profit: "+profit.toFixed(2)+"<br>"+
"ROI: "+roi.toFixed(2)+"%"

}

// ================= SAVE PO =================

function savePO(){

let po = {
number: document.getElementById("poNumber").value,
client: document.getElementById("client").value,
department: document.getElementById("department").value,
amount: parseFloat(document.getElementById("amount").value)||0,
investment: parseFloat(document.getElementById("investment").value)||0,
extra: parseFloat(document.getElementById("extra").value)||0,
items: poItems
}

let base = po.amount/1.18
let gst = po.amount-base

let incomeTax = po.amount*0.055
let govtGST = gst*0.20

po.check = po.amount-incomeTax-govtGST
po.profit = po.check-po.investment-po.extra
po.roi = po.investment>0 ? (po.profit/po.investment)*100 : 0

poList.push(po)

localStorage.setItem("poList",JSON.stringify(poList))

alert("PO Saved")

loadRecords()
loadDashboard()

showPage("records")

}

// ================= RECORDS =================

function loadRecords(){

let table = document.getElementById("tableBody")
if(!table) return

table.innerHTML=""

poList.forEach((po,index)=>{

table.innerHTML+=`
<tr>
<td>${po.number}</td>
<td>${po.client}</td>
<td>${po.amount}</td>
<td>${po.check.toFixed(2)}</td>
<td>${po.investment}</td>
<td>${po.extra}</td>
<td>${po.profit.toFixed(2)}</td>
<td>${po.roi.toFixed(2)}%</td>
<td>
<button onclick="editPO(${index})">Edit</button>
<button onclick="deletePO(${index})">Delete</button>
<button onclick="generateInvoice(${index})">Invoice</button>
</td>
</tr>
`

})

}

// ================= DASHBOARD =================

function loadDashboard(){

let totalPO = poList.length
let totalProfit = 0

poList.forEach(po=>{
totalProfit+=po.profit
})

let poEl = document.getElementById("totalPO")
let profitEl = document.getElementById("totalProfit")

if(poEl) poEl.innerText=totalPO
if(profitEl) profitEl.innerText=totalProfit.toFixed(2)

loadProfitGraph()

}

// ================= GRAPH =================

function loadProfitGraph(){

let chart=document.getElementById("profitChart")
if(!chart) return

let labels=[]
let profits=[]

poList.forEach(po=>{
labels.push("PO "+po.number)
profits.push(po.profit)
})

let ctx=chart.getContext("2d")

if(window.graph){
window.graph.destroy()
}

window.graph=new Chart(ctx,{
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

// ================= DELETE =================

function deletePO(index){

poList.splice(index,1)

localStorage.setItem("poList",JSON.stringify(poList))

loadRecords()
loadDashboard()

}

// ================= EDIT =================

function editPO(index){

let po=poList[index]

document.getElementById("poNumber").value=po.number
document.getElementById("client").value=po.client
document.getElementById("department").value=po.department
document.getElementById("amount").value=po.amount
document.getElementById("investment").value=po.investment
document.getElementById("extra").value=po.extra

showPage("addpo")

poList.splice(index,1)

}

// ================= SEARCH =================

function searchPO(){

let input=document.getElementById("searchPO").value.toLowerCase()

let rows=document.querySelectorAll("#tableBody tr")

rows.forEach(row=>{

let text=row.innerText.toLowerCase()

row.style.display=text.includes(input)?"":"none"

})

}

// ================= INVOICE =================

function generateInvoice(index){

let po=poList[index]

let itemsHTML=""

po.items.forEach(item=>{
itemsHTML+=item+"<br>"
})

let html=`

<h2>Alfathe Traders</h2>

<b>PO Number:</b> ${po.number}<br>
<b>Client:</b> ${po.client}<br>
<b>Department:</b> ${po.department}<br>

<h3>Items</h3>

${itemsHTML}

<hr>

PO Amount: ${po.amount}<br>
Check Amount: ${po.check}<br>
Profit: ${po.profit}<br>

`

let win=window.open()

win.document.write(html)

win.print()

}

// ================= OCR READER =================

function readPOImage(){

let file=document.getElementById("poImage").files[0]

if(!file){
alert("Upload PO")
return
}

Tesseract.recognize(file,'eng').then(({data:{text}})=>{

aiSmartPOReader(text)

})

}

// ================= AI SMART PO READER =================

function aiSmartPOReader(text){

text=text.replace(/\n/g," ")

console.log(text)

// ===== PO NUMBER =====

let poMatch=text.match(/PO\s*(No|#)?\s*[:\-]?\s*([0-9]+)/i)

if(poMatch){
document.getElementById("poNumber").value=poMatch[2]
}

// ===== AMOUNT =====

let amountMatch=text.match(/Total\s*Inclusive\s*Tax\s*Amount\s*PKR\s*([0-9,.]+)/i)

if(!amountMatch){
amountMatch=text.match(/Grand\s*Total\s*PKR\s*([0-9,.]+)/i)
}

if(amountMatch){

let amount=amountMatch[1].replace(/,/g,"")

document.getElementById("amount").value=amount

}

// ===== CLIENT =====

if(text.includes("Punjab Police")){
document.getElementById("client").value="Punjab Police"
}

// ===== DEPARTMENT =====

if(text.includes("Riot Management")){
document.getElementById("department").value="Riot Management Police"
}

// ===== ITEMS TABLE =====

poItems=[]

let lines=text.split("PKR")

lines.forEach(line=>{

if(line.includes("EACH")||line.includes("qty")){

poItems.push(line.trim())

}

})

let itemsDiv=document.getElementById("poItems")

if(itemsDiv){

itemsDiv.innerHTML=""

poItems.forEach(item=>{
itemsDiv.innerHTML+=item+"<br>"
})

}

alert("AI PO Data + Items Extracted")

}

// ================= START =================

document.addEventListener("DOMContentLoaded",()=>{

showPage("dashboard")
loadDashboard()
loadRecords()

})
