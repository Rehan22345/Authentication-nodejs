const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const connect = require("./db/connect.js");
const Blog = require("./model/blogs.js");
const User = require("./model/user.js");
const jwt = require("jsonwebtoken");
const cookie_parser = require("cookie-parser")
app.use(express.json());
app.use(cookie_parser())
app.use(express.urlencoded({ extended: true }));
connect();
// setuping ejs 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const verifymiddlewares = (req,res,next)=>{
    const token = req.cookies.Tokens; // acessing  the token from the cookie

    if(!token){ // checking if there is token coming or not 
         res.status(401).send({message:"Please login to access this resource"})
    }else{
const decoded = jwt.verify(token,"DispanToken"); // verifying or validation the token on the basis of secret key
req.users = decoded; // pushing users  data to the request object

next(); // if everything works fine then  we are calling the next middleware function it will move to next routes 

    }

}

// creating a new middlewares where we have verify the token with secret key before going to particular routes 


app.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find(); // Correct model name to `Blog`
    res.render("index", { blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("An error occurred while fetching blogs.");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/create", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await User.create({ name, email, password });
    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email == "" || password == "") {
    return res.json({ message: "please provide the crenditials" });
  }
  const users = await User.find({ email: email });
  console.log(users)
  const person = users[0];
  if (users.length == 0) {
    res.json({
      message: "User not found",
    });
  } else if (person.email == email && person.password == password) {
    const token = jwt.sign({email},'DispanToken',{ // siging a token for payload email anbd which will be expires in 30days
        expiresIn : "30d"
    });
    res.cookie("Tokens",token); // sending back that token as repsosne for cookie in varibale name of Tokens

    res.json({
      message: "Login Successfull",
    });
  }

  console.log(users);
});

app.get("/create-blog",verifymiddlewares ,(req, res) => {
  res.render("blog");
});

app.post("/add-blog", async (req, res) => {
  const { title, subtitle, description } = req.body;
  await Blog.create({
    title: title,
    subtitle: subtitle,
    description: description,
  });
  res.json({
    message: "Blog created successfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
