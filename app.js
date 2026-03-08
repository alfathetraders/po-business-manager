
function showPage(id){
document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
document.getElementById(id).classList.remove('hidden');
loadData();
}

function calculate(){

let amount=parseFloat(document.getElementById('amount').value||0)
let invest=parseFloat(document.getElementById('investment').value||0)

let gst=amount*18/118
let ag=gst*0.20
let rem=gst-ag
let lawyer=rem*0.23
let tax=amount*0.055

let check=amount-ag-tax
let profit=(check-invest)-lawyer

document.getElementById("result").innerText="Estimated Profit: "+profit.toFixed(2)

}

function savePO(){

let amount=parseFloat(document.getElementById('amount').value||0)
let invest=parseFloat(document.getElementById('investment').value||0)

let gst=amount*18/118
let ag=gst*0.20
let rem=gst-ag
let lawyer=rem*0.23
let tax=amount*0.055

let check=amount-ag-tax
let profit=(check-invest)-lawyer

let po={
number:poNumber.value,
client:client.value,
amount:amount,
investment:invest,
profit:profit
}

let data=JSON.parse(localStorage.getItem("poData")||"[]")
data.push(po)

localStorage.setItem("poData",JSON.stringify(data))

alert("PO Saved")

loadData()

}

function loadData(){

let data=JSON.parse(localStorage.getItem("poData")||"[]")

let body=document.getElementById("tableBody")
if(!body)return

body.innerHTML=""

let totalProfit=0

data.forEach(p=>{

totalProfit+=p.profit

body.innerHTML+=`<tr>
<td>${p.number}</td>
<td>${p.client}</td>
<td>${p.amount}</td>
<td>${p.investment}</td>
<td>${p.profit.toFixed(2)}</td>
</tr>`

})

document.getElementById("totalPO").innerText=data.length
document.getElementById("totalProfit").innerText=totalProfit.toFixed(2)

}

function downloadBackup(){

let data=localStorage.getItem("poData")||"[]"

let blob=new Blob([data],{type:"application/json"})

let a=document.createElement("a")
a.href=URL.createObjectURL(blob)
a.download="po_business_backup.json"
a.click()

}

loadData()
