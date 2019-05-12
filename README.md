# ScriptDB
**Make Javascript arrays SQL enabled.**

This is fun project. No serious validations included. Performance and Browser compatibility not verified. Wanted to code less.

Suggestions! Welcome!!

**sample usage:**
```js
// create Customers
db.create("Customers");

// insert some rows into Customers
db.Customers.insert({ "id": 1221, "name": "Itsy", "city": "Hyderabad" });
db.Customers.insert({ "id": 1222, "name": "Bitsy", "city": "Bengaluru" });
db.Customers.insert({ "id": 1223, "name": "Nancy", "city": "Chennai" });
db.Customers.insert({ "id": 1224, "name": "Tipsy", "city": "Hyderabad" });

let rows = db.Customers.select(["name", "city"]);
console.log(rows[2]["id"]);

// aggregate functions on Customers
console.log(db.Customers.sum("id"));
console.log(db.Customers.avg("id"));       
console.log(db.Customers.max("id"));
console.log(db.Customers.min("id"));
console.log(db.Customers.count());

// select on Customers
console.log(db.Customers.select(["name", "city"]));

// where on Customers. "c" is known alias for referring table.
console.log(db.Customers.where(`c["city"]=="Hyderabad"`));
let city = "Chennai"

// updating a row in Customers. "c" is known alias for referring table.
let chennai = db.Customers.where(`c["city"]=="${city}"`)[0];
console.log(`${chennai.name} from ${chennai.city}`);
chennai["name"]="Patsy";
db.Customers.update(chennai);

// deleting a row in Customers. "c" is known alias for referring table.
chennai = db.Customers.where(`c["city"]=="${city}"`)[0];
console.log(`${chennai.name} from ${chennai.city}`);
db.Customers.delete(chennai);
console.log(db.Customers.count());

// group and order on Customers
console.log(db.Customers.orderby(["id", "city desc"]));
console.log(db.Customers.groupby(["city"]));
console.log(db.Customers.groupby(["city", "name"]));

// create Orders
db.create("Orders");

// insert rows into Orders
db.Orders.insert({ "id": 21, "amount": 400.50, "customerid": 1221, "orderdate": new Date() });
db.Orders.insert({ "id": 22, "amount": 50.00, "customerid": 1221, "orderdate": new Date() });

// join Customers and Orders. "l", "r" are known aliases for referring tables.
let orderdetaails = db.Orders.jointo(db.Customers.on(`l["customerid"]===r["id"]`));
console.log(orderdetaails);

// we can perform all the above mentioned query, aggregate operations on this OrderDetails. e.g.,
orderdetaails.select(["customerid", "amount"]);
orderdetaails.where(`c["amount"]>50`)
orderdetaails.sum("amount")
orderdetaails.avg("amount")        
orderdetaails.max("amount")
orderdetaails.min("amount")
orderdetaails.count()
```