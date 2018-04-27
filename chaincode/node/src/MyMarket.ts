import {Chaincode, ChaincodeError, Helpers, StubHelper} from '@theledger/fabric-chaincode-utils';
import * as Yup from 'yup';

interface User {
    UserID: string;
    Name: string;
    Phone: string;
}

export class MyMarket extends Chaincode{
    
    async queryData(stubHelper: StubHelper, args: string[]): Promise<any>{
        //<T> is Typescript Generics
        //Check number of arguments try to cast object using yup validate arguments against predefined types using yup return validated object
        const verifiedArgs = await Helpers.checkArgs<{Key:string}>(args, Yup.object()//Define an object schema. 
        .shape({//Define the keys of the object and the schemas for said keys.
            Key: Yup.string().required(),    
        }));
        
        const Data = stubHelper.getStateAsObject(verifiedArgs.Key); //get the tx from chaincode state //the state for the given key parsed as an Object
        if(!Data){
            throw new ChaincodeError('Data does not exist');
        }
        
        return Data;
    }
    
    async initLedger(stubHelper: StubHelper, args:string[]){
        let Datas = [{
            Name: '鴻海',
            Product: 'Stock',
            Frequency: 'Daily',
            TimeStamp: '20180401',
            OwnerID: '10001'
        },{
            Name: '安聯台灣科技基金',
            Product: 'fund',
            Frequency: 'Daily',
            TimeStamp: '20180311',
            OwnerID: '10002'
        },{
            Name: '元大台灣50',
            Product: 'ETF',
            Frequency: 'Daily',
            TimeStamp: '20180222',
            OwnerID: '10003'
        }];
        
        for (let i=0; i<Datas.length; i++){
            const Data: any = Datas[i];
            
            Data.docType = 'Data';
            await stubHelper.putState('Data' + i, Data);//Serializes the value and store it on the state db.
            this.logger.info( 'Added <--> ', Data);//the logger is by using winston to create our own logger.
        }
    }
    
    async createUser(stubHelper:StubHelper, args: string[]){
        const verifiedArgs = await Helpers.checkArgs<any>(args, Yup.object().shape({
            UserID: Yup.string().required(),
            Name: Yup.string().required(),
            Phone: Yup.string().required()
        }));
        
        let user = {Name: verifiedArgs.Name, Phone: verifiedArgs.Phone};
        
        await stubHelper.putState(verifiedArgs.UserID, user);
    }
    
    async createData(stubHelper:StubHelper, args: string[]){
        const verifiedArgs = await Helpers.checkArgs<any>(args, Yup.object()
        .shape({
            Key: Yup.string().required(),
            Name: Yup.string().required(),
            Product: Yup.string().required(),
            Frequency: Yup.string().required(),
            OwnerID : Yup.string().required(),
            TimeStamp : Yup.string().required()
            //TimeStamp: Yup.date().default(function() {
                       //return new Date})
        }));
        /*
        let date = new Date();
        let mon:String = (date.getMonth()+1).toString();
        if(mon.length==1) mon = "0"+mon;
        let today = date.getFullYear()+""+mon+""+date.getDate();
        */
        //Data加上 valid & invalid?
        //還有資料有效期限? 1年  6個月...
        let Data = {
            docType: 'Data',
            Name: verifiedArgs.Name,
            Product: verifiedArgs.Product,
            Frequency: verifiedArgs.Frequency,
            OwnerID: verifiedArgs.OwnerID,
            TimeStamp: verifiedArgs.TimeStamp
            //TimeStamp: today
        };
        
        await stubHelper.putState(verifiedArgs.Key, Data)
    }
    
    async queryAllDatas(stubHelper: StubHelper, args:string[]): Promise<any>{
        const startKey = 'Data0';
        const endKey = 'Data999';
        //Query the state by range
        return await stubHelper.getStateByRangeAsList(startKey, endKey);
    }
    
    async queryAllUsers(stubHelper: StubHelper, args:string[]): Promise<any>{
        const startKey = 'User0';
        const endKey = 'User999';
        //Query the state by range
        return await stubHelper.getStateByRangeAsList(startKey, endKey);
    }
    
    async changeDataOwner(stubHelper: StubHelper, args: string[]){
        
        const verifiedArgs = await Helpers.checkArgs<{Key: string; OwnerID: string}>(args, Yup.object()
            .shape({
                Key: Yup.string().required(),
                OwnerID: Yup.string().required(),
            }));
        
        let Data = await<any>stubHelper.getStateAsObject(verifiedArgs.Key);
        
        Data.OwnerID = verifiedArgs.OwnerID;
        
        await stubHelper.putState(verifiedArgs.Key, Data);
    }
}
