const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;


const users = {
  'Azeesha': 'password123',
  'Fatime': 'password1234'
};

// Log file setup
const logFile = 'user_activity_log.txt';

// Function to format date
function formatDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

// Log user interaction function
function logUserInteraction(user, action) {
  const date = new Date();
  const formattedDate = formatDate(date);
  const logMessage = `User: ${user}\nDate: ${formattedDate}\nAction: ${action}\n\n`;

  fs.appendFile(logFile, logMessage, (err) => {
    if (err) {
      console.error("Error writing to the log file:", err);
    } else {
      console.log("User activity logged.");
    }
  });
}

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Route to handle root URL and show a simple HTML form
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Login Page</h1>
    <form method="POST" action="/login">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required><br><br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required><br><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Route to handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists and password matches
  if (users[username] && users[username] === password) {
    // Log the login event
    logUserInteraction(username, `Logged in successfully`);

    res.send(`<h1>Welcome ${username}!</h1><p>You are logged in.</p>`);
  } else {
    res.send('<h1>Login failed</h1>');
  }
});

// Route for any user action (example: sending a message)
app.post('/send-message', (req, res) => {
  const { username, message } = req.body;

  // Check if message is provided
  if (!message) {
    res.send("<h1>Please provide a message.</h1>");
    return;
  }

  // Log the user action (sending a message)
  logUserInteraction(username, `Sent message: ${message}`);

  res.send(`<h1>Message sent by ${username}!</h1><p>Your message: ${message}</p>`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
