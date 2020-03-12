// the express module exports a top-level function

// that function creates a new application object that encapsulates the 
// functionality of your Express server
const express = require('express');

// import Morgan, an HTTP request logger
const morgan = require('morgan');

// invoke the function to create the application
const app = express();

// use() is provided by the Express app object for mounting middleware

// Morgan provides predefined format strings such as combined, common, dev, short, and tiny
app.use(morgan('dev'));

// the app object has methods for 1) routing HTTP requests 
// 2) configuring middleware 3) numerous other functionalities

// add a function that responds with some text to GET request to the root URL

// use the HTTP Request object 'req' to send some text to the client
app.get('/', (req, res) => {
    res.send('Hello Melanie - good job!');
});

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});

app.get('/burgers', (req, res) => {
    res.send('We have juicy cheese burgers!');
})

app.get('/pizza/pepperoni', (req, res) => {
    res.send('Your pizza is on the way');
})

app.get('/pizza/pineapple', (req, res) => {
    res.send('We love pineapples!')
})

// looking at Request object properties
app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
        Base URL: ${req.baseUrl}
        Host: ${req.hostname}
        Path: ${req.path}
        Staleness: ${req.stale}
        Secure: ${req.secure}
        Route: ${req.rouute}
        QueryObj: ${req.query.key}
        Protocol: ${req.protocol}
    `;
    res.send(responseText);
});

// examining queries
app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end(); //do not send any data back to the client
});

// using query parameter values to do something useful
app.get('/greetings', (req, res) => {
    // get values from the request
    const name = req.query.name;
    const race = req.query.race;

    // validate the values (don't trust the client)
    if(!name) {
        // name was not provided
        return res.status(400).send('Please provide a name');
    }

    if(!race) {
        // race was not provided
        return res.status(400).send('Please provide a race');
    }

    // name and race are valid so do the processing
    const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

    // send the response
    res.send(greeting);
});

// Drill One
app.get('/sum', (req, res) => {
    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);

    if(!a) {
        return res.status(404).send('a is required')
    }

    if(!b) {
        return res.status(404).send('b is required')
    }

    if(Number.isNaN(a)) {
        return res.status(404).send('a must be a number')
    }

    if(Number.isNaN(b)) {
        return res.status(400).send('b must be a number')
    }

    const total = a+b;

    res.status(200).send(`The sum is ${total}`)
})

// Drill Two

app.get('/cipher', (req, res) => {

    if(!text) {
        return res.status(400).send('text is required')
    }

    if(!shift) {
        return res.status(400).send('shift is required')
    }

    const text = req.query.text;
    const shift = parseInt(req.query.shift);
    
    if (Number.isNaN(numShift)) {
        return res.status(400).send('shift must be a number')
    }

    // save the text query as an array
    const letters = text.split('');
    
    // initalize an array that will store the encypted integers 
    // (UTF-16 code + amount specified by shift query)
    const integers = [];

    letters.forEach(letter => {
        const int = letter.charCodeAt(0);
        const encryptedInt = int + shift;
        integers.push(encryptedInt);
    })

    // initalize array to store the encrypted letters
    const encryptedLetters = [];

    // convert the integer back to its string value 
    integers.forEach(int => {
        const newLetter = String.fromCharCode(int);
        encryptedLetters.push(newLetter);
    })

    // convert the array of encrypted letters to a string
    const encryptedText = encryptedLetters.join('');

    // response with the encrypted text
    res.status(200).send(`${encryptedText}`)
})

app.get('/lotto', (req, res) => {
    const { numbers } = req.query;

    // Validation

    if(!numbers) {
        return res.status(400).send('numbers is required')
    }

    if(!Array.isArray(numbers)) {
        return res.status(400).send('numbers must be an array')
    }

    const guesses = numbers
            .map(num => parseInt(num))
            .filter(num => !Number.isNaN(num) && (num >= 1 && num <= 20));

    console.log(guesses);

    if(guesses.length != 6) {
        return res.status(400).send('numbers must contain 6 integers between 1 and 20');
    }

    // now generate the lottery numbers
    function generateRandoms(min, max, numOfRandoms, unique){
        var getRandom = function(x, y){
          return Math.floor(Math.random() * (x - y + 1) + y);
        }
        var randoms = [];
        while(randoms.length<numOfRandoms){
          var random = getRandom(min, max);
          if(randoms.indexOf(random)==-1||!unique){
            randoms.push(random);
          }
        }
        return randoms;
    }
    const lottoNums = generateRandoms(1, 20, 6, true);
    console.log(lottoNums);

    // check for the number of matches
    const missedNums = lottoNums.filter(num => !guesses.includes(num))
    console.log(missedNums);

    let responseText = '';

    switch(missedNums.length){
      case 0: 
        responseText = 'Wow! Unbelievable! You could have won the mega millions!';
        break;
      case 1:   
        responseText = 'Congratulations! You win $100!';
        break;
      case 2:
        responseText = 'Congratulations, you win a free ticket!';
        break;
      default:
        responseText = 'Sorry, you lose';  
    }

    res.send(responseText);
})

// the logic isn't working perfectly for checking matches (in the sample solution) but will return to this later.  Overall, I understand how to do these drills.