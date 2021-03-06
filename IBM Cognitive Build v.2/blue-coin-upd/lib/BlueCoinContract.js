'use strict';

const { Contract } = require('fabric-contract-api');  

const Utility = require("./Utility.js");

class BlueCoinContract extends Contract {

  async init(ctx){
    console.info('============= START : Init =============');

    console.info('============= END : Init =============');
  }
  async registerJobseeker(ctx, userId, firstName, lastName, email) {
    console.info('============= START : Register Jobseeker =============');

    // if (!Utility.assertMspId(ctx, userId))
    //   throw new Error("The parameter userId should be the same as the caller's userId: " + Utility.getMspId(ctx));

    let json = await Utility.getState(ctx, userId);

    //check if jobseeker already registered
    if (json != null)
      throw new Error("Jobseeker " + userId + " has already registered. Registration happens only once.");

    let values = Utility.generatePubPrivKeys();
    console.log("**** here privateKey   ", values.privateKey);
    console.log("here publicKey ", values.publicKey);
    let publicKey = values.publicKey;
    let privateKey = values.privateKey;
    let encPrivateKey = Utility.encryptDataSym(privateKey, publicKey);
    console.log("**** encrypted privKey ", encPrivateKey)
    let decPrivKey = Utility.decryptDataSym(encPrivateKey, publicKey);
    console.log("***  decrypted privKey ", decPrivKey);
    
    json = {
      docType: "jobSeeker",
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      publicKey: publicKey,
      privateKey: encPrivateKey
    };

    await Utility.putState(ctx, userId, json);

    console.info('============= END : Register Jobseeker =============');
    console.log("hello");
    return {status: 200, message:"Successfully registered Jobseeker", payload: json };
  }

  //============================================================================
  //NEWLY ADDED FUNCTIONS
  async registerEmployer(ctx, employerId, firstname, lastname, email, companyName) {
    console.info("START: Register Company");

    //Check if Company ID already exists
    let json = await Utility.getState(ctx, employerId);
    if (json != null)
      throw new Error("Company with ID " + employerId + " is already registered.");

    //Generate and store public and encrypted private key
    let values = Utility.generatePubPrivKeys();
    let publicKey = values.publicKey;
    let privateKey = values.privateKey;
    let encPrivateKey = Utility.encryptDataSym(privateKey, publicKey);
    console.log("Public key: " + publicKey);
    console.log("Private key (encrypted): " + encPrivateKey);

    //Save company details to JSON
    json = {
      docType: "employer",
      employerId: employerId,
      firstname: firstname,
      lastname: lastname,
      email: email,
      companyName: companyName,
      publicKey: publicKey,
      privateKey: encPrivateKey
    };

    await Utility.putState(ctx, employerId, json);

    console.info("END: Register Company");
    return {status: 200, message: "Successfully registered Company", payload: json};
  }

  async registerTC(ctx, tcId, tcName) {
    console.info("START: Register Training Center");

    //Check if TC ID already exists
    let json = await Utility.getState(ctx, tcId);
    if (json != null)
      throw new Error("Training Center with ID " + tcId + " is already registered.");

    //Save TC details to JSON
    json = {
      docType: "trainingCenter",
      tcId: tcId,
      tcName: tcName
    };

    await Utility.putState(ctx, tcId, json);

    console.info("END: Register Training Center");
    return {status: 200, message: "Successfully registered Training Center", payload: json};
  }

  async addCredential(ctx, tcId, userId, trainingTitle, trainingDate) {
    console.info("START: Add Credential");

    // if (!Utility.assertUserId(ctx, tcId))       
    // throw new Error("You cannot create a credential in behalf of another training center"); 

    let Jobseekerjson = await Utility.getState(ctx, userId);
    if (userId == null)
      throw new Error("Jobseeker must register first" + userId);

    let tcjson = await Utility.getState(ctx, tcId);
    if (tcId == null)
      throw new Error("Training Center must registered first." + tcId);

    // let trainingDate = "11-12-2019";
    // let trainingTitle = "Blockchain Training";
    // let tcId = "tc0001";

    let jsonCred = {
      docType: "credential",
      userId: userId,
      trainingTitle: trainingTitle,
      trainingDate: trainingDate,
      tcId: tcId
    };

    let dataTemp = JSON.stringify(jsonCred);
    console.log("****** dataTemp value => " + dataTemp);

    let values = Utility.generatePubPrivKeys();
    let publicKey = values.publicKey;
    let privateKey = values.privateKey;
    let encPrivateKey = Utility.encryptDataSym(privateKey, publicKey);

    // let encryptMsg = Utility.pubEncryptASYM(dataTemp, publicKey);
    // console.log("**** encryptMsg ===> " + encryptMsg);

    // let decryptMsg = Utility.privDecryptASYM(encryptMsg, privateKey);
    // console.log("**** decryptMsg ===> " + decryptMsg);

    let hashValue = Utility.createHashValue(dataTemp);
    console.log("**** hashValue ===> " + hashValue);
    
    let decPrivateKey = Utility.decryptDataSym(encPrivateKey, publicKey);

    let encCred = Utility.privEncryptASYM(dataTemp, decPrivateKey);
    console.log("Encrypted Credential: " + encCred);

    let hashCred = Utility.createHashValue(dataTemp);
    console.log("Hashed Credential: " + hashCred);

    //Check if credential already exists
    let jsonEncCred = await Utility.getState(ctx, userId+hashCred);
    if (jsonEncCred !== null)
      throw new Error("Credential for " + userId + " with hash credential of " + hashCred + " already exists.");

    jsonEncCred = {
        docType: "credential",
        userId: userId,
        encCred: encCred,
        hashCred: hashCred,
        tcId: tcId
      };

    // let hashCred = (userId, trainingTitle, date, tcId) => {
    //   let credJson = {
    //     userId: userId,
    //     trainingTitle: trainingTitle,
    //     date: date,
    //     tcId: tcId
    //   };
    //   return Utility.createHashValue(stringify(credJson));
    // }
    
    await Utility.putState(ctx, userId+hashCred, jsonEncCred);

    console.info("END: Add Credential");
    return {status: 200, message: "Successfully added credential", payload: jsonEncCred};
  }

  async getUserInfo(ctx, userId) {
    console.info("START: Get User info");
    
    const jsonQuery = {
      "selector": {
        "userId": userId,  
      }
    }

    //Check if jobseeker exists
    let json = await Utility.getState(ctx, userId);
    if (json == null)
      throw new Error("Jobseeker with ID " + userId + " does not exist.");

    // let jobseeker = {
    //   userId: json.userId,cd
    //   firstName: json.firstName,
    //   lastName: json.lastName,
    //   publicKey: json.publicKey,
    //   privateKey: json.privateKey
    // }

    console.info("END: Get User info");
    return {status: 200, message: "Search successfull", payload: jsonQuery};
  }

  async getCompanyInfo(ctx, employerId, companyName) {
    console.info("START: Get User info");
    
    const jsonQuery = {
      "selector": {
        "companyId": employerId, 
        "companyName": companyName
      }
    };

    //Check if company exists
    let json = await Utility.getState(ctx, employerId);
    if (json == null)
      throw new Error("Company with ID " + employerId + " does not exist.");


    console.info("END: Get Employer info");
    return {status: 200, message: "Search successfull", payload: jsonQuery};
  }

  async getTCInfo(ctx, tcId, tcName) {
    console.info("START: Get User info");
    
    const jsonQuery = {
      "selector": {
        "tcId": tcId , 
        "tcName": tcName
      }
    };

    //Check if company exists
    let json = await Utility.getState(ctx, tcId);
    if (json == null)
      throw new Error("Company with ID " + tcId + " does not exist.");


    console.info("END: Get training center info");
    return {status: 200, message: "Search successfull", payload: jsonQuery};
  }

  async retrieveAllCredential(ctx, userId) {

    console.info("START: Retrieve all credentials");
    const jsonQuery = {
      "selector": {
        "docType": "credential",
        "userId": userId  
      }
    }
  
    let queryResult = await Utility.getQueryResult(ctx, jsonQuery);

    console.info('============= END : GET ALL ABOVE =============');    
    return {status: 200, message: "Getting records above " + val + " blue coin",payload: queryResult};
    // let json = await Utility.getstate(ctx, userId);
    // if (json == null)
    //   throw new Error("Jobseeker with " + userId + " does not exist.");

    // //Set search limits
    // const startKey = 0;
    // const endKey = 999;
    // const allCredentials = [];

    // //
    // for await (const {key, value} of Utility.getStateByRange(startKey, endKey)) {
    //     const strValue = Buffer.from(value).toString('utf8');
    //     let record;
    //     try {
    //         record = JSON.parse(strValue);
    //     } catch (err) {
    //         console.log(err);
    //         record = strValue;
    //     }
    //     allCredentials.push({ Key: key, Record: record });
    // }

    // console.info(allCredentials);

    // console.info("END: Retrieve all credentials");
    // return JSON.stringify(allCredentials);
  }

  async retrieveCredential(ctx, hashCred, userId) {

    const jsonQuery = {
      "selector": {
        "docType": "credential",
        "userId": userId,
        "hashCred": hashCred,
        "encCred" : encCred 
      }
    }

    console.info("START: Retrieve Credential");


    let queryResult = await Utility.getQueryResult(ctx, jsonQuery);

    console.info('============= END : GET ALL ABOVE =============');    
    return {status: 200, message: "Getting credential for " + userId, payload: queryResult}; //encCred


  //   //Find the credential
  //   const credentialAsByte = await Utility.getState(hashCred);
  //   if (credentialAsByte == null)
  //       throw new Error(`${hashCred} does not exist`);

  //   //Decode the hashed credential
  //   let seeker = Utility.getstate(userId);
  //   let decodedCredential = Utility.privDecryptASYM(credentialAsByte, seeker.privateKey);

  //   console.info("END: Retrieve Credential");
  //   return decodedCredential.toString();
  // 
  }

}

module.exports = BlueCoinContract;
