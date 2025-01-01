const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const chatRoutes= require("./routes/Chats");
const messageRoutes= require("./routes/Message");
// const profileRoutes = require("./routes/Profile");
// const paymentRoutes = require("./routes/Payments");
// const courseRoutes = require("./routes/Course");
// const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const {cloudinaryConnect } = require("./config/cloudinary");
// const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const chats = require("./data/data");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(
// 	cors({
// 		origin:"https://studynotionfrontend-mn8v.onrender.com",
// 		credentials:true,
// 	})
// )

// app.use(
// 	fileUpload({
// 		useTempFiles:true,
// 		tempFileDir:"/tmp",
// 	})
// )
//cloudinary connection
// cloudinaryConnect();

//routes
app.use("/api/v1/auth/user", userRoutes);
app.use("/api/v1/auth/chat", chatRoutes);
app.use("/api/v1/auth/message", messageRoutes);
// app.use("/api/v1/profile", profileRoutes);
// app.use("/api/v1/course", courseRoutes);
// app.use("/api/v1/payment", paymentRoutes);
// app.use("/api/v1/reach", contactUsRoute);

// app.get("/api/chat",(req,res)=>{
// 	res.send(chats);
// })
// app.get("/api/chat/:id",(req,res)=>{
// 	const singlechat=chats.find((c)=>c._id===req.params.id);
// 	return res.send(singlechat);
// })

//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})

