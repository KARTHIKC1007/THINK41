import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const response = await axios.get('http://localhost:5000/expenses');
    setExpenses(response.data);
  };

  const addExpense = async () => {
    if (!name || !amount) return;
    await axios.post('http://localhost:5000/expenses', { name, amount });
    setName('');
    setAmount('');
    fetchExpenses();
  };

  const editExpense = (id, name, amount) => {
    setEditId(id);
    setName(name);
    setAmount(amount);
  };

  const updateExpense = async () => {
    await axios.put(`http://localhost:5000/expenses/${editId}`, { name, amount });
    setName('');
    setAmount('');
    setEditId(null);
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/expenses/${id}`);
    fetchExpenses();
  };

  const totalSpentToday = expenses.reduce((total, expense) => {
    const expenseDate = new Date(expense.date);
    const today = new Date();
    return expenseDate.toDateString() === today.toDateString() ? total + Number(expense.amount) : total;
  }, 0);

  return (
    <div>
      <h1>Expense Tracker</h1>
      <input
        type="text"
        placeholder="Expense name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={editId ? updateExpense : addExpense}>
        {editId ? 'Update' : 'Add'}
      </button>

      <h2>Total Spent Today: ${totalSpentToday}</h2>

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.name} - ${expense.amount}
            <button onClick={() => editExpense(expense.id, expense.name, expense.amount)}>
              Edit
            </button>
            <button onClick={() => deleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTracker;
