const sequelize = require("../../src/db/models/index").sequelize;
const Item = require("../../src/db/models").Item;
const User = require("../../src/db/models").User;
const Mark = require("../../src/db/models").Mark;

   describe("Item", () => {
     beforeEach((done) => {
       this.item;
       this.mark;
       this.user;
        sequelize.sync({force: true}).then((res) => {
         User.create({
           email: "starman@tesla.com",
           password: "Trekkie4lyfe"
         })
         .then((user) => {
           this.user = user; //store the user
           Item.create({
             name: "Expeditions to Alpha Centauri",
             priority: "A compilation of reports from recent visits to the star system.",
             budget: 12345,
             marks: [{
               value: false,
               itemId: this.user.id,
               userId: this.user.id
             }]
           }, {
             include: {
               model: Mark,
               as: "marks"
             }
           })
           .then((item) => {
             this.item = item; //store the item
             this.mark = item.marks[0]; //store the mark
             done();
           })
         })
       });
    });
    describe("#create()", () => {
        it("should create a item object with a name and priority", (done) => {
         Item.create({
           name: "Journey around the world",
           priority: "The coolest places to see",
           budget: 12345
         })
         .then((item) => {
           expect(item.name).toBe("Journey around the world");
           expect(item.priority).toBe("The coolest places to see");
           expect(item.budget).toBe(12345);
           done();
         })
         .catch((err) => {
           console.log(err);
           done();
         });
       });
        it("should not create a item with missing name, or budget", (done) => {
         Item.create({
           name: "Journey around the world"
         })
         .then((item) => {
           done();
         })
         .catch((err) => {
           expect(err.message).toContain("Item.budget cannot be null");
           done();
         })
       });
      });

  })
