db.create("Customers");
db.Customers.insert({"id":1221, "name":"Itsy", "city":"Hyderabad"});
db.Customers.insert({"id":1222, "name":"Bitsy", "city":"Bengaluru"});
db.Customers.insert({"id":1223, "name":"Nancy", "city":"Chennai"});
db.Customers.insert({"id":1224, "name":"Tipsy", "city":"Hyderabad"});

let rows = db.Customers.select(["name", "city"]);
console.log(rows[2]["id"]);
console.log(db.Customers.sum("id"));
console.log(db.Customers.avg("id"));
console.log(db.Customers.max("id"));
console.log(db.Customers.min("id"));
console.log(db.Customers.count());

console.log(db.Customers.select(["name", "city"]));
console.log(db.Customers.where(`c["city"]=="Hyderabad"`));
let city = "Hyderabad"
console.log(db.Customers.where(`c["city"]=={city}`));