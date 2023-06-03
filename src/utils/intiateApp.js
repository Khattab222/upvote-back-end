import { connectionDB } from "../../Db/connection.js";
import * as allRoutes from '../modules/index.routes.js'
import { globalResponse } from "./errorHandling.js";
import xss from 'xss-clean'
import cors from 'cors'
import helmet from "helmet";
import hpp  from'hpp';
export const initiatApp = (app,express) => {
    
app.use(express.json());
app.use(helmet())
app.use(hpp())
const port = process.env.PORT || 5000;
const baseUrl = process.env.BASE_URL;
app.use(cors({
    origin:'http://localhost:3000'
}))

app.use(xss())
app.use(`${baseUrl}/auth`,allRoutes.authRouter );
app.use(`${baseUrl}/product`,allRoutes.productRouter );
app.use(`${baseUrl}/comment`,allRoutes.commentRouter );
app.use(`${baseUrl}/user`,allRoutes.userRouter );
app.use(`${baseUrl}/category`,allRoutes.categoryRouter );
app.all('*', (req,res,next) => {res.status(400).json({message:'page not found'})})
app.use(globalResponse)
connectionDB()


    app.listen(port,() => {
        console.log(`server listening on port ${port} .......`);
    })
}