const ApplicationPolicy = require("./application");

module.exports = class ItemPolicy extends ApplicationPolicy {

 new() {
   return this._isOwner();
 }

 create() {
   return this.new();
 }

 edit() {
   return this._isOwner();
 }

 update() {
   return this.edit();
 }

 destroy() {
   return this.update();
 }
}
