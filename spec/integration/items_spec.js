const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/items/";
const sequelize = require("../../src/db/models/index").sequelize;
const Item = require("../../src/db/models").Item;
const User = require("../../src/db/models").User;

describe("routes : items", () => {

   beforeEach((done) => {
     this.item;
     sequelize.sync({force: true}).then(() => {

      Item.create({
        name: "JS Frameworks",
        priority: "There are a lot of them",
        budget: 12345,
      })
       .then((res) => {
         this.item = res;
         done();
       })
       .catch((err) => {
         console.log(err);
         done();
       });

     });

   });

   //context of admin user
   describe("user performing CRUD actions for Item", () => {

      beforeEach((done) => {
         User.create({
           email: "admin@example.com",
           password: "123456",
         })
         .then((user) => {
           request.get({         // mock authentication
             url: "http://localhost:3000/auth/fake",
             form: {
               userId: user.id,
               email: user.email
             }
           },
             (err, res, body) => {
               done();
             }
           );
         });
      });

      describe("GET /items", () => {
        it("should respond with all items", (done) => {
          request.get(base, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Items");
            expect(body).toContain("JS Frameworks");
            done();
          });
        });
      });

      describe("GET /items/new", () => {
        it("should render a view with a new item form", (done) => {
          request.get(`${base}new`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Item");
            done();
          });
        });
      });

      describe("POST /items/create", () => {
        const options = {
          url: `${base}create`,
          form: {
            name: "blink-182 songs",
            priority: "What's your favorite blink-182 song?",
            budget: 12345,
         }
       };

        it("should create a new item and redirect", (done) => {

          request.post(options,

            (err, res, body) => {
              Item.findOne({where: {name: "blink-182 songs"}})
              .then((item) => {
                expect(item.name).toBe("blink-182 songs");
                expect(item.priority).toBe("What's your favorite blink-182 song?");
                expect(item.budget).toBe(12345);
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

      describe("GET /items/:id", () => {
        it("should render a view with the selected item", (done) => {
          request.get(`${base}${this.item.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("JS Frameworks");
            done();
          });
        });
      });

      describe("POST /items/:id/destroy", () => {
        it("should delete the item with the associated ID", (done) => {

          Item.all()
          .then((items) => {

            const itemCountBeforeDelete = items.length;

            expect(itemCountBeforeDelete).toBe(1);

            request.post(`${base}${this.item.id}/destroy`, (err, res, body) => {
              Item.all()
              .then((items) => {
                expect(err).toBeNull();
                expect(items.length).toBe(itemCountBeforeDelete - 1);
                done();
              })

            });
          });

        });
      });

      describe("GET /items/:id/edit", () => {
        it("should render a view with an edit item form", (done) => {
          request.get(`${base}${this.item.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Edit Item");
            expect(body).toContain("JS Frameworks");
            done();
          });
        });
      });

      describe("POST /items/:id/update", () => {

        it("should update the item with the given values", (done) => {
           const options = {
              url: `${base}${this.item.id}/update`,
              form: {
                name: "JavaScript Frameworks",
                priority: "There are a lot of them",
                budget: 12345
              }
            };

            request.post(options,
              (err, res, body) => {

              expect(err).toBeNull();
              Item.findOne({
                where: { id: 1 }
              })
              .then((item) => {
                expect(item.name).toBe("JavaScript Frameworks");
                done();
              });
            });
        });

      });

    });

     //end context for admin user

     // context of member user
   describe("member user performing CRUD actions for Item", () => {

      beforeEach((done) => {
       request.get({
         url: "http://localhost:3000/auth/fake",
         form: {
           role: "user"
         }
       },
         (err, res, body) => {
           done();
         }
       );
      });

      describe("GET /items", () => {
        it("should respond with all items", (done) => {
          request.get(base, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Items");
            expect(body).toContain("JS Frameworks");
            done();
          });
        });
      });

      describe("GET /items/new", () => {
        it("should redirect to items view", (done) => {
          request.get(`${base}new`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Items");
            done();
          });
        });
      });

      describe("POST /items/create", () => {
        const options = {
          url: `${base}create`,
          form: {
            name: "blink-182 songs",
            priority: "What's your favorite blink-182 song?",
            budget: 12345
          }
        };

        it("should not create a new item", (done) => {
          request.post(options,
            (err, res, body) => {
              Item.findOne({where: {name: "blink-182 songs"}})
              .then((item) => {
                expect(item).toBeNull(); // no item should be returned
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

      describe("GET /items/:id", () => {
        it("should render a view with the selected item", (done) => {
          request.get(`${base}${this.item.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("JS Frameworks");
            done();
          });
        });
      });

      describe("POST /items/:id/destroy", () => {
        it("should not delete the item with the associated ID", (done) => {

          Item.all()
          .then((items) => {

            const itemCountBeforeDelete = items.length;

            expect(itemCountBeforeDelete).toBe(1);

            request.post(`${base}${this.item.id}/destroy`, (err, res, body) => {
              Item.all()
              .then((items) => {
                expect(items.length).toBe(itemCountBeforeDelete);
                done();
              })

            });
          });

        });
      });

      describe("GET /items/:id/edit", () => {
        it("should not render a view with an edit item form", (done) => {
          request.get(`${base}${this.item.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).not.toContain("Edit Item");
            expect(body).toContain("JS Frameworks");
            done();
          });
        });
      });

      describe("POST /items/:id/update", () => {
        it("should not update the item with the given values", (done) => {
          const options = {
             url: `${base}${this.item.id}/update`,
             form: {
               name: "JavaScript Frameworks",
               priority: "There are a lot of them"
             }
           }

           request.post(options,
             (err, res, body) => {
             expect(err).toBeNull();
             Item.findOne({
               where: { id: 1 }
             })
             .then((item) => {
               expect(item.name).toBe("JS Frameworks"); //confirm name is unchanged
               done();
             });
           });
        });
      });

   });
});
