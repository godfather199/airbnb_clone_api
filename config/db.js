import {connect, set} from 'mongoose'

set('strictQuery', true)


 const connect_MongoDB = () => {
   connect(process.env.MONGO_URI, {
   //  useNewUrlParser: true,
      //  useUnifiedTopology: true,
     })
       .then(() => {
         console.log(`Connected to MongoDB`);
       })
       .catch((err) => {
         console.log(`Unable to connect to MongoDB: ${err}`);
       });
 };

export default connect_MongoDB