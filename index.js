var express = require('express');
var redis = require('redis');
var bodyParser = require('body-parser');
var unirest = require('unirest');
var async = require('async');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


var client = redis.createClient(process.env.REDIS_URL);




// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {

  client.get('conversation', function(err, reply) {
    console.log("Reply: " + reply);

    response.render('pages/index', {
      conversation: reply
    });

  });
});

app.post('/', function(request, response) {
  console.log(request.body);

  client.set("conversation", request.body.conversation);

  response.redirect('/');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var telegramConversationPointers = {};

function processResult(r) {
  var fromId = r.message.from.id;
  var index = "1";

  if (r.message.text == "/start") {
    index = "1"
  }

  if (fromId in telegramConversationPointers) {
    index = telegramConversationPointers[fromId];
  }

  client.get('conversation', function(err, reply) {
    eval(reply);

    console.log(conversation[index].statement);

    for (var i = 0; i < conversation[index].statement.length; i++) {
      var answer = {
        chat_id: r.message.chat.id,
        text: conversation[index].statement[i]
      }

      unirest.post(SEND_MESSAGE_URL).send(answer).end(function(response) {});
    }
  });
}

var BASE_URL = "https://api.telegram.org/bot158772788:AAGZmSbkELKu1r6C6bZBhszCAzIbJ0VWUGs/";
var POLLING_URL = BASE_URL + "getUpdates?offset=:offset:&timeout=60";
var SEND_MESSAGE_URL = BASE_URL + "sendMessage";
var offset = 0;

// Long poll telegram for messages from the bot
async.forever(function(next) {
  var url = POLLING_URL.replace(":offset:", offset);

  console.log("getting URL " + url);

  unirest.get(url)
    .end(function(response) {
      var body = response.raw_body;

      console.log("got response" + body);

      if (response.status == 200) {
        var jsonData = JSON.parse(body);
        var result = jsonData.result;

        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            processResult(result[i]);
          }

          offset = parseInt(result[result.length - 1].update_id) + 1;
        }
      }
      next();
    });
}, function(err) {});