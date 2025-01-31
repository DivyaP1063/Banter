const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const chatRoutes= require("./routes/Chats");
const messageRoutes= require("./routes/Message");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload= require("express-fileupload")

const dotenv = require("dotenv");
const chats = require("./data/data");

const {cloudinaryConnect} = require("./config/cloudinary");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://banter-frontend.onrender.com", // Vite dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // If sending cookies/auth headers
  })
);


app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp", // You might need to change this depending on your system's temp folder
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  })
);

// cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth/user", userRoutes);
app.use("/api/v1/auth/chat", chatRoutes);
app.use("/api/v1/auth/message", messageRoutes);


//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

const server = app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://banter-frontend.onrender.com",
  },
}); 

io.on("connection",(socket)=>{
	console.log("connected to socket.io");

	socket.on('setup',(userData)=>{
		socket.join(userData._id);
		console.log(userData._id);
		socket.emit("connected"); 
	})

	socket.on('join chat',(room)=>{
		socket.join(room);
		console.log("User Joined Room: "+room);
		socket.emit("connected"); 
	})

	socket.on("typing", (room) => socket.in(room).emit("typing"));
	socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

	socket.on("new message", (newMessageRecieved) => {
		var chat = newMessageRecieved.chat;

		if (!chat.users) return console.log("chat.users not defined");

		chat.users.forEach((user) => {
		if (user._id == newMessageRecieved.sender._id) return;

		socket.in(user._id).emit("message recieved", newMessageRecieved);
		});
	});

	socket.off("setup", () => {
		console.log("USER DISCONNECTED");
		socket.leave(userData._id);
	});
})

