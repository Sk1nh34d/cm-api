const express = require("express");
const router = express.Router();
const fs = require('fs');
//getting contacts from json-File
var contacts = require(__dirname+'/contacts_data.json');

/*
GET-requested without params => return all contacts as JSON-Array
*/
router.get("/", (req, res) => {
  res.json(contacts);
});
//empty search dry refactor
router.get("/name/", (req, res) => {
  res.json(contacts);
});
/*
GET contact record by given character in name or surname
*/
router.get("/name/:name", (req, res) => {
    let foundContacts=[];
    //check if contact with given character in surname/name exists
    contacts.filter((contact) => {
      if (contact.name.indexOf(req.params.name)!==-1 || contact.surname.indexOf(req.params.name)!==-1){

        foundContacts.push(contact);
      }
    });
    //return contact
    if (foundContacts.length!==0) {
      res.json(foundContacts);
    }
    //

    //not found =>404
    else {
      res.sendStatus(404);
    }
});
/*
POST-request creation of new user
*/
router.post("/newcontact", (req, res) => {
  const lastinsertid=contacts[contacts.length-1].id; //presuming id of last element is greatest id
  let newContact = {
    id: lastinsertid+1,
    name: req.body.contact.name,
    surname: req.body.contact.surname,
    birthday: req.body.contact.birthday,
    address: req.body.contact.address
  };

  //check for duplicates
  const duplicate_entry=contacts.some((contact) =>{
    if(JSON.stringify(contact,['name','surname','birthday','address'])===JSON.stringify(newContact,['name','surname','birthday','address'])){
        return true;
    }
    else{
      return false;
    }
  });
  //write to fs if no duplicates
  if(duplicate_entry===false){
    contacts.push(newContact);
    //make it "persistent"
    fs.writeFile(__dirname+"/contacts_data.json", JSON.stringify(contacts),()=>{
      res.json(newContact);
    });
  }
  else{
    res.sendStatus(409); //Status:Conflict representing duplicates best
  }
});




//Update contact

router.put("/update/:id", (req, res) => {

  const found = contacts.some(contact => contact.id === parseInt(req.params.id));
  if (found) {
    changed=false;
    const updatedContact = req.body.contact;
    let i=0;
    contacts.forEach(contact => {
      if (contact.id === parseInt(req.params.id)) {
        //has something changed?
        if(JSON.stringify(contacts[i])!==JSON.stringify(updatedContact)){
          contacts[i]=updatedContact;
          changed=true;
        }
      }
      i++;
    });
    //make it "persistent"
    if(changed===true){
      fs.writeFile(__dirname+"/contacts_data.json", JSON.stringify(contacts),()=>{
        res.json(true);
      });
    }
    else{
      res.json(false);
    }
  }
  else {
    res.sendStatus(404);
  }
});

//Delete contact by id

router.delete("/delete/:id", (req, res) => {
  const found = contacts.some(contact => contact.id === parseInt(req.params.id));
  if (found) {
    contacts = contacts.filter(contact => contact.id !== parseInt(req.params.id));
    //make it "persistent"
    fs.writeFile(__dirname+"/contacts_data.json", JSON.stringify(contacts),()=>{
      res.json(true);
    });
  }
  else {
    res.sendStatus(404);
  }
});



module.exports = router;
