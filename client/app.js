'use strict';

var app = angular.module('application', []);
var y,mon,d,h,min,s;
var ShowTime = function(){
        var NowDate=new Date();
        y= String(NowDate.getFullYear());
        mon= String(NowDate.getMonth()+1);
        d= String(NowDate.getDate());
        h= String(NowDate.getHours());
        min= String(NowDate.getMinutes());
        s= String(NowDate.getSeconds());
        //console.log(mon+" type: "+ typeof mon+" length: "+mon.length);
        if(mon.length==1) mon = "0"+mon;
        if(d.length==1) d = "0"+d;
        if(h.length==1) h = "0"+h;
        if(min.length==1) min="0"+min;
        if(s.length==1) s="0"+s;
        document.getElementById('showbox').innerHTML = y+"/"+mon+"/"+d+" "+h+':'+min+':'+s;
        setTimeout('ShowTime()',1000);
}

// Angular Controller
app.controller('appController',function($scope, appFactory){
    console.log("into appController");
    $("#success_holder").hide();
    $("#success_create").hide();
    $("#error_holder").hide();
    $("#error_query").hide();
    
    $scope.query_queryAllDatas = function(){
        //console.log(y+"-"+mon+"-"+d+" "+h+':'+min+':'+s);
        console.log("into query_qGetAllDatas");
        //var id = $scope.alo_UserID;
        
        appFactory.query_queryAllDatas(function(data){
            $scope.query_queryAllDatas = data;
            console.log("I'm in appController queryAllDatas "+ data);
            if($scope.query_qGetAllDatas == "Could not queryAllDatas"){
                console.log("Could not queryAllDatas");
                $("error_query").show();
            }else{
                $("#error_query").hide();
            }
        });
                                      
    }
    
    $scope.query_queryData_Data1 = function(){
        //console.log(y+"-"+mon+"-"+d+" "+h+':'+min+':'+s);
        console.log("into query_queryData_Data1");
        //var id = $scope.alo_UserID;
        
        appFactory.query_queryData_Data1(function(data){
            $scope.query_queryData_Data1 = data;
            console.log("I'm in appController queryData_Data1 "+ data);
            if($scope.query_queryData_Data1 == "Could not queryData_Data1"){
                console.log("Could not queryData_Data1");
                $("error_query").show();
            }else{
                $("#error_query").hide();
            }
        });
                                      
    }
    
    $scope.query_queryData_Spe = function(){
        console.log("into query_queryData_Spe");
        
        var DataKey = $scope.QSD_DataKey;
        
        appFactory.query_queryData_Spe(DataKey,function(data){
            $scope.query_queryData_Spe = data;
            console.log("I'm in appController specific query "+ data);
            if($scope.query_qGetUserSpe == "Could not locate Data"){
                console.log()
                $("error_query").show();
            }else{
                $("#error_query").hide();
            }
        });                                
    }
    
    $scope.query_checkDataValid = function(){
        console.log("into check Data Vaild");
        
        var DataKey = $scope.CDV_DataKey;
        
        appFactory.query_checkDataValid(DataKey,function(data){
            $scope.query_checkDataValid = data;
            console.log("I'm in appController check Data Valid "+ data);
            if($scope.query_checkDataValid == "Could not locate Data"){
                console.log()
                $("error_query").show();
            }else{
                $("#error_query").hide();
            }
        });                                
    }
    
    /*
    $scope.query_qGetUserSpe = function(){
        console.log("into query_qGetUserSpe");
        
        var UserID = $scope.alo_UserID;
        
        appFactory.query_qGetUserSpe(UserID,function(data){
            $scope.query_qGetUserSpe = data;
            console.log("I'm in appController specific query "+ data);
            if($scope.query_qGetUserSpe == "Could not locate User"){
                console.log()
                $("error_query").show();
            }else{
                $("#error_query").hide();
            }
        });
                                      
    }
    
    $scope.query_qGetItem_1000 = function(){
        console.log("into query_qGetItem_1000");
        //var id = $scope.alo_UserID;
        
        appFactory.query_qGetItem_1000(function(data){
            $scope.query_qGetItem_1000 = data;
            console.log("I'm in appController Item query "+ data);
            if($scope.query_qGetItem_1000 == "Could not locate Item_1000"){
                console.log()
                $("error_query").show();
            }else{
                $("#error_query").hide();
            }
        });
                                      
    }
    
    $scope.query_qGetItemSpe = function(){
        console.log("into query_qGetItemSpe");
        
        var ItemID = $scope.alo_ItemID;
        
        appFactory.query_qGetItemSpe(ItemID,function(data){
            $scope.query_qGetItemSpe = data;
            console.log("I'm in appController specific Item query "+ data);
            if($scope.query_qGetItemSpe == "Could not locate ItemSpe"){
                console.log()
                $("error_query").show();
            }else{
                $("#error_query").hide();
            }
        });                                
    }
    
    $scope.query_qGetAuctionRequest = function(){
        console.log("into query_qGetAuctionRequest");
        
        var AuctionID = $scope.aloAuctionRequest_AuctionID;
        
        appFactory.query_qGetAuctionRequest(AuctionID,function(data){
            $scope.query_qGetAuctionRequest = data;
            console.log("I'm in appController AuctionRequest query "+ data);
            if($scope.query_qGetAuctionRequest == "Could not locate AuctionRequest"){
                console.log()
                $("error_query").show();
            }else{
                $("#error_query").hide();
            }
        });                                
    }
    
    $scope.query_qGetListOfBids = function(){
        console.log("into query_qGetListOfBids");
        
        var AuctionID = $scope.aloBid_AuctionID;
        
        appFactory.query_qGetListOfBids(AuctionID,function(data){
            $scope.query_qGetListOfBids = data;
            console.log("I'm in appController List Of Bids query "+ data);
            if($scope.query_qGetListOfBIds == "Could not locate List Of Bids"){
                console.log()
                $("error_query").show();
            }else{
                $("#error_query").hide();
            }
        });                                
    }
    
    $scope.query_qGetHighestBid = function(){
        console.log("into query_qGetHighestBid");
        
        var AuctionID = $scope.aloHighBid_AuctionID;
        
        appFactory.query_qGetHighestBid(AuctionID,function(data){
            $scope.query_qGetHighestBid = data;
            console.log("I'm in appController Highest Bid query "+ data);
            if($scope.query_qGetHighestBid == "Could not locate Highest Bid"){
                console.log()
                $("error_query").show();
            }else{
                $("#error_query").hide();
            }
        });                                
    }
    */
    
    
    
    $scope.initLedger = function(){
        console.log("into initLedger");
        appFactory.initLedger(function(data){
            $scope.initLedger = data;
            console.log("I'm in appController initLedger "+ data);
            $("#success_create").show();
        });
    }
    
    $scope.invoke_invokeData_Data4 = function(){
        console.log("into invoke_invokeData_Data4");
        appFactory.invoke_invokeData_Data4(function(data){
            $scope.invoke_invokeData_Data4 = data;
            console.log("I'm in appController invokeData_Data4 "+ data);
            $("#success_create").show();
        });
    }
    
    $scope.invoke_invokeData_Spe = function(){
        console.log("invoke_invokeData_Spe");
        appFactory.invoke_invokeData_Spe($scope.BSD, function(data){
            $scope.invoke_invokeData_Spe = data;
            console.log("I'm in appController Specific Post "+ data);
            $("#success_create").show();
        });
    }
    
    /*
    $scope.invoke_iPostAHUser_200 = function(){
        console.log("into invoke_iPostAHUser_200");
        appFactory.invoke_iPostAHUser_200(function(data){
            $scope.invoke_iPostAHUser_200 = data;
            console.log("I'm in appController AHUser_200 Post "+ data);
            $("#success_create").show();
        });
    }
    
    $scope.invoke_iPostUser_300 = function(){
        console.log("into invoke_iPostUser_300");
        appFactory.invoke_iPostUser_300(function(data){
            $scope.invoke_iPostUser_300 = data;
            console.log("I'm in appController User_300 Post "+ data);
            $("#success_create").show();
        });
    }
    
    $scope.invoke_iPostUserSpe = function(){
        console.log("invoke_iPostUserSpe");
        appFactory.invoke_iPostUserSpe($scope.alo, function(data){
            $scope.invoke_iPostUserSpe = data;
            console.log("I'm in appController Specific Post "+ data);
            $("#success_create").show();
        });
    }
    $scope.invoke_iPostItem_1000 = function(){
        console.log("invoke_iPostItem_1000");
        appFactory.invoke_iPostItem_1000(function(data){
            $scope.invoke_iPostItem_1000 = data;
            console.log("I'm in appController PostItem "+ data);
            $("#success_create").show();
        });
    }     
    
    $scope.invoke_iPostItemSpe = function(){  
       console.log("invoke_iPostItemSpe"); 
        appFactory.invoke_iPostItemSpe($scope.aloItem,function(data){
            $scope.invoke_iPostItemSpe = data;
            console.log("I'm in appController Specific PostItem "+ data);
            $("#success_create").show();
        });
    }   
    
    $scope.invoke_iPostAuctionRequest_1111 = function(){   
        console.log("invoke_iPostAuctionRequest_1111");
        appFactory.invoke_iPostAuctionRequest_1111(function(data){
            $scope.invoke_iPostAuctionRequest_1111 = data;
            console.log("I'm in appController PostAuctionRequest_1111 "+ data);
            $("#success_create").show();
        });
    }   
    
    $scope.invoke_iPostAuctionRequestSpe = function(){
         console.log("iPostAuctionRequestSpe");
        appFactory.invoke_iPostAuctionRequestSpe($scope.aloAuctionRequest,function(data){
            $scope.invoke_iPostAuctionRequestSpe = data;
            console.log("I'm in appController Specific PostAuctionRequest "+ data);
            $("#success_create").show();
        });
    }
    
    $scope.invoke_iPostBid = function(){
         console.log("iPostBid");
        appFactory.invoke_iPostBid($scope.aloBid,function(data){
            $scope.invoke_iPostBid = data;
            console.log("I'm in appController PostBid "+ data);
            $("#success_create").show();
        });
    }
    
    $scope.invoke_iOpenAuctionRequestForBids = function(){   
       console.log("invoke_iOpenAuctionRequestForBids");
        appFactory.invoke_iOpenAuctionRequestForBids($scope.aloOpenAuction,function(data){
            $scope.invoke_iOpenAuctionRequestForBids = data;
            console.log("I'm in appController OpenAuctionRequestForBids "+ data);
            $("#success_create").show();
        });
    }
    
    $scope.invoke_iCloseOpenAuctions = function(){   
       console.log("invoke_iCloseOpenAuctions");
        appFactory.invoke_iCloseOpenAuctions($scope.aloCloseOpenAuction,function(data){
            $scope.invoke_iCloseOpenAuctions = data;
            console.log("I'm in appController CloseOpenAuctions "+ data);
            $("#success_create").show();
        });
    } 
    
    $scope.invoke_iTransferItem = function(){   
       console.log("invoke_iTransferItem");
        appFactory.invoke_iTransferItem($scope.aloTransfer,function(data){
            $scope.invoke_iTransferItem = data;
            console.log("I'm in appController TransferItem "+ data);
            $("#success_create").show();
        });
    } 
    
    $scope.invoke_iPostUserItem = function(){   
       console.log("invoke_iPostUserItem");
        appFactory.invoke_iPostUserItem($scope.aloUserItem,function(data){
            $scope.invoke_iPostUserItem = data;
            console.log("I'm in appController PostUserItem "+ data);
            $("#success_create").show();
        });
    }
    */
    /*$scope.ShowTime = function(){
        var NowDate=new Date();
        var h=NowDate.getHours();
        var m=NowDate.getMinutes();
        var s=NowDate.getSeconds();
        document.getElementById('showbox').innerHTML = h+':'+m+':'+s;
        setTimeout('ShowTime()',1000);
    }*/
    
});

// Angular Factory
app.factory('appFactory', function($http){
    console.log("into appFactory"+$http);
    var factory = {};
    
    factory.query_queryAllDatas = function(callback){
        console.log("before factory query");
        $http.get('/queryAllDatas/').success(function(output){
            console.log("I'm in factory queryAllDatas " + output);
           callback(output) 
        });
        /*$http.get('/GetUser_100/').error(function(output){
            console.log("I'm in factory error query " + output);
           callback(output) 
        });*/
        /*$http.get('/GetUser_100/', function(output){
            console.log("I'm in factory nothing query " + output);
           callback(output) 
        });*/
    }
    
    factory.query_queryData_Data1 = function(callback){
        console.log("before factory query");
        $http.get('/queryData_Data1/').success(function(output){
            console.log("I'm in factory queryData_Data1 " + output);
           callback(output) 
        });
    }
    
    factory.query_queryData_Spe = function(DataKey,callback){
        console.log("before factory specific query");
        $http.get('/queryData_Spe/'+DataKey).success(function(output){
            console.log("I'm in factory specific query " + output);
           callback(output) 
        });
    }
    
    factory.query_checkDataValid = function(DataKey,callback){
        console.log("before factory check Data Vaild");
        
        var CDV = DataKey+","+y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        
        $http.get('/checkDataValid/'+CDV).success(function(output){
            console.log("I'm in factory check Data Valid " + output);
           callback(output) 
        });
    }
    
    /*
    factory.query_qGetUserSpe = function(UserID,callback){
        console.log("before factory specific query");
        $http.get('/GetUserSpe/'+UserID).success(function(output){
            console.log("I'm in factory specific query " + output);
           callback(output) 
        });
    }
    
    factory.query_qGetItem_1000 = function(callback){
        console.log("before factory Item query");
        $http.get('/GetItem_1000/').success(function(output){
            console.log("I'm in factory Item query " + output);
           callback(output) 
        });
    }
    
    factory.query_qGetItemSpe = function(ItemID,callback){
        console.log("before factory specific Item query");
        $http.get('/GetItemSpe/'+ItemID).success(function(output){
            console.log("I'm in factory specific Item query " + output);
           callback(output) 
        });
    }
    
    factory.query_qGetAuctionRequest = function(AuctionID,callback){
        console.log("before factory AuctionRequest query");
        $http.get('/GetAuctionRequest/'+AuctionID).success(function(output){
            console.log("I'm in factory AuctionRequest query " + output);
           callback(output) 
        });
    }
    
    factory.query_qGetListOfBids = function(AuctionID,callback){
        console.log("before factory List Of Bids query");
        $http.get('/GetListOfBids/'+AuctionID).success(function(output){
            console.log("I'm in factory List OF Bids query " + output);
           callback(output) 
        });
    }
    
    factory.query_qGetHighestBid = function(AuctionID,callback){
        console.log("before factory Highest Bid query");
        $http.get('/GetHighestBid/'+AuctionID).success(function(output){
            console.log("I'm in factory Highest Bid query " + output);
           callback(output) 
        });
    }
    */
    
    
    factory.initLedger = function(callback){
        
        //var alo = data.UserID +"-"+ data.RecType +"-"+ data.Name +"-"+ data.UserType +"-"+ data.Address +"-"+ data.Phone +"-"+ data.Email +"-"+ data.Bank +"-"+ data.AccountNo + "-"+ data.RoutingNo +"-"+ data.Timestamp;
        //var TimeStamp = y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        console.log("before factory initLedger");
        $http.get('/initLedger').success(function(output){
            console.log("I'm in factory initLedger " + output);
            callback(output)
        });
    }
    
    factory.invoke_invokeData_Data4 = function(callback){
        //這邊時間不能用 / 區隔，因為在網址上會被看成目錄
        var TimeStamp = y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        console.log("before factory invokeData_Data4");
        $http.get('/invokeData_Data4/'+TimeStamp).success(function(output){
            console.log("I'm in factory invokeData_Data4 " + output);
            callback(output)
        });
    }
    
    factory.invoke_invokeData_Spe = function(data,callback){
        
        var BSD = data.DataID +","+ data.Name +","+ data.Product +","+ data.Frequency +","+ data.Interval+","+ data.OwnerID +","+y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        
        console.log("before factory Specific Post");
        $http.get('/invokeData_Spe/'+BSD).success(function(output){
            console.log("I'm in factory Specific Post " + output);
            callback(output)
        });
    }
    
    /*
    factory.invoke_iPostAHUser_200 = function(callback){
        
        var TimeStamp = y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        console.log("before factory AHUser_200 Post");
        $http.get('/PostAHUser_200/'+TimeStamp).success(function(output){
            console.log("I'm in factory AHUser_200 Post " + output);
            callback(output)
        });
    }
    
    factory.invoke_iPostUser_300 = function(callback){
        
        var TimeStamp = y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        console.log("before factory Post");
        $http.get('/PostUser_300/'+TimeStamp).success(function(output){
            console.log("I'm in factory User_300 Post " + output);
            callback(output)
        });
    }
    
    factory.invoke_iPostUserSpe = function(data,callback){
        
        var alo = data.UserID +","+ data.RecType +","+ data.Name +","+ data.UserType +","+ data.Address +","+ data.Phone +","+ data.Email +","+ data.Bank +","+ data.AccountNo + ","+ data.RoutingNo +","+y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        
        console.log("before factory Specific Post");
        $http.get('/PostUserSpe/'+alo).success(function(output){
            console.log("I'm in factory Specific Post " + output);
            callback(output)
        });
    }
    
    factory.invoke_iPostItem_1000 = function(callback){
        
        //var aloItem = data.ItemID +"-"+ data.ItemRecType +"-"+ data.ItemDesc +"-"+ data.ItemDetail +"-"+ data.ItemDate +"-"+ data.ItemType +"-"+ data.ItemSubject +"-"+ data.ItemMedia +"-"+ data.ItemSize + "-"+ data.ItemPicFN +"-"+ data.ItemBasePrice +"-"+ data.ItemCurrentOwnerID +"-"+ data.ItemTimestamp;
        
        var TimeStamp = y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        console.log("before factory ItemPost");
        $http.get('/PostItem_1000/'+TimeStamp).success(function(output){
            console.log("I'm in factory PostItem " + output);
            callback(output)
        });
    }
    
    factory.invoke_iPostItemSpe = function(data,callback){
        
        var Performance = data.ItemMedia.replace(/\//g,"slash");
        Performance = Performance.replace(/%/g,"pa");
        
        var aloItem = data.ItemID +","+ data.ItemRecType +","+ data.ItemDesc +","+ data.ItemDetail +","+ data.ItemDate +","+ data.ItemType +","+ data.ItemSubject +","+ Performance +","+ data.ItemSize + ","+ data.ItemPicFN +","+ data.ItemBasePrice +","+ data.ItemCurrentOwnerID +","+y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        
        console.log("before factory Specific ItemPost");
        $http.get('/PostItemSpe/'+aloItem).success(function(output){
            console.log("I'm in factory Specific PostItem " + output);
            callback(output)
        });
    }
    
    factory.invoke_iPostAuctionRequest_1111 = function(callback){
        
        var TimeStamp = y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        console.log("before factory AuctionRequestPost");
        $http.get('/PostAuctionRequest_1111/'+TimeStamp).success(function(output){
            console.log("I'm in factory PostAuctionRequest " + output);
            callback(output)
        });
    }
    
    factory.invoke_iPostAuctionRequestSpe = function(data,callback){
        
        var aloAuctionRequest = data.AuctionRequestID +","+ data.RecType +","+ data.ItemID +","+ data.AuctionHouseID +","+ data.SellerID +","+ data.RequestDate +","+ data.ReservePrice +","+ data.BuyItNowPrice +","+ data.Status + ","+ data.OpenDate +","+ data.CloseDate +","+y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        
        console.log("before factory Specific AuctionRequestPost");
        $http.get('/PostAuctionRequestSpe/'+aloAuctionRequest).success(function(output){
            console.log("I'm in factory Specific PostAuctionRequest " + output);
            callback(output)
        });
    }
    
    factory.invoke_iPostBid = function(data,callback){
        
        var aloBid = data.AuctionID +","+ data.RecType +","+ data.BidNo +","+ data.ItemID +","+ data.BuyerID +","+ data.BidPrice +","+y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        
        console.log("before factory BidPost");
        $http.get('/PostBid/'+aloBid).success(function(output){
            console.log("I'm in factory BidPost " + output);
            callback(output)
        });
    }
    
    factory.invoke_iOpenAuctionRequestForBids = function(data,callback){
        
        var aloOpenAuction = data.AuctionRequestID +","+ data.RecType +","+ data.AuctionTime +","+y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        
        console.log("before factory OpenAuctionRequestForBids");
        $http.get('/OpenAuctionRequestForBids/'+aloOpenAuction).success(function(output){
            console.log("I'm in factory OpenAuctionRequestForBids " + output);
            callback(output)
        });
    }
    
    factory.invoke_iCloseOpenAuctions = function(data,callback){
        
        var aloCloseOpenAuction = data.AuctionYear +","+ data.RecType +","+y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        
        console.log("before factory CloseOpenAuctions");
        $http.get('/CloseOpenAuctions/'+aloCloseOpenAuction).success(function(output){
            console.log("I'm in factory CloseOpenAuctions " + output);
            callback(output)
        });
    }
    
    factory.invoke_iTransferItem = function(data,callback){
        // \為js跳脫字元 \\等於 \    %2F為網址中顯示 /的方式 
        //var NewAES_Key = data.AES_Key.replace("\/","%2F");
        // /在網址中代表路徑，所以先替代成其他字
        var NewAES_Key = data.AES_Key.replace(/\//g,"slash");
                                          
        var aloTransfer = data.ItemID +","+ data.OwnerID +","+ NewAES_Key+","+ data.NewOwnerID+","+ data.RecType+"," +y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        
        console.log("before factory TransferItem");
        $http.get('/TransferItem/'+aloTransfer).success(function(output){
            console.log("I'm in factory TransferItem " + output);
            callback(output)
        });
    }
    
    factory.invoke_iPostUserItem = function(data,callback){
        // \為js跳脫字元 \\等於 \    %2F為網址中顯示 /的方式 
        //var NewAES_Key = data.AES_Key.replace("\/","%2F");
        // /在網址中代表路徑，所以先替代成其他字
        //var NewAES_Key = data.AES_Key.replace("\/","slash");
                                          
        var aloUserItem = data.OwnerID +","+ data.RecType +","+ data.ItemID+","+ data.NewUserID+"," +y+"-"+mon+"-"+d+" "+h+':'+min+':'+s;
        
        console.log("before factory PostUserItem");
        $http.get('/PostUserItem/'+aloUserItem).success(function(output){
            console.log("I'm in factory PostUserItem " + output);
            callback(output)
        });
    }
    */
    return factory;
});