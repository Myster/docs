var fs        = require('fs');
var nconf     = require('nconf');
var xtend     = require('xtend');
var jade      = require('jade');

var apiTmplPath = __dirname + '/api2-explorer.jade';

var apiTmpl = jade.compile(fs.readFileSync(apiTmplPath).toString(), {
  filename: apiTmplPath,
  pretty: true
});

module.exports = function (req, res, next)  {
  var jadeContext = xtend({}, res.locals, { api2Domain: nconf.get('DOMAIN_URL_API2_EXPLORER') });

  if (res.locals.account.loggedIn && req.user.is_owner) {
    jadeContext.globalClientSecret  = res.locals.account.globalClientSecret;
    jadeContext.globalClientID      = res.locals.account.globalClientId;

  } else {
    jadeContext.globalClientSecret  = '';
    jadeContext.globalClientID      = '';
  }

  res.locals.api2Explorer = function (ctx) {
    return apiTmpl(jadeContext);
  };

  next();
};