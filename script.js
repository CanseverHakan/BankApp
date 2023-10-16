'use strict';


// Data
const account1 = {
  owner: 'Hedi Rivas',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};


const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};


const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};


const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};


const accounts = [account1, account2, account3, account4];

console.log(account1)
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currentDays = new Date();
const actualDays = currentDays.getDate();
const actualMonths = currentDays.getMonth() + 1;
labelDate.textContent = currentDays



//Transaction
const displayMovement = function (movement, sort = false) {
  containerMovements.innerHTML = "";
  let sorting = sort ? movement.slice().sort((a, b) => a - b) : movement;
  for (let [i, row] of sorting.entries()) {
    let html = "";
    if (row > 0) {
      html = `<div class="movements__row">
      <div class="movements__type movements__type--deposit"> deposit</div>
      <div class="movements__date">${actualDays}/${actualMonths}</div>
      <div class="movements__value">${row}</div>`
    } else {
      html = `<div class="movements__row">
      <div class="movements__type movements__type--withdrawal"> withdrawal</div>
      <div class="movements__date">${actualDays}/${actualMonths}</div>
      <div class="movements__value">${row}</div>`
    }
    containerMovements.insertAdjacentHTML("afterbegin", html);
  }
};
let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovement(currentAccount.movements, sorted);
  sorted = !sorted
})


//USERNAME create 
function createUsernames(accs) {
  console.log(accs);
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((el) => el[0])
      .join("");
  });
}
createUsernames(accounts);


//Balance Calc
const calcDisplayBalance = (movements) => {
  const balance = movements.reduce(function (acc, cur, i) {
    console.log(`${i}:${acc}`);
    return acc + cur;
  });
  return balance;
};



const calcDisplaySummary = function (movements) {
  //Money Income
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0)
  console.log(incomes)
  labelSumIn.textContent = incomes
  //OUT
  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0)
  console.log(out)
  labelSumOut.textContent = out
  //interest 
  const interest = movements
    .filter(mov => mov > 0)
    .map((mov) => (mov * `${currentAccount.interestRate}`) / 100)
    .filter((int, i, arr) => {
      return int >= 1
    })
    .reduce((acc, mov) => acc + mov, 0)
  console.log(interest)
  labelSumInterest.textContent = interest
}

//LOGIN
let currentAccount;
btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = '1'
    labelWelcome.textContent = `Welcome ${currentAccount.owner}`

    updateUI(currentAccount)

  }
  inputLoginUsername.value = inputLoginPin.value = ''
})


//TRANSFERT MONEY
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let receiverAcc = accounts.find(
    (accounts) => accounts.username === inputTransferTo.value)
    if (amount > 0 && receiverAcc
    && calcDisplayBalance(currentAccount.movements) > amount
    && receiverAcc.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    
    updateUI(currentAccount)
    
  }
  inputTransferAmount.value = inputTransferTo.value = ''
})


//CLOSE ACCOUNT
btnClose.addEventListener('click', (e) => {
  e.preventDefault()
  let user = inputCloseUsername.value
  let pin = Number(inputClosePin.value)
  
  if (user === currentAccount.username && pin === currentAccount.pin) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username)
      accounts.splice(index, 1)
      containerApp.style.opacity = '0'
      labelWelcome.textContent = 'Log in to get started'
    }
  })
  
  //LOAN
  btnLoan.addEventListener('click', (e) => {
    e.preventDefault()
    let loanAmount = Number(inputLoanAmount.value);
    let requestedAmount = currentAccount.movements.some((mov) => mov >= 0.1 * loanAmount)
    
    if (loanAmount > 0 && requestedAmount === true) {
      currentAccount.movements.push(loanAmount)

    updateUI(currentAccount)
  }
  inputLoanAmount.value = ''
})



const updateUI = function (acc) {
  displayMovement(acc.movements)
  labelBalance.textContent = `${calcDisplayBalance(acc.movements)}€`;
  calcDisplaySummary(acc.movements)
}







// let departMinutes = 5
// let temps = departMinutes * 60

// setInterval(() => {
//   let minutes = parseInt(temps / 60, 10)
//   let secondes = parseInt(temps % 60, 10)

//   minutes = minutes < 10 ? "0" + minutes : minutes
//   secondes = secondes < 10 ? "0" + secondes : secondes

//   labelTimer.textContent = `${minutes}:${secondes}`
//   temps = temps <= 0 ? containerApp.style.opacity = '0' : temps - 1
// }, 1000)