import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path"

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js"

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __dirname = path.resolve()

app.use(express.json({limit:"10mb"})); // allows you to parse the body of request
app.use(cookieParser()); 

app.use("/api/auth",authRoutes)
app.use("/api/products",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/coupons",couponRoutes)
app.use("/api/payments",paymentRoutes)
app.use("/api/analytics",analyticsRoutes)


if (process.env.NODE_ENV === "production") {
    // 1a. Define the staticPath variable so it can be reused below.
    const staticPath = path.join(__dirname, "frontend", "dist");

    // 1b. Use express.static to serve all assets (JS, CSS, images, etc.).
    app.use(express.static(staticPath));

    // --- 2. Catch-All Client-Side Routing Fallback (The FIX) ---
    // app.use('*') is a more robust way to define a final fall-through 
    // catch-all route that works reliably when app.get('*') fails 
    // due to strict path parsing issues.
    app.use('*', (req, res) => {
        // Send the index.html file for client-side routing to take over.
        res.sendFile(path.resolve(staticPath, "index.html"));
    });
}




app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);

    connectDB();
})

