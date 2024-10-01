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
app.use(async (req,res,next) => {
    // if (!whitelist.includes(req.header('origin'))) {
    //    return next(new Error('not allowed by cors',{cause:403})) 
    // }
  await res.header('Access-Control-Allow-Origin','*');
  await res.header('Access-Control-Allow-Headers','*');
  await res.header('Access-Control-Allow-Private-Network','true');
  await res.header('Access-Control-Allow-Methods','PUT');

  next()
}
)
app.use(xss())
app.get('/',(req,res,next) => {
  return res.json({message:'welcome to upvote app bt khaled khattab'})
}
)
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
