    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    function saveToLocal() {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
    
    function calculateBalance() {
      let balance = 0;
      let income = 0;
      let expense = 0;
      
      transactions.forEach(tx=> {
        if (tx.type === 'income') {
          income += tx.amount;
          balance += tx.amount;
        } else {
          expense += tx.amount;
          balance -= tx.amount;
        }
      });
      
      document.getElementById('balance').textContent = `₦${balance.toLocaleString()}`;
      document.getElementById('total-income').textContent = `₦${income.toLocaleString()}`;
      document.getElementById('total-expense').textContent = `₦${expense.toLocaleString()}`;
    }
    
    function renderTransactions() {
      const container = document.getElementById('transactions');
      container.innerHTML = '';
      
      if (transactions.length === 0) {
        container.innerHTML = `<p class="text-center text-muted">No transactions yet. Add one! 💰</p>`;
        return;
      }
      
      transactions.forEach((tx, index) => {
        const sign = tx.type === 'income' ? '+' : '-';
        const color = tx.type === 'income' ? 'income' : 'expense';
        
        const div = document.createElement('div');
        div.className = `card mb-2`;
        div.innerHTML = `
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <strong>${tx.desc}</strong><br>
          <small class="text-muted">${tx.category} • ${tx.date}</small>
        </div>
        <div class="${color} fw-bold">
          ${sign}₦${tx.amount.toLocaleString()}
        </div>
        <button onclick="deleteTransaction(${index})" class="btn btn-sm btn-outline, -danger">×</button>
      </div>`;
        container.appendChild(div);
      });
    }
    
    function addTransaction() {
      const type = document.getElementById('type').value;
      const desc = document.getElementById('desc').value;
      const amount = parseFloat(document.getElementById('amount').value);
      const category = document.getElementById('category').value;
      
      if (!desc || !amount) {
        alert("Description and Amount required!");
        return;
      }
      
      transactions.unshift({
        type,
        desc,
        amount,
        category,
        date: new Date().toLocaleDateString('en-GB')
      });
      
      saveToLocal();
      calculateBalance();
      renderTransactions();
      
      bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
      
      // Clear form
      document.getElementById('desc').value = '';
      document.getElementById('amount').value = '';
    }
    
    function deleteTransaction(index) {
      if (confirm("Delete this transaction?")) {
        transactions.splice(index, 1);
        saveToLocal();
        calculateBalance();
        renderTransactions();
      }
    }
    
    function showModal() {
      new bootstrap.Modal(document.getElementById('addModal')).show();
    }
    
    // Initialize
    calculateBalance();
    renderTransactions();