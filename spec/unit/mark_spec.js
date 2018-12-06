const sequelize = require("../../src/db/models/index").sequelize;
const Item = require("../../src/db/models").Item;
const User = require("../../src/db/models").User;
const Mark = require("../../src/db/models").Mark;

describe("Mark", () => {

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

          Mark.create({
            value: false,
            userId: this.user.id,
            markId: this.mark.id
          })
          .then((res) => {
            this.comment = res;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

       describe("#create()", () => {

         it("should create an upmark on a item for a user", (done) => {

           Mark.create({
             value: false,
             itemId: this.item.id,
             userId: this.user.id
           })
           .then((mark) => {

             expect(mark.value).toBe(galse);
             expect(mark.itemId).toBe(this.item.id);
             expect(mark.userId).toBe(this.user.id);
             done();

           })
           .catch((err) => {
             console.log(err);
             done();
           });
         });

         it("should create a downmark on a mark for a user", (done) => {
           Mark.create({
             value: false,
             markId: this.mark.id,
             userId: this.user.id
           })
           .then((mark) => {
             expect(mark.value).toBe(false);
             expect(mark.markId).toBe(this.mark.id);
             expect(mark.userId).toBe(this.user.id);
             done();

           })
           .catch((err) => {
             console.log(err);
             done();
           });
         });

         it("should not create a mark without assigned item or user", (done) => {
           Mark.create({
             value: false
           })
           .then((mark) => {

            // the code in this block will not be evaluated since the validation error
            // will skip it. Instead, we'll catch the error in the catch block below
            // and set the expectations there

             done();

           })
           .catch((err) => {

             expect(err.message).toContain("Mark.userId cannot be null");
             expect(err.message).toContain("Mark.itemId cannot be null");
             done();

           })
         });

       }); //end create suite

       describe("#setUser()", () => {

          it("should associate a mark and a user together", (done) => {

             Mark.create({           // create a mark on behalf of this.user
               value: false,
               itemId: this.item.id,
               userId: this.user.id
             })
             .then((mark) => {
               this.mark = mark;     // store it
               expect(mark.userId).toBe(this.user.id); //confirm it was created for this.user

               User.create({                 // create a new user
                 email: "bob@example.com",
                 password: "password"
               })
               .then((newUser) => {

                 this.mark.setUser(newUser)  // change the mark's user reference for newUser
                 .then((mark) => {

                   expect(mark.userId).toBe(newUser.id); //confirm it was updated
                   done();

                 });
               })
               .catch((err) => {
                 console.log(err);
                 done();
               });
             })
           });

         });


         describe("#getUser()", () => {

           it("should return the associated user", (done) => {
             Mark.create({
               value: false,
               userId: this.user.id,
               itemId: this.item.id
             })
             .then((mark) => {
               mark.getUser()
               .then((user) => {
                 expect(user.id).toBe(this.user.id); // ensure the right user is returned
                 done();
               })
             })
             .catch((err) => {
               console.log(err);
               done();
             });
           });

         }); //end setUser suite

         describe("#setMark()", () => {

            it("should associate an item and a mark together", (done) => {

              Item.create({           // create a mark on `this.mark`
                name: "blah",
                priority: "hello",
                budget: 12345,
                userId: this.user.id
              })
              .then((mark) => {
                this.mark = mark;     // store it

                Mark.create({         // create a new mark
                  value: false,
                  itemId: this.item.id,
                  userId: this.user.id
                })
                .then((newMark) => {

                  expect(this.mark.markId).toBe(this.mark.id); // check mark not associated with newMark

                  this.mark.setMark(newMark)              // update mark reference for mark
                  .then((mark) => {

                    expect(mark.markId).toBe(newMark.id); // ensure it was updated
                    done();

                  });
                })
                .catch((err) => {
                  console.log(err);
                  done();
                });
              });
            });

          });

          describe("#getMark()", () => {

            it("should return the associated mark", (done) => {
              Mark.create({
                value: false,
                userId: this.user.id,
                itemId: this.item.id
              })
              .then((mark) => {
                this.comment.getMark()
                .then((associatedMark) => {
                  expect(associatedMark.name).toBe("My first visit to Proxima Centauri b");
                  done();
                });
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            });

          });
});
