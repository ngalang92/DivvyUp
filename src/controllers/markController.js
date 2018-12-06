const markQueries = require("../db/queries.marks.js");

module.exports = {
  upmark(req, res, next){

    if(req.user){
      markQueries.createMark(req, true, (err, mark) => {
        if(err){
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });

    } else {
      req.flash("notice", "You must be signed in to do that.")
      res.redirect(req.headers.referer);
    }
  },
  downmark(req, res, next){

    if(req.user){
      markQueries.createMark(req, false, (err, mark) => {
        if(err){
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
    } else {
      req.flash("notice", "You must be signed in to do that.")
      res.redirect(req.headers.referer);
    }
  }
}
