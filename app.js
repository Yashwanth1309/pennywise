if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const MongoDbStore = require('connect-mongo')
const localStrategy = require('passport-local')
const passportLocalMongoose=require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongo_sanitize = require('express-mongo-sanitize');
const User = require('./models/user.js')
const Expense = require('./models/expense.js')
const Friend = require('./models/friends.js')
const isLoggedIn = require('./middlewares/middleware.js')
const Authentication = require('./routes/Authentication.js')
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(mongo_sanitize())
app.use(express.json());
app.use(express.static("Public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

const secret = process.env.secret || 'SAVEMONEY'
const store = new MongoDbStore({
    mongoUrl: process.env.DB_URL,
    secret,
    touchAfter: 24 * 60 * 60
})
store.on('error', function(e) {
    console.log(e)
})
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Database connected")
    })
    .catch((e) => {
        console.error.bind(e)
    })
// app.use('/pennywise/user', Authentication)
// app.get('/', isLoggedIn, (req, res) => {
//     res.send('Home')
// })

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})


//Sammed's space =

app.get("/",function(req,res){
  res.sendFile(__dirname+"/webpages/landing_page/landing.html");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/login",function(req,res){
  res.redirect("/:user/dashboard");
});

app.post("/register",function(req,res){
  res.redirect("/:user/dashboard");
})

app.get("/forgot",function(req,res){
  res.send("working...");
})

// var checkItems=0;

app.get("/:user/dashboard",function(req,res){
  Expense.find().then(
    (result)=>{
      // console.log(result);
      res.render("dashboard",{expenses:result,user:req.params.user,items:[]});
    }
  ).catch((err)=>{console.log(err);})
});

app.post("/:user/dashboard_add",function(req,res){
  var added_date =req.body.date;
  var title = req.body.title;
  var amount =req.body.amount;
  var user=req.params.user;
  // console.log(added_date,title,amount);

  const expense = {
   Amount: amount,
   description: title,
   date: added_date
 };

  Expense.insertMany({expense: [expense]}).then(
    (result)=>{
      // console.log(result);
      console.log("Db updated successfully ");
      // checkItems=1;
      res.redirect("/:user/dashboard");
    }).catch((err)=>{console.log(err)})

});

app.post("/:user/dashboard_delete",function(req,res){
  var id=req.body.expenseId;
  console.log(id);
  Expense.updateOne({ "expense._id": id }, { $pull: { expense: { _id: id } } }).then(
    (result) => {
      // console.log(result);
      res.redirect(`/${req.params.user}/dashboard`);
    }
  ).catch((err) => {
    console.log(err);
    res.redirect(`/${req.params.user}/dashboard`);
  });
});

app.post("/:user/dashboard_history", function(req, res) {
var general_expenses=[]
  Expense.find().then(
    (result)=>{
      general_expenses=result;
    }
  ).catch((err)=>{console.log(err);})

if(req.body.show_all){
  Expense.find({
    // email: req.params.user,
  }).then((expenses) => {
    console.log(expenses);
    res.render("dashboard", {
      user: req.params.user,
      items: expenses,
      expenses:general_expenses
    });
  }).catch((err) => {
    console.log(err);
    res.redirect(`/${req.params.user}/dashboard`);
  });
}else{
  var selectedDate = new Date(req.body.date_input);
  var sortOption = req.body.sort_select;

  console.log(req.params.user);

  if(sortOption=="any"){
    Expense.find({
      // email: req.params.user,
      "expense.date": {
        $gte: selectedDate,
        $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
      }
    }).then((expenses) => {
      console.log(expenses);
      res.render("dashboard", {
        user: req.params.user,
        items: expenses,
        expenses:general_expenses
      });
    }).catch((err) => {
      console.log(err);
      res.redirect(`/${req.params.user}/dashboard`);
    });
  }

  if(sortOption=="amount_asc"){
    Expense.find({
  // email: req.params.user,
  "expense.date": {
    $gte: selectedDate,
    $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
  }
}).sort({"expense.Amount": 1}).then((expenses) => {
  console.log(expenses);
  res.render("dashboard", {
    user: req.params.user,
    items: expenses,
    expenses:general_expenses
  });
}).catch((err) => {
  console.log(err);
  res.redirect(`/${req.params.user}/dashboard`);
});
  }

  if(sortOption=="amount_dec"){
    Expense.find({
  // email: req.params.user,
  "expense.date": {
    $gte: selectedDate,
    $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
  }
}).sort({"expense.Amount": -1}).then((expenses) => {
  console.log(expenses);
  res.render("dashboard", {
    user: req.params.user,
    items: expenses,
    expenses:general_expenses
  });
}).catch((err) => {
  console.log(err);
  res.redirect(`/${req.params.user}/dashboard`);
});
  }

  if(sortOption=="category"){
    Expense.find({
  // email: req.params.user,
  "expense.date": {
    $gte: selectedDate,
    $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
  }
}).sort({"expense.category": 1}).then((expenses) => {
  console.log(expenses);
  res.render("dashboard", {
    user: req.params.user,
    items: expenses,
    expenses:general_expenses
  });
}).catch((err) => {
  console.log(err);
  res.redirect(`/${req.params.user}/dashboard`);
});
  }

 if(sortOption=='date_asc'){
   Expense.find({
  // email: req.params.user,
}).sort({"expense.date": 1}).then((expenses) => {
  console.log(expenses);
  res.render("dashboard", {
    user: req.params.user,
    items: expenses,
    expenses:general_expenses
  });
}).catch((err) => {
  console.log(err);
  res.redirect(`/${req.params.user}/dashboard`);
});
 }

 if(sortOption=='date_dec'){
   Expense.find({
  // email: req.params.user,
}).sort({"expense.date": -1}).then((expenses) => {
  console.log(expenses);
  res.render("dashboard", {
    user: req.params.user,
    items: expenses,
    expenses:general_expenses
  });
}).catch((err) => {
  console.log(err);
  res.redirect(`/${req.params.user}/dashboard`);
});
 }
}

});

app.get("/:user/loans",function(req,res){
  Friend.find().then(
    (result)=>{
      // console.log(result);
      res.render("loan",{loans:result,user:req.params.user,items:[]});
    }
  ).catch((err)=>{console.log(err);})
});

app.post("/:user/loans_add", function(req, res) {
  var userarr = req.params.user.split(":");
  var user = userarr[1];
  var added_date = req.body.date;
  var loan_type = req.body.loan_type;
  var person = req.body.person;
  var amount = req.body.amount;
  var reason = req.body.reason;
  console.log(user, added_date, loan_type, person, amount, reason);

  const friend = {
    date: added_date,
    type: loan_type,
    name: person,
    reason: reason,
    amount: amount
  };
  //Check if user already exists
  Friend.findOne({ email: user }).then(
    function(result) {
      if (result) {
        // User exists, update their friends array
        Friend.updateOne(
          { email: user },
          { $push: { friends: friend } }
        ).then(
          function(result) {
            console.log(result);
            console.log("Friend added");
            res.redirect("/:user/loans");
          }
        ).catch(function(err) {
          console.log(err);
        });
      } else {
        // User does not exist, insert new document
        Friend.create({
          email: user,
          friends: [friend]
        }).then(
          function(result) {
            console.log(result);
            console.log("User and friend added");
            res.redirect("/:user/loans");
          }
        ).catch(function(err) {
          console.log(err);
        });
      }
    }
  ).catch(function(err) {
    console.log(err);
  });
});

app.post("/:user/loans_delete",function(req,res){
  var id=req.body.loanid;
  console.log(id);
  Friend.updateOne({ "friends._id": id }, { $pull: { friends: { _id: id } } }).then(
    (result) => {
      console.log(result);
      console.log("Deleted successfully");
      res.redirect(`/${req.params.user}/loans`);
    }
  ).catch((err) => {
    console.log(err);
    res.redirect(`/${req.params.user}/loans`);
  });
});

//not working !!!
app.post("/:user/loan_history", function(req, res) {
  var general_loans = [];

  Friend.find().then((result) => {
    general_loans = result;
  }).catch((err) => {
    console.log(err);
  });

  if (req.body.show_all) {
    Friend.find({
      // email: req.params.user,
    }).then((friends) => {
      console.log(friends);
      res.render("loan", {
        loans: general_loans,
        user: req.params.user,
        items: friends,
      });
    }).catch((err) => {
      console.log(err);
      res.redirect(`/${req.params.user}/loans`);
    });
  } else {
    var user_catch=req.params.user.split(":");
    var user=user_catch[1];
    const selectedDate = new Date(req.body.date_input);
    var sortOption = req.body.sort_select;
    console.log(selectedDate,sortOption);

    if (sortOption == "any") {
  Friend.aggregate([
    {
      $match: {
        email: user,
        "friends.date": {
          $gte: new Date(selectedDate),
          $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $unwind: "$friends"
    },
    {
      $match: {
        "friends.date": {
          $gte: new Date(selectedDate),
          $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: "$_id",
        email: { $first: "$email" },
        friends: { $push: "$friends" }
      }
    }
  ]).then((results) => {
    console.log(results);
    res.render("loan", {
      loans: general_loans,
      user: req.params.user,
      items: results,
    });
  }).catch((err) => {
    console.log(err);
    res.redirect(`/${req.params.user}/loans`);
  });
} else if (sortOption == 'date_asc') {
  Friend.aggregate([
{
  $match: {
    email: user,
  }
},
{
  $unwind: "$friends"
},
{
  $sort: {
    "friends.date": 1 // Sort by date in ascending order
  }
},
{
  $group: {
    _id: "$_id",
    email: { $first: "$email" },
    friends: { $push: "$friends" }
  }
}
]).then((results) => {
        console.log(results);
        res.render("loan", {
          user: req.params.user,
          items: results,
          loans: general_loans
        });
      }).catch((err) => {
        console.log(err);
        res.redirect(`/${req.params.user}/loans`);
      });
    }else if (sortOption == 'date_dec') {
      Friend.aggregate([
    {
      $match: {
        email: user,
      }
    },
    {
      $unwind: "$friends"
    },
    {
      $sort: {
        "friends.date": -1 // Sort by date in ascending order
      }
    },
    {
      $group: {
        _id: "$_id",
        email: { $first: "$email" },
        friends: { $push: "$friends" }
      }
    }
    ]).then((results) => {
            console.log(results);
            res.render("loan", {
              user: req.params.user,
              items: results,
              loans: general_loans
            });
          }).catch((err) => {
            console.log(err);
            res.redirect(`/${req.params.user}/loans`);
          });
        }
        else if (sortOption=="type") {
      Friend.aggregate([
  {
    $match: {
      email: user,
      "friends.date": {
        $gte: new Date(selectedDate),
        $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
      }
    }
  },
  {
    $unwind: "$friends"
  },
  {
    $match: {
      "friends.date": {
        $gte: new Date(selectedDate),
        $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
      }
    }
  },
  {
    $sort: {
      "friends.type": 1
    }
  },
  {
    $group: {
      _id: "$_id",
      email: { $first: "$email" },
      friends: { $push: "$friends" }
    }
  }
]).then((results) => {
        console.log(results);
        res.render("loan", {
          user: req.params.user,
          items: results,
          loans: general_loans
        });
      }).catch((err) => {
        console.log(err);
        res.redirect(`/${req.params.user}/loans`);
      });
    }
    else if (sortOption=="amount_asc") {
      Friend.aggregate([
  {
    $match: {
      email: user,
      "friends.date": {
        $gte: new Date(selectedDate),
        $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
      }
    }
  },
  {
    $unwind: "$friends"
  },
  {
    $match: {
      "friends.date": {
        $gte: new Date(selectedDate),
        $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
      }
    }
  },
  {
    $sort: {
      "friends.amount": 1
    }
  },
  {
    $group: {
      _id: "$_id",
      email: { $first: "$email" },
      friends: { $push: "$friends" }
    }
  }
]).then((results) => {
  console.log(results[0].friends);
  res.render("loan", {
    user: req.params.user,
    items: results,
    loans: general_loans
  });
}).catch((err) => {
  console.log(err);
  res.redirect(`/${req.params.user}/loans`);
});
    }
    else if (sortOption=="amount_dec") {
      Friend.aggregate([
  {
    $match: {
      email: user,
      "friends.date": {
        $gte: new Date(selectedDate),
        $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
      }
    }
  },
  {
    $unwind: "$friends"
  },
  {
    $match: {
      "friends.date": {
        $gte: new Date(selectedDate),
        $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
      }
    }
  },
  {
    $sort: {
      "friends.amount": -1
    }
  },
  {
    $group: {
      _id: "$_id",
      email: { $first: "$email" },
      friends: { $push: "$friends" }
    }
  }
]).then((results) => {
        console.log(results);
        res.render("loan", {
          user: req.params.user,
          items: results,
          loans: general_loans
        });
      }).catch((err) => {
        console.log(err);
        res.redirect(`/${req.params.user}/loans`);
      });
    }
  }
});



app.get("/:user/insights",function(req,res){
  res.render("insights");
})
