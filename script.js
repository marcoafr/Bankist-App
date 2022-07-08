'use strict';
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
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

const account5 = {
  owner: 'Marco Ribeiro',
  movements: [400, 500, -620, 14000, -1500, 25, 50, -2600, 1236],
  interestRate: 1.1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelLoginConditions = document.querySelector('.loginConditions');

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

//Creating a function to displayMovements -> It will receive an array of movements, and work with that data to display them from the 'newest' (last) movement until the 'oldest' (first) movement.
const displayMovements = function (movements) {
  //Before starting to 'fill the container' we actually need to clean it up (because in the original HTML file, there are 2 pattern movements)
  containerMovements.innerHTML = ''; //innerHTML is similar to the .textContent property, but .textContent simply returns the text itself, while .innerHTML returns everything, including all the HTML tags,

  //'movements' will be an array!
  movements.forEach(function (mov, index) {
    //The class name depends if is a deposit or a withdrawal:
    const type = mov < 0 ? 'withdrawal' : 'deposit';

    //We must create a movement_row to each element of the array
    const html = `    
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
     `;

    //Now we need to attach this 'html' variable into the div 'movements' container
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//Displaying account1.movements just to check if the function actually works (JUST CHECKING)
// displayMovements(account1.movements);

// Implementing the BALANCE to sum up all the movements in one account by getting all its movements
const calcDisplayBalance = function (movements) {
  //We are using the .reduce method to add up the acumulator with all the array elements. The accumulator starts at 0
  const balance = movements.reduce(
    (accumulator, currentMov) => accumulator + currentMov,
    0
  );
  //After we calculate the final balance, we will show it on the screen, on the labelBalance object
  labelBalance.textContent = `${balance}€`;
};
//Setting the function just for one of the accounts' movements to see the result on the screen (JUST CHECKING)
//calcDisplayBalance(account1.movements);

//Computing the total amounts of incomes, the out money and the interest to display them in the page of the user
const calcDisplaySummary = function (account) {
  // Calculating the total income (Filetring only the positive values from the movements array and then summing them up together)
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((accum, mov) => accum + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  // Calculating the total money out (Filetring only the negative values from the movements array and then summing them up together)
  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((accum, mov) => accum + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`; //Getting rid of the negative sign, because we know already that the money is going out
  // Calculating the total interest (Filetring only the positive values from the movements array, because the interest happens on each deposit and then summing them up together and multiplying with the interest rate, for example, 1.2%). PS: Interests only happen if the interest value is greater or equal 1 Euro/dollar!
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100) //Each client has a specific interest rate!
    .filter(interest => interest > 1) //If the interes is less then 1, it does not count/ sum up
    .reduce((accum, interests) => accum + interests, 0);
  labelSumInterest.textContent = `${interest}€`;
};
//Setting the function just for one of the accounts' movements to see the result on the screen (JUST CHECKING)
// calcDisplaySummary(account1.movements);

//Computing usernames for each account owner -> The initials of each of the users (user = 'Steven Thomas Williams' -> username: stw)
// We will create a function that will loop throught the accounts array (which is an array that contains all the accounts)
const createUsernames = function (accs) {
  // For each of the accounts on the accounts array (account1, account2, ...) we will add a new property called username
  accs.forEach(function (acc) {
    // This new 'username' property is equal to the account owner's name, taking its initials, in lower case
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
//Then we run the function, so it creates all the usernames for each account from the program
createUsernames(accounts);

// console.log(accounts); //Logging to the console, just to make sure we have all the usernames created for each of the accounts

// Event Handlers

//We will firstly create the current account variable, not assigning it yet
let currentAccount;
// Implementing the login function
btnLogin.addEventListener('click', function (e) {
  //Remember that the btnLogin is a FORM, then each time it's clicked, the page reloads! So we must prevent form from submitting
  e.preventDefault();
  // We need to find the account from the login input of the user
  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  //console.log(currentAccount); //Just to check if it is returning the right object / account

  //Checking the password
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //OPTIONAL CHAINING (?.): The pin will only be read if the currentAccount actually exists! Otherwise, it would show an error on the console
    // console.log('LOGIN COMPLETE'); -> Just checking event handler matching the conditions
    // Now that the LOGIN is OK:
    //If the wrong login message is on, we remove it
    labelLoginConditions.classList.add('hidden');
    //Display welcome message (first name only)
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    //Making the class .app 'appear' -> We must display the UI
    containerApp.style.opacity = '1'; //Showing all the information!
    //Display movements
    displayMovements(currentAccount.movements);
    //Display balance
    calcDisplayBalance(currentAccount.movements);
    //Display summary
    calcDisplaySummary(currentAccount); //This one needs the account as parameter, not just the movements
    //As soon as we log in, we must 'get rid' of the data in the input fields (Clear input fields)
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur(); //Just so it loses its focus
    inputLoginPin.blur(); //Just so it loses its focus
  } else {
    containerApp.style.opacity = '0'; //Masking all the information!
    labelLoginConditions.classList.remove('hidden');
    // Getting rid of the data in the input fields (Clear input fields)
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur(); //Just so it loses its focus
    inputLoginPin.blur(); //Just so it loses its focus
  }
});
