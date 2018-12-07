To run the app locally, enter the app directory and run this in your command line terminal:

touch .env

Then find .env.sample provided in the public repository directory.

Copy and paste the contents of .env.sample file into .env file.

Configure the SQL database by running this in your command line terminal:

sequelize db:migrate


Then, run "npm start"


# DivvyUp


One problem with grocery shopping is that it takes too long and things you might need may be in several different locations of the store. If you were with a group of friends or family, you can divide and conquer this task by splitting up. Enter DivvyUp. This application allows different users from multiple devices to log into their profile and add items to a shopping list. Multiple users can work together to shop faster and complete grocery shopping. Some of the features included are the ability to add an item to a list, edit and delete it, and also set a max budget and priority to an item. Any user can do this, regardless of who added the item. This app will update in real-time, using a PSQL database to keep track of the data of each user, item, and status of the item. When an item is completed, it will show a checkmark to denote it's been purchased. If this happen to be a mistake, it can also be unmarked as purchased. Some features that would be added given time include private items, groups of users, and pictures of items. If I had more time on this project, I would try to implement a "HasOne" association between an item and its completion status, because there is a weird instance where the database retains the "marks" model data after it's parent "item" is deleted. Also, I'd like to implement the flash messages upon faulty sign-up/sign-in, and other invalid operations the app has (improper datatype input, etc.) to notify users what exactly it is they are doing incorrectly. Basically, just clean up the routes so that the application experience is holistic. This application saves user, item, and item status information as models in psql. The front end is rendered using EJS, I tend to like rendering the front-end directly from the back-end because it looks very simple and clean, especially for the purposes of getting a minimally viable product out there.  
