const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

let expenses = [];
let id = 1;

// Get all expenses
app.get('/expenses', (req, res) => {
  res.json(expenses);
});

// Add a new expense
app.post('/expenses', (req, res) => {
  const { name, amount } = req.body;
  expenses.push({ id: id++, name, amount, date: new Date() });
  res.status(201).json({ message: 'Expense added' });
});

// Edit an expense
app.put('/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { name, amount } = req.body;
  const expense = expenses.find(e => e.id === parseInt(id));
  if (expense) {
    expense.name = name;
    expense.amount = amount;
    res.json({ message: 'Expense updated' });
  } else {
    res.status(404).json({ message: 'Expense not found' });
  }
});

// Delete an expense
app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;
  expenses = expenses.filter(e => e.id !== parseInt(id));
  res.json({ message: 'Expense deleted' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
