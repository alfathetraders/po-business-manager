let poList = JSON.parse(localStorage.getItem("poList") || "[]");

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.add("hidden");
  });

  let el = document.getElementById(page);
  if (el) el.classList.remove("hidden");
}

function calculate() {
  let amount = parseFloat(document.getElementById("amount").value) || 0;
  let investment = parseFloat(document.getElementById("investment").value) || 0;

  let profit = amount - investment;

  document.getElementById("result").innerText =
    "Profit: " + profit.toFixed(2);
}

function savePO() {
  let number = document.getElementById("poNumber").value;
  let client = document.getElementById("client").value;
  let amount = parseFloat(document.getElementById("amount").value) || 0;
  let investment =
    parseFloat(document.getElementById("investment").value) || 0;

  let profit = amount - investment;

  let po = {
    number: number,
    client: client,
    amount: amount,
    investment: investment,
    profit: profit
  };

  poList.push(po);

  localStorage.setItem("poList", JSON.stringify(poList));

  loadTable();

  alert("PO Saved");
}

function loadTable() {
  let table = document.getElementById("tableBody");

  if (!table) return;

  table.innerHTML = "";

  poList.forEach((po, index) => {
    table.innerHTML += `
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
`;
  });
}

function openBill(i) {
  localStorage.setItem("selectedPO", JSON.stringify(poList[i]));
  window.open("bill.html");
}

function openInvoice(i) {
  localStorage.setItem("selectedPO", JSON.stringify(poList[i]));
  window.open("stinvoice.html");
}

function openDC(i) {
  localStorage.setItem("selectedPO", JSON.stringify(poList[i]));
  window.open("dc.html");
}

loadTable();
