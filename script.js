'use strict';


// Data

const account1 = {
  owner: 'Hedi Rivas',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-09-09T17:01:17.194Z',
    '2023-09-18T23:36:17.929Z',
    '2023-09-21T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'fr-FR',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-09-18T18:49:59.371Z',
    '2023-09-20T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];


// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const body = document.querySelector('body')

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

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value)
}


//Transaction
const displayMovement = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  let sorting = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  for (let [i, row] of sorting.entries()) {

    const date = new Date(acc.movementsDates[i])
    const displayDate = formatedMovementDate(date)

    const formatedCurr = formatCur(row.toFixed(2), acc.locale, acc.currency);

    let html = "";
    if (row > 0) {
      html = `<div class="movements__row">
      <div class="movements__type movements__type--deposit"> deposit</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formatedCurr}</div>`
    } else {
      html = `<div class="movements__row">
      <div class="movements__type movements__type--withdrawal"> withdrawal</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formatedCurr}</div>`
    }
    containerMovements.insertAdjacentHTML("afterbegin", html);
  }
};
let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovement(currentAccount, !sorted);
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
const calcDisplayBalance = (acc) => {
  currentAccount.balance = currentAccount.movements.reduce((a, b) => a + b, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};



const calcDisplaySummary = function (acc) {
  //Money Income
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  //OUT
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = formatCur(incomes, acc.locale, acc.currency);
  //interest 
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map((mov) => (mov * `${currentAccount.interestRate}`) / 100)
    .filter((int, i, arr) => {
      return int >= 1
    })
    .reduce((acc, mov) => acc + mov, 0)
  labelSumInterest.textContent = formatCur(incomes, acc.locale, acc.currency);
}

//LOGIN
let currentAccount;
btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = '1'
    labelWelcome.textContent = `Welcome ${currentAccount.owner}`
    labelDate.textContent = currentDays.toLocaleString(`${currentAccount.locale}`)

    updateUI(currentAccount)
    logOutTimer()

  }
  inputLoginUsername.value = inputLoginPin.value = ''
})


//TRANSFERT MONEY
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let receiverAcc = accounts.find(
    (accounts) => accounts.username === inputTransferTo.value)
  if (amount > 0 &&
    receiverAcc &&
    currentAccount.balance > amount &&
    receiverAcc?.username !== currentAccount.username) {
    setTimeout(function () {

      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      currentAccount.movementsDates.push(currentDays.toISOString())
      receiverAcc.movementsDates.push(currentDays.toISOString())


      updateUI(currentAccount)
    }, 2000)
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
  let loanAmount = Math.floor(inputLoanAmount.value);
  let requestedAmount = currentAccount.movements.some((mov) => mov >= 0.1 * loanAmount)

  if (loanAmount > 0 && requestedAmount === true) {
    setTimeout(function () {
      currentAccount.movements.push(loanAmount)

      currentAccount.movementsDates.push(currentDays.toISOString())

      updateUI(currentAccount)
    }, 3000)
  }
  inputLoanAmount.value = ''
})



const updateUI = (acc) => {
  displayMovement(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const formatedMovementDate = function (date) {
  const calcDatePassed = function (date1, date2) {
    return Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)
  }

  let daysPassed = Math.round(calcDatePassed(new Date(), date))

  if (daysPassed < 1) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {

    return date.toLocaleString(`${currentAccount.locale}`)
  }

}


//LogOut TIMER

const logOutTimer = function () {
  let time = 300;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0)
    const sec = String(time % 60).padStart(2, 0)

    labelTimer.textContent = `${min}:${sec}`

    //When 0 second ,Stop Timer and Log Out Current User
    if (time === 0) {
      clearInterval(timer)
      containerApp.style.opacity = 0
      labelWelcome.textContent = 'Log in to get started'
    }
    //Decrease 1s
    time--
  }

  //Call the timer every second
  tick()
  const timer = setInterval(tick, 1000)
  return timer
}