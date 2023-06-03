import mongoose from "mongoose";


export const connectionDB =async () => {
    return await mongoose.connect(process.env.DB_URL_LOCAL).then((res) => console.log('db connected done..........'))
    .catch((err) => console.log('fail ot connect db ...', err))
}

