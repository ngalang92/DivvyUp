const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/items/";

const sequelize = require("../../src/db/models/index").sequelize;
const Item = require("../../src/db/models").Item;
const Mark = require("../../src/db/models").Mark;
const User = require("../../src/db/models").User;


describe("routes : marks", () => {

  beforeEach((done) => {

    this.user;
    this.item;
    this.mark;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((res) => {
        this.user = res;

        Item.create({
          name: "Expeditions to Alpha Centauri",
          priority: "A compilation of reports from recent visits to the star system.",
          budget: 12345,
          marks: [{
            value: false,
            itemId: this.item.id,
            userId: this.user.id
          }]
        }, {
          include: {
            model: Mark,
            as: "marks"
          }
        })
        .then((res) => {
          this.item = res;
          this.mark = this.item.marks[0];
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  // test suites go here

  describe("guest attempting to mark on a mark", () => {

     beforeEach((done) => {    // before each suite in this context
       request.get({
         url: "http://localhost:3000/auth/fake",
         form: {
           userId: 0 // ensure no user in scope
         }
       },
         (err, res, body) => {
           done();
         }
       );

     });

     describe("GET /items/:itemId/marks/upmark", () => {

       it("should not create a new mark", (done) => {
         const options = {
           url: `${base}${this.item.id}/marks/upmark`
         };
         request.get(options,
           (err, res, body) => {
             Mark.findOne({            // look for the mark, should not find one.
               where: {
                 value: false,
                 userId: this.user.id,
                 itemId: this.item.id
               }
             })
             .then((mark) => {
               expect(mark).toBeNull();
               done();
             })
             .catch((err) => {
               console.log(err);
               done();
             });
           }
         );
       });

     });
   });

   describe("signed in user voting on a mark", () => {

     beforeEach((done) => {  // before each suite in this context
       request.get({         // mock authentication
         url: "http://localhost:3000/auth/fake",
         form: {
           role: "member",     // mock authenticate as member user
           userId: this.user.id
         }
       },
         (err, res, body) => {
           done();
         }
       );
     });

     describe("GET /items/:itemId/marks/upmark", () => {

       it("should create an upmark", (done) => {
         const options = {
           url: `${base}${this.item.id}/marks/upmark`
         };
         request.get(options,
           (err, res, body) => {
             Mark.findOne({
               where: {
                 value: false,
                 userId: this.user.id,
                 itemId: this.item.id
               }
             })
             .then((mark) => {               // confirm that an upmark was created
               expect(mark).not.toBeNull();
               expect(mark.value).toBe(false);
               expect(mark.userId).toBe(this.user.id);
               expect(mark.itemId).toBe(this.item.id);
               done();
             })
             .catch((err) => {
               console.log(err);
               done();
             });
           }
         );
       });

       it("should not create a mark with a value of anything other than a boolean", (done) => {
         const options = {
           url: `${base}${this.item.id}/marks/upmark`
         };
         request.get(options,
           (err, res, body) => {
             Mark.findOne({
               where: {
                 userId: this.user.id,
                 itemId: this.item.id,
                 value: 2
               }
             })
             .then((mark) => {               // confirm that an upmark was not created
               expect(mark).toBeNull();
               expect(mark.userId).toBe(this.user.id);
               expect(item.itemId).toBe(this.item.id);
               done();
             })
             .catch((err) => {
               console.log(err);
               done();
             });
           }
         );
       });

     });

     describe("GET /items/:itemId/marks/downmark", () => {

       it("should create a downmark", (done) => {
         const options = {
           url: `${base}${this.item.id}/marks/downmark`
         };
         request.get(options,
           (err, res, body) => {
             Mark.findOne({
               where: {
                 value: false,
                 userId: this.user.id,
                 itemId: this.item.id
               }
             })
             .then((mark) => {               // confirm that a downmark was created
               expect(mark).not.toBeNull();
               expect(mark.value).toBe(false);
               expect(mark.userId).toBe(this.user.id);
               expect(mark.itemId).toBe(this.item.id);
               done();
             })
             .catch((err) => {
               console.log(err);
               done();
             });
           }
         );
       });

       it("should not create a mark with a value of anything other than a boolean", (done) => {
         const options = {
           url: `${base}${this.item.id}/marks/upmark`
         };
         request.get(options,
           (err, res, body) => {
             Mark.findOne({
               where: {
                 userId: this.user.id,
                 itemId: this.item.id,
                 value: -2
               }
             })
             .then((mark) => {               // confirm that an upmark was not created
               expect(mark).toBeNull();
               expect(mark.userId).toBe(this.user.id);
               expect(mark.itemId).toBe(this.item.id);
               done();
             })
             .catch((err) => {
               console.log(err);
               done();
             });
           }
         );
       });

     });

   }); //end context for signed in user

});
