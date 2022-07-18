'use strict';
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2020-11-18T21:31:17.178Z',
    '2020-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-05-27T17:01:17.194Z',
    '2022-07-11T23:36:17.929Z',
    '2022-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account5 = {
  owner: 'Marco Ribeiro',
  movements: [400, 500, -620, 14000, -1500, 25, 50, -2600, 1236],
  interestRate: 1.1,
  pin: 5555,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-05-30T09:48:16.867Z',
    '2022-07-08T06:04:23.907Z',
    '2022-07-13T14:18:46.235Z',
    '2022-07-14T16:33:06.386Z',
  ],
  currency: 'BRL',
  locale: 'pt-BR',
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
const labelTransferMessage = document.querySelector('.transferMessage');
const labelDeletedAccount = document.querySelector('.deletedAccount');
const labelCloseAccountMessage = document.querySelector('.closeAccountMessage');
const labelLoanMessage = document.querySelector('.loanMessage');

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

// FUNCTIONS

// Creating a function to format / divide properly dates -> It will calculate the time difference the date of the movement and today's date and then return separate 'results' depending on when was the movement
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (day1, day2) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));

  // The date parameter that is received comes from the displayMovements function (which comes from the account objects):
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) {
    return `Today`;
  } else if (daysPassed === 1) {
    return `Yesterday`;
  } else if (daysPassed <= 10) {
    return `${daysPassed} days ago`;
  } else {
    /*
    // Option 1: Manually formatting
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
    */

    // Option 2: Using INTERNATIONALIZATION API (Options object not necessary, because all we want is day month year)
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//Creating a function to take care of formatting currencies:
const formatCurrency = function (value, locale, currency) {
  // Creating a variable to store the user's location (which is stored in each object!)
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency, //we also have the currency on the user's object
  }).format(value);
};

//Creating a function to displayMovements -> It will receive an array of movements, and work with that data to display them from the 'newest' (last) movement until the 'oldest' (first) movement.
// Adding the sorting step to the displayMovements function (set to false by default, only true when we click)
const displayMovements = function (account, sort = false) {
  //Before starting to 'fill the container' we actually need to clean it up (because in the original HTML file, there are 2 pattern movements)
  containerMovements.innerHTML = ''; //innerHTML is similar to the .textContent property, but .textContent simply returns the text itself, while .innerHTML returns everything, including all the HTML tags,

  // Creating a variable to check whether the sort parameter is true or false. If true, we create a copy of the movements array and then sort it (ascending order). If false (default) movs will simply be movements
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  //'movs' will be an array!
  movs.forEach(function (mov, index) {
    //The class name depends if is a deposit or a withdrawal:
    const type = mov < 0 ? 'withdrawal' : 'deposit';

    // Creating a variable to display the dates on the movements (within the displayMovements function!)
    const date = new Date(account.movementsDates[index]);
    const displayDate = formatMovementDate(date, account.locale);

    // Running the formattedMov function for the user's location & currency (which is stored in each object!)
    const formattedMov = formatCurrency(mov, account.locale, account.currency);

    //We must create a movement_row to each element of the array
    const html = `    
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
     `;

    //Now we need to attach this 'html' variable into the div 'movements' container
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//Displaying account1.movements just to check if the function actually works (JUST CHECKING)
// displayMovements(account1.movements);

// Implementing the BALANCE to sum up all the movements in one account by getting all its movements
const calcDisplayBalance = function (account) {
  //We are using the .reduce method to add up the acumulator with all the array elements. The accumulator starts at 0
  account.balance = account.movements.reduce(
    (accumulator, currentMov) => accumulator + currentMov,
    0
  );

  // Running the formattedMov function for the user's location & currency (which is stored in each object!)
  const formattedMov = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
  //After we calculate the final balance, we will show it on the screen, on the labelBalance object
  labelBalance.textContent = formattedMov;
};
//Setting the function just for one of the accounts' movements to see the result on the screen (JUST CHECKING)
//calcDisplayBalance(account1.movements);

//Computing the total amounts of incomes, the out money and the interest to display them in the page of the user
const calcDisplaySummary = function (account) {
  // Calculating the total income (Filetring only the positive values from the movements array and then summing them up together)
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((accum, mov) => accum + mov, 0);
  //Printing already with the number formatting function
  labelSumIn.textContent = formatCurrency(
    incomes,
    account.locale,
    account.currency
  );
  // Calculating the total money out (Filetring only the negative values from the movements array and then summing them up together)
  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((accum, mov) => accum + mov, 0);
  //Printing already with the number formatting function
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    account.locale,
    account.currency
  ); //Getting rid of the negative sign, because we know already that the money is going out
  // Calculating the total interest (Filetring only the positive values from the movements array, because the interest happens on each deposit and then summing them up together and multiplying with the interest rate, for example, 1.2%). PS: Interests only happen if the interest value is greater or equal 1 Euro/dollar!
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100) //Each client has a specific interest rate!
    .filter(interest => interest > 1) //If the interes is less then 1, it does not count/ sum up
    .reduce((accum, interests) => accum + interests, 0);
  // labelSumInterest.textContent = `${interest}€`;
  //Printing already with the number formatting function
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
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

//Creating a function to update all the functions at once, when needed!
const updateUI = function (account) {
  //Display movements
  displayMovements(account);
  //Display balance
  calcDisplayBalance(account); //This one needs the account as parameter, not just the movements
  //Display summary
  calcDisplaySummary(account); //This one needs the account as parameter, not just the movements
};

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
  if (currentAccount?.pin === +inputLoginPin.value) {
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

    // Adjusting the currentDate:

    /*
    // Option 1: manually formatting the date
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, '0');
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, '0');
    const min = `${now.getMinutes()}`.padStart(2, '0');
    // dd/mm/yyyy
    labelDate.textContent = `${day}/${month}/${year}, at ${hour}:${min}`;
    */

    // Option 2: using INTERNATIONALIZATION API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', // we could use 'long' or '2-digit' as well.
      year: 'numeric', // we could use '2-digit' as well.
      // weekday: 'long',
    };
    // const locale = navigator.language; // Not necessary, because each user has its own locale on its object!
    // console.log(locale);
    // labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(now); // Trying in the US
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // This will displayMovements, calcDisplayBalance and calcDisplay Summary
    updateUI(currentAccount);
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
    labelWelcome.textContent = 'Log in to get started';
  }
});

// Implementing the transfer function
btnTransfer.addEventListener('click', function (e) {
  //Remember that the btnTransfer is a FORM, then each time it's clicked, the page reloads! So we must prevent form from submitting
  e.preventDefault();

  //Creating variables:
  const amount = +inputTransferAmount.value; //Establishing the document element to a variable to then use the variable to the if/else statements
  //The receiverAccount will only exist if we find the username. If not, receiverAccount = undefined
  const receiverAccount = accounts.find(function (account) {
    return account.username === inputTransferTo.value;
  });

  // console.log(receiverAccount); //Just checking if the find method is actually working

  // IF / ELSE Statements for the transfers possibilites
  // Possibility 1 -> When the transfer is valid
  if (
    receiverAccount?.username !== currentAccount.username &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAccount
  ) {
    // console.log('Transfer made!');

    //Showing temporary message to the interface
    labelTransferMessage.textContent = 'Transfer succeeded ✅';
    labelTransferMessage.classList.remove('hidden');
    setTimeout(function () {
      labelTransferMessage.classList.add('hidden');
    }, 2000);

    //Add negative movement to the currentAccount and adding transfer date
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    //Add positive movement to the receiverAccount and adding transfer date
    receiverAccount.movements.push(amount);
    receiverAccount.movementsDates.push(new Date().toISOString());
    //Update the page of the currentAccount -> This will displayMovements, calcDisplayBalance and calcDisplay Summary UPDATED
    updateUI(currentAccount);
  } // Possibility 2 -> When the receiverAccount does not exist
  else if (receiverAccount === undefined) {
    // console.log('Incorrect Username / Missing data');

    //Showing temporary message to the interface
    labelTransferMessage.textContent = 'Username not valid ❌';
    labelTransferMessage.classList.remove('hidden');
    setTimeout(function () {
      labelTransferMessage.classList.add('hidden');
    }, 2000);
  } // Possibility 3 -> When the receiverAccount is the same as the logged account
  else if (receiverAccount.username === currentAccount.username) {
    // console.log('You cannot transfer money to yourself.');

    //Showing temporary message to the interface
    labelTransferMessage.textContent =
      'You cannot transfer money to yourself ❌';
    labelTransferMessage.classList.remove('hidden');
    setTimeout(function () {
      labelTransferMessage.classList.add('hidden');
    }, 2000);
  } // Possibility 4 -> When the intended transfer amount is greater than the current balance of the user
  else if (currentAccount.balance < amount) {
    // console.log("You don't have enough money!");

    //Showing temporary message to the interface
    labelTransferMessage.textContent = "You don't have enough money ❌";
    labelTransferMessage.classList.remove('hidden');
    setTimeout(function () {
      labelTransferMessage.classList.add('hidden');
    }, 2000);
  } // Possibility 5 -> When the intended transfer amount is zero or a negative number
  else if (amount <= 0) {
    // console.log('Amount must be greater than 0!');

    //Showing temporary message to the interface
    labelTransferMessage.textContent = 'Amount must be greater than 0 ❌';
    labelTransferMessage.classList.remove('hidden');
    setTimeout(function () {
      labelTransferMessage.classList.add('hidden');
    }, 2000);
  }

  //Cleaning up the input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur(); //Just so it loses its focus
  inputTransferTo.blur(); //Just so it loses its focus
});

//Implementing the LOAN REQUEST functionality (Condition = The bank only grants a loan if there is at least 1 deposit with at least 10% of the requested loan amount!)
btnLoan.addEventListener('click', function (e) {
  //Remember that the btnLoan is a FORM, then each time it's clicked, the page reloads! So we must prevent form from submitting
  e.preventDefault();

  // Creating a variable with the user intended loan amount
  const amount = Math.floor(inputLoanAmount.value);
  // console.log(amount); //Just to see if the value is correct.

  // CONDITIONS FOR THE LOAN TO BE APPROVED: Amount must be greater than 0 and there must be at least 1 movement with at least 10% of the requested amount (.some method)
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Showing the "Analyzing request" message
    labelLoanMessage.textContent = 'Analyzing request... ⏳';
    labelLoanMessage.classList.remove('hidden');
    setTimeout(function () {
      labelLoanMessage.classList.add('hidden');
    }, 3000);

    // Accepting the request after 3 seconds of wait (analysis)
    setTimeout(function () {
      //Add positive movement to the currentAccount and the date
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      //Update the page of the currentAccount -> This will displayMovements, calcDisplayBalance and calcDisplay Summary UPDATED
      updateUI(currentAccount);
      // Showing the "Loan Approved!" message
      labelLoanMessage.textContent = 'Loan Approved! ✅';
      labelLoanMessage.classList.remove('hidden');
      setTimeout(function () {
        labelLoanMessage.classList.add('hidden');
      }, 2000);
    }, 3000);
  } //If the amount is zero or less than zero, it is not a valid value!
  else if (amount <= 0) {
    console.log('Not a valid value ❌');
    //Showing temporary message to the interface
    labelLoanMessage.textContent = 'Amount must be greater than 0 ❌';
    labelLoanMessage.classList.remove('hidden');
    setTimeout(function () {
      labelLoanMessage.classList.add('hidden');
    }, 2000);
  } //Last, if there isn't a movement which is at least 10% of the requested amount, the loan is denied!
  else if (!currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Showing the "Analyzing request" message
    labelLoanMessage.textContent = 'Analyzing request... ⏳';
    labelLoanMessage.classList.remove('hidden');
    setTimeout(function () {
      labelLoanMessage.classList.add('hidden');
    }, 3000);

    // Refusing the request after 3 seconds of wait (analysis)
    setTimeout(function () {
      // Showing the "Loan Refused!" message
      labelLoanMessage.textContent = 'Loan Refused! ❌ Too much money!';
      labelLoanMessage.classList.remove('hidden');
      setTimeout(function () {
        labelLoanMessage.classList.add('hidden');
      }, 2000);
    }, 3000);
  }
  // Setting the inputs information back to blank
  inputLoanAmount.value = '';
  inputLoanAmount.blur(); //Just so it loses its focus
});

//Implementing the CLOSE ACCOUNT function (Deleting the account object from the accounts array)
btnClose.addEventListener('click', function (e) {
  //Remember that the btnClose is a FORM, then each time it's clicked, the page reloads! So we must prevent form from submitting
  e.preventDefault();

  // Storing variables for the user inputs -> Username and Password
  const closeUsername = inputCloseUsername.value;
  const closePin = +inputClosePin.value;
  // console.log(closeUsername, closePin); //Just to see if the variables are actually working

  //Only if the information is correct, the deletion will be executed
  if (
    closeUsername === currentAccount.username &&
    closePin === currentAccount.pin
  ) {
    //Creating a variable with the index of the actual account object in the accounts array. Doing so, because we need to know what element delete from the accounts array.
    const currentAccountIndex = accounts.findIndex(function (account) {
      return account.username === closeUsername;
    });
    // console.log('Closed Account!', currentAccountIndex); just to make sure the .findIndex is actually working, also the if conditions

    // Now executing the deletion of the object from the array
    accounts.splice(currentAccountIndex, 1);

    // Adjusting the UI (Show the 'successful deletion' message and the original UI)
    labelDeletedAccount.classList.remove('hidden');
    setTimeout(function () {
      labelDeletedAccount.classList.add('hidden');
    }, 2000);
    containerApp.style.opacity = '0'; //Hiding all the information!
    labelWelcome.textContent = 'Log in to get started';
  } else {
    // Temporarily showing the message: 'Credentials not valid' if the user does not input the right conditions
    labelCloseAccountMessage.textContent = 'Credentials not valid 🚫';
    labelCloseAccountMessage.classList.remove('hidden');
    setTimeout(function () {
      labelCloseAccountMessage.classList.add('hidden');
    }, 2000);
  }

  // Setting the inputs information back to blank
  inputCloseUsername.value = inputClosePin.value = '';
  inputCloseUsername.blur(); //Just so it loses its focus
  inputClosePin.blur(); //Just so it loses its focus
});

// Implementing the btnSort functionality (set the sort parameter to true):
// Setting an outside variable to the default sortCodition (which is false, according to the displayMovements function)
let sortCondition = false;

// When clicking the btnSort, it will run the displayMovements function with the movements from the currentAccount and the opposite of the actual sort condition (If it's false, we will run the function with true), then changing the startCondition variable to it's opposite.
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sortCondition);
  sortCondition = !sortCondition;
});
