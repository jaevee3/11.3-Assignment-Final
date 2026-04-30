let transactions = [];
let totalIncome = 0;
let totalExpenses = 0;

// SAVE DATA
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ADD TRANSACTION
function addTransaction() {
  const amount = Number(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  // ✅ validation
  if (amount <= 0 || category.trim() === "") {
    alert("Please enter a valid amount and category");
    return;
  }

  const transaction = { amount, type, category };

  transactions.push(transaction);
  saveData();

  renderTransactions();
  updateBalance();

  // clear inputs
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "";
}

// DISPLAY TRANSACTIONS
function renderTransactions() {
  const list = document.getElementById("transactionList");
  list.innerHTML = "";

  if (transactions.length === 0) {
    list.innerHTML = "<p>No transactions yet</p>";
    return;
  }

  transactions.forEach((t, index) => {
    const li = document.createElement("li");

    // ✅ formatted money
    li.textContent = `${t.type}: $${t.amount.toFixed(2)} (${t.category})`;

    li.className = t.type;

    // delete button
    const btn = document.createElement("button");
    btn.textContent = "X";
    btn.onclick = () => deleteTransaction(index);

    li.appendChild(btn);
    list.appendChild(li);
  });
}

// UPDATE BALANCE
function updateBalance() {
  totalIncome = 0;
  totalExpenses = 0;

  transactions.forEach(t => {
    if (t.type === "income") {
      totalIncome += t.amount;
    } else {
      totalExpenses += t.amount;
    }
  });

  const balance = totalIncome - totalExpenses;

  const balanceEl = document.getElementById("balance");
  balanceEl.textContent = balance.toFixed(2);

  // ✅ color balance
  balanceEl.style.color = balance >= 0 ? "green" : "red";

  // ✅ show totals
  const incomeEl = document.getElementById("income");
  const expenseEl = document.getElementById("expenses");

  if (incomeEl) incomeEl.textContent = totalIncome.toFixed(2);
  if (expenseEl) expenseEl.textContent = totalExpenses.toFixed(2);
}

// DELETE
function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveData();
  renderTransactions();
  updateBalance();
}

// CLEAR ALL
function clearAll() {
  if (!confirm("Are you sure you want to delete all transactions?")) return;

  transactions = [];
  saveData();
  renderTransactions();
  updateBalance();
}

// LOAD DATA
function loadData() {
  const saved = localStorage.getItem("transactions");

  if (saved) {
    transactions = JSON.parse(saved);
    renderTransactions();
    updateBalance();
  } else {
    fetch("data.json")
      .then(res => res.json())
      .then(data => {
        transactions = data;
        saveData();
        renderTransactions();
        updateBalance();
      });
  }
}

// EVENT LISTENERS
document.getElementById("addBtn").addEventListener("click", addTransaction);

// ✅ press Enter to add
document.getElementById("amount").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    addTransaction();
  }
});

// INITIAL LOAD
loadData();