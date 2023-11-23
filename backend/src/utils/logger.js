const fs = require("fs");
const logging = module.exports;

logging.requestLogger  = function (req, res, next) {
    //Get datatime of the request
    let start = new Date();
    res.once('finish', () => {
      const log = [req.method, req.path];
      if (req.body && Object.keys(req.body).length > 0) {
        //Log the body, incase it exists
        log.push(JSON.stringify(req.body));
      }
      //Log Status code
      log.push('->', res.statusCode);
      // DateTime of request
      log.push(new Date());
      // Calculate time taken to execute the request
      log.push(new Date() - start);
      console.log(log.join(' '));
      //Append the logs
      fs.appendFile("request_logs.txt", log + "\n", function (err) {
        if (err) throw err;
      });
    });
    next();
}