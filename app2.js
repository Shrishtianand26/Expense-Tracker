const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.querySelector('.list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');
const category = document.getElementById('category');
const dateInput = document.getElementById('date-input');
const filterCategory = document.getElementById('filter-category');
const clearAllBtn = document.getElementById('clearAllBtn');

let transactions = [];
let chart;

// Load from localStorage
function loadTransactions() {
  const data = JSON.parse(localStorage.getItem('transactions'));
  if (data) transactions = data;
}

// Save to localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Generate unique ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Add new transaction
function addTransaction(e) {
  e.preventDefault();

  if (
    text.value.trim() === '' ||
    amount.value.trim() === '' ||
    type.value === '' ||
    category.value === ''
  ) {
    alert('Please fill in all fields.');
    return;
  }

  const amt = Math.abs(+amount.value);
  const transaction = {
    id: generateID(),
    text: text.value,
    amount: type.value === 'Expense' ? -amt : amt,
    type: type.value,
    category: category.value,
    date: dateInput.value
  };
  transactions.push(transaction);
  updateLocalStorage(); 
  init();
  clearFields();
  
}

function clearFields() {
  text.value = '';
  amount.value = '';
  type.value = 'Income';
  category.value = '';
  dateInput.value = '';
}

// Display one transaction in the DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';

  let formattedDate = 'No date';
  if (transaction.date) {
    const [year, month, day] = transaction.date.split('-');
    formattedDate = `${day}-${month}-${year}`;
  }
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} (${transaction.category}) - ${formattedDate}
    <span>${sign} Rs ${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="edit-btn" data-id="${transaction.id}" data-action="edit">✎</button>
    <button class="delete-btn" data-id="${transaction.id}" data-action="delete">x</button>`;
  list.appendChild(item);
}

// Click handling for delete/edit
list.addEventListener('click', function (e) {
  const btn = e.target;
  const id = +btn.getAttribute('data-id');
  const action = btn.getAttribute('data-action');

  if (action === 'delete') {
    removeTransaction(id);
  } else if (action === 'edit') {
    editTransaction(id);
  }
});

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions)); 
  init(); 
}


// Update income, expense, and balance values
function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const income = amounts.filter(val => val > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
  const expense = (
    amounts.filter(val => val < 0).reduce((acc, val) => acc + val, 0) * -1
  ).toFixed(2);

  balance.innerText = `Rs ${total}`;
  money_plus.innerText = `Rs ${income}`;
  money_minus.innerText = `Rs ${expense}`;
}

// Render pie chart for expense categories
function renderChart() {
  const expenseData = {};

  transactions
    .filter(t => t.type === 'Expense')
    .forEach(t => {
      let cat = (t.category || '').trim();
      cat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
      const categoryColors = {
        Groceries: '#ff6384',
        Rent: '#36a2eb',
        Utilities: '#ffcd56',
        Party: '#4bc0c0',
        Transportation: '#9966ff',
        Other: '#e183c5'
      };

      if (!categoryColors[cat]) cat = 'Other';

      expenseData[cat] = (expenseData[cat] || 0) + Math.abs(t.amount);
    });

  const ctx = document.getElementById('expenseChart').getContext('2d');
  if (window.chart) window.chart.destroy();

  const labels = Object.keys(expenseData);
  const values = Object.values(expenseData);
  const backgroundColors = labels.map(label => ({
    Groceries: '#ff6384',
    Rent: '#36a2eb',
    Utilities: '#ffcd56',
    Party: '#4bc0c0',
    Transportation: '#9966ff',
    Other: '#e183c5'
  }[label] || '#ccc'));

  window.chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: backgroundColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true
    }
  });
}

// Edit a transaction
function editTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  const newText = prompt('Update description:', transaction.text);
  const newAmount = prompt('Update amount:', Math.abs(transaction.amount));
  const newType = prompt('Update type (Income/Expense):', transaction.type);
  const newCategory = prompt('Update category:', transaction.category);
  const newDate = prompt('Update date (yyyy-mm-dd):', transaction.date);

  if (!newText || isNaN(newAmount) || (newType !== 'Income' && newType !== 'Expense')) {
    alert('Invalid input');
    return;
  }

  transaction.text = newText;
  transaction.amount = newType === 'Expense' ? -Math.abs(+newAmount) : Math.abs(+newAmount);
  transaction.type = newType;
  transaction.category = newCategory;
  transaction.date = newDate;

  init();
}

// Clear all transactions
clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all transactions?')) {
    transactions = [];
    localStorage.removeItem('transactions');
    init();
  }
});

// Export to JSON
function exportData() {
  const dataStr = JSON.stringify(transactions, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Import from JSON
function importData() {
  const fileInput = document.getElementById('importFile');
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        transactions = imported;
        init();
      } else {
        alert('Invalid file format.');
      }
    } catch {
      alert('Error parsing file.');
    }
  };
  reader.readAsText(file);
}

// Initialize app
function init() {
  loadTransactions();
  list.innerHTML = '';

  const filtered = filterCategory.value === 'all'
    ? transactions
    : transactions.filter(t => t.type === filterCategory.value);

  filtered.forEach(addTransactionDOM);
  updateValues();
  renderChart();
  updateLocalStorage();
}

// Event listeners
form.addEventListener('submit', addTransaction);
filterCategory.addEventListener('change', init);

// Initial call
init();
