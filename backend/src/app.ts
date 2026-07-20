import express from 'express';
import authRoutes from './routes/auth.routes'
import invoiceRoutes from "./routes/invoice.routes";
import cookieParser from 'cookie-parser';

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


app.use("/api/auth", authRoutes)
app.use("/api/invoice", invoiceRoutes);


export default app;