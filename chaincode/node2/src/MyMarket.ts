import {Chaincode, ChaincodeError, Helpers, StubHelper} from '@theledger/fabric-chaincode-utils';
import * as Yup from 'yup';

//const shim = require('fabric-shim');
//import { Stub } from 'fabric-shim';

interface User {
    UserID: string;
    Name: string;
    Phone: string;
    Role: string;
}
//使用權的紀錄
interface UserData {
    UserID: string;
    DataID: string;
    TimeStamp: string;
}


/** 失敗的function寫法
 * @param {"fabric-shim".Stub} stub
 */
/*async function getQueryResultAsIterator(query: string | object): Promise<any> {
    let queryString: string;
    let stub = new Stub();
    
    if (typeof(query)=="object") {
        queryString = JSON.stringify(query);
    } else {
        queryString = <string>query;
    }

    //this.logger.debug(`Query: ${queryString}`);

    const iterator = await this.stub.getQueryResult(queryString);

    return iterator;
}*/

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
    // 還沒完成
    async queryDataWithRole(stubHelper: StubHelper, args: string[]): Promise<any>{
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
    
    async queryComplicatedData(stubHelper: StubHelper, args: string[]): Promise<any>{
        /*    
        const Data = stubHelper.getQueryResultAsList({
            "selector": {
                "Name": "鴻海"
            },
            "limit": 5,
            //"skip": 0,
            "sort": [{"owner": "desc"}, {"storename": "desc" }]//,
            //"fields": ["storename","marbles"]
        });*/
        //sort跟limit這些值沒辦法達到效果
        /*const Data = stubHelper.getQueryResultAsList({
            "selector": {"Frequency": "Daily"},"limit":2,"skip":1,"sort": {"Name": "desc"},"fields": ["name"]
        });*/
        const Data = stubHelper.getQueryResultAsList({
            "selector": {"Frequency": "Daily"},"limit":2,"skip":0
        });
        /*const Data = stubHelper.getQueryResultAsList({
            "selector": {"Interval": "1 y"},"limit":2,"skip":0
        });*/
        this.logger.info( 'ComplicatedData <--> Data!!!!!!!!', Data);
        this.logger.info( 'ComplicatedData <--> Data', Data);
        this.logger.info( 'ComplicatedData <--> Data[0]', Data[0]);
        return Data;
    }
    
    async queryComplicatedData_Interval(stubHelper: StubHelper, args: string[]): Promise<any>{
        const verifiedArgs = await Helpers.checkArgs<{Interval:string}>(args, Yup.object()//Define an object schema. 
        .shape({//Define the keys of the object and the schemas for said keys.
            Interval: Yup.string().required(),    
        }));
        
        const Data = stubHelper.getQueryResultAsList({
            "selector": {"Interval": verifiedArgs.Interval}
        });
        this.logger.info( 'ComplicatedData_Interval <--> Data!!!!!!!!', Data);
        return Data;
    }
    
    async queryComplicatedData_OwnerID(stubHelper: StubHelper, args: string[]): Promise<any>{
        const verifiedArgs = await Helpers.checkArgs<{OwnerID:string}>(args, Yup.object()//Define an object schema. 
        .shape({//Define the keys of the object and the schemas for said keys.
            OwnerID: Yup.string().required(),    
        }));
        
        const Data = stubHelper.getQueryResultAsList({
            "selector": {"OwnerID": verifiedArgs.OwnerID}
        });
        this.logger.info( 'ComplicatedData_UserID <--> Data!!!!!!!!', Data);
        return Data;
    }
    //使用權的查詢
    async queryComplicatedData_UserData(stubHelper: StubHelper, args: string[]): Promise<any>{
        const verifiedArgs = await Helpers.checkArgs<{UserID:string; DataID:string}>(args, Yup.object()//Define an object schema. 
        .shape({//Define the keys of the object and the schemas for said keys.
            UserID: Yup.string().required(),    
            DataID: Yup.string().required(),
        }));
        
        //DataID可以為"ALL"代表query全部
        let Data;
        if( verifiedArgs.DataID == "ALL"){
            Data = stubHelper.getQueryResultAsList({
                "selector": {"UserID": verifiedArgs.UserID,"$not":{"DataID":""}}
            });
        }else{
            Data = stubHelper.getQueryResultAsList({
                "selector": {"UserID": verifiedArgs.UserID,"DataID": verifiedArgs.DataID}
            });
        }
        this.logger.info( 'ComplicatedData_UserID <--> Data!!!!!!!!', Data);
        return Data;
    }
    /* 失敗的js code
    async queryComplicatedDataJS(stub:Stub, query: string | object): Promise<any>{
        
        let queryString: string;
        //let stub = new Stub();

        if (typeof(query)=="object") {
            queryString = JSON.stringify(query);
        } else {
            queryString = <string>query;
        }
        
        const iterator = await stub.getQueryResult({
            //"{\"selector\":{\"Frequency\":\"Daily\"}}"
            selector": {"Frequency": "Daily"}
        });
        
        //const iterator = await this.stub.getQueryResult(queryString);

        return iterator.next(); 
        
    }*/
    
    /*async getQueryResultAsList(query: string | object, keyValue?: boolean): Promise<object[] | KV[]> {
        let queryString: string;

        if (_.isObject(query)) {
            queryString = JSON.stringify(query);
        } else {
            queryString = <string>query;
        }

        this.logger.debug(`Query: ${queryString}`);

        const iterator = await this.stub.getQueryResult(queryString);

        if (keyValue) {
            return Transform.iteratorToKVList(iterator);
        }

        return Transform.iteratorToList(iterator);
    }*/
    
    async initLedger(stubHelper: StubHelper, args:string[]){
        let Datas = [{
            Name: '鴻海',
            Product: 'Stock',
            Frequency: 'Daily',
            Interval: '1 min',
            TimeStamp: '2018/04/01 12:11:11',
            OwnerID: 'User1'
        },{
            Name: '安聯台灣科技基金',
            Product: 'fund',
            Frequency: 'Daily',
            Interval: '1 m',
            TimeStamp: '2018/03/11 22:10:15',
            OwnerID: 'User1'
        },{
            Name: '元大台灣50',
            Product: 'ETF',
            Frequency: 'Weekly',
            Interval: '1 y',
            TimeStamp: '2018/02/22 14:28:55',
            OwnerID: 'User2'
        },{
            Name: '利安資金越南基金(新元)',
            Product: 'Fund',
            Frequency: 'Weekly',
            Interval: '1 y',
            TimeStamp: '2018/02/22 14:28:55',
            OwnerID: 'User2'
        }];
        
        let Users = [{
            //UserID : 'User1',
            Name : 'Happy',
            Phone : '0299301111',
            Role : 'Admin'
        },{
            //UserID : 'User2',
            Name : 'Bruce',
            Phone : '28825252',
            Role : 'User'
        },{
            //UserID : 'User3',
            Name : 'Daniel',
            Phone : '0912123123',
            Role : 'User'
        }];
        
        for (let i=0; i<Datas.length; i++){
            const Data: any = Datas[i];
            
            Data.docType = 'Data';
            await stubHelper.putState('Data' + i, Data);//Serializes the value and store it on the state db.
            this.logger.info( 'Added <--> ', Data);//the logger is by using winston to create our own logger.
        }
        
        for (let i=0; i<Users.length; i++){
            const User: any = Users[i];
            
            User.docType = 'User';
            await stubHelper.putState('User'+i, User);//Serializes the value and store it on the state db.
            this.logger.info( 'Added <--> ', User);//the logger is by using winston to create our own logger.
        }
        
        let UserDatas = [{
            UserID : 'User1',
            DataID : 'Data1',
            TimeStamp : '2018/04/01 12:11:11'
        },{
            UserID : 'User1',
            DataID : 'Data2',
            TimeStamp : '2018/03/11 22:10:15',
        },{
            UserID : 'User2',
            DataID : 'Data3',
            TimeStamp : '2018/02/22 14:28:55'
        },{
            UserID : 'User2',
            DataID : 'Data4',
            TimeStamp : '2018/02/22 14:28:55'
        }];
        
        for (let i=0;i<UserDatas.length;i++){
            await stubHelper.putState('UserData'+i,UserDatas[i]);
            this.logger.info('Added <-->', UserDatas[i]);
        }
    }
    
    async createUser(stubHelper:StubHelper, args: string[]){
        const verifiedArgs = await Helpers.checkArgs<any>(args, Yup.object().shape({
            UserID: Yup.string().required(),
            Name: Yup.string().required(),
            Phone: Yup.string().required(),
            Role: Yup.string().required()
        }));
        
        let user = {Name: verifiedArgs.Name, Phone: verifiedArgs.Phone, Role:  verifiedArgs.Rule};
        
        await stubHelper.putState(verifiedArgs.UserID, user);
    }
    
    async createData(stubHelper:StubHelper, args: string[]){
        const verifiedArgs = await Helpers.checkArgs<any>(args, Yup.object()
        .shape({
            DataID: Yup.string().required(),
            Name: Yup.string().required(),
            Product: Yup.string().required(),
            Frequency: Yup.string().required(),
            Interval: Yup.string().required(),
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
        //改成ownerID不會換人，而是販售使用權?
        let Data = {
            docType: 'Data',
            Name: verifiedArgs.Name,
            Product: verifiedArgs.Product,
            Frequency: verifiedArgs.Frequency,
            Interval: verifiedArgs.Interval,
            OwnerID: verifiedArgs.OwnerID,
            TimeStamp: verifiedArgs.TimeStamp
            //TimeStamp: today
        };
        
        await stubHelper.putState(verifiedArgs.DataID, Data)
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
    
    async checkDataValid(stubHelper: StubHelper, args: string[]){
        
        const verifiedArgs = await Helpers.checkArgs<{Key: string; NowTimeStamp: string}>(args, Yup.object()
           .shape({
                Key: Yup.string().required(),
                NowTimeStamp: Yup.string().required(),
        }));
        
        let Data = await<any>stubHelper.getStateAsObject(verifiedArgs.Key);
        
        let TimeStamp_Split = Data.TimeStamp.split(" ");
        let myDate = TimeStamp_Split[0].split("/");
        let Time = TimeStamp_Split[1].split(":");
        let TimeInterval = Data.Interval.split(" ");//split into array
        ////console傳不到前面 要用docker logs 在 container看
        console.log("in front of switch!");
        this.logger.info( 'in front of switch! <--> ');
        
        switch(TimeInterval[1]){
            case 'm':
                myDate[1] = parseInt(myDate[1])+parseInt(TimeInterval[0]);
                if(myDate[1].toString().length==1) myDate[1] = "0"+myDate[1];
                console.log(myDate[1]);
                this.logger.info( 'myDate[1] <--> ', myDate[1]);
                break;
            case 'y':
                myDate[0] = parseInt(myDate[0])+parseInt(TimeInterval[0]);
                console.log(myDate[0]);
                this.logger.info( 'myDate[0] <--> ', myDate[0]);
                break;
            case 'min':// minutes for test
                Time[1] = parseInt(Time[1])+parseInt(TimeInterval[0]);
                if(Time[1].toString().length==1) Time[1] = "0"+Time[1];
                console.log(Time[1]);
                this.logger.info( 'Time[1] <--> ', Time[1]);
                break;
            default:
                console.log("Interval format error!");
                this.logger.info( 'Interval format error! <--> ');
        }
        
        //add new property to object
        Data.NowTimeStamp = verifiedArgs.NowTimeStamp;
        let ValidTimeStamp = myDate[0]+"/"+myDate[1]+"/"+myDate[2] +" "+ Time[0]+":"+Time[1]+":"+Time[2];
        this.logger.info( 'ValidTimeStamp <--> ', ValidTimeStamp);
        if(Date.parse(Data.NowTimeStamp).valueOf() < Date.parse(ValidTimeStamp).valueOf()){
            console.log("Valid data use right!");
            //考慮是否原先的Data值要新增Valid欄位
            Data.Valid = true;
            return Data;
        }else{
            console.log("Invaild data use right!");
            Data.Valid = false;
            return Data;
        }
        
    }
    
}
