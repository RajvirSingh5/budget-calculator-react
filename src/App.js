import React, {useState, useEffect} from 'react';

import './App.css';

//import compoents
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert.js';
//import uuid package
import { v4 as uuidv4 } from 'uuid';

/*
const initialExpenses = [
  {id:uuidv4(), charge:"rent", amount:1600},
  {id:uuidv4(), charge:"car payment", amount:400},
  {id:uuidv4(), charge:"mutual fund invest", amount:9600}
];
*/
const initialExpenses = localStorage.getItem('expenses') ? 
JSON.parse(localStorage.getItem('expenses')) : [];



function App() {
  /*  --- State Values ---- */
  /* all expenses, add expense */
  const [expenses, setExpenses] = useState(initialExpenses);
 /*  --- Single expense ---- */
 const [charge, setCharge] = useState('');
 /*  --- Single amount ---- */
 const[amount, setAmount] = useState('');
 /*  --- Alerts ---- */
 const[alert, setAlert] = useState({show: false});
 /*-------edit-------*/
 const [edit, setEdit] = useState(false);
 /*----id-------*/
 const [id, setId] = useState(0);
/*  --- Use Effet ---- */
useEffect(() => {
  console.log('we called useEffect');
  localStorage.setItem('expenses', JSON.stringify(expenses));
}, [expenses]);
 

 /*  --- Functionality ---- */
 //handle charge
 const handleCharge = e => {
   setCharge(e.target.value)
 };

 //handle Amount
 const handleAmount = e => {
  setAmount(e.target.value)
 };

 //handle alert
 const handleAlert = ({type, text}) => {
   setAlert({
     show: true,
     type,
     text
   });

   setTimeout(() => {
     setAlert({show: false})
   }, 3000)
 };

 const handleSubmit = e => {
   e.preventDefault();
   if(charge !== '' && amount > 0) {
      if(edit) {
        let tempExpenses = expenses.map(item => {
          return item.id === id? {...item, charge, amount} : item
        })
        setExpenses(tempExpenses);
        setEdit(false);
      } else {
        const singleExpense = {id: uuidv4(), charge, amount};
      setExpenses([...expenses, singleExpense]);
      handleAlert({type: 'success', text: 'Item added'})
      } 
     //to clear input fields
     setCharge('');
     setAmount('');
   } else{
     handleAlert({type: 'danger', text: `Charge cannot be emtpy and amount should be greater than zero.`})

   }
 };

  // Clear all items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({type: 'danger', text: 'All items deleted'});
  };

  //handle Delete
  const handleDelete = id => {
    let tempExpenses = expenses.filter(item => item.id !==id);
    setExpenses(tempExpenses);
    handleAlert({type: 'danger', text: 'Item deleted'});
    
  }

  //handle Edit
  const handleEdit = (id) => {
    let expense = expenses.find(item => item.id === id);
    let {charge, amount} = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true)
    setId(id)

  };

  return (
    <>
      {alert.show && 
        <Alert 
        type={alert.type} 
        text= {alert.text} 
        />}
      <Alert />
      <h1>Budget Calculator</h1>
      <main className="App">
        <ExpenseForm 
          charge={charge} 
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}

        />
        <ExpenseList 
          expenses = {expenses} 
          handleDelete = {handleDelete}
          handleEdit = {handleEdit}
          clearItems = {clearItems}
        />

      </main>
      <h1>
        Total Spending: <span className="total">
          ${expenses.reduce((accmulator, currentItem) => {
            return (accmulator += parseInt(currentItem.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
