var conversation = {
  "1": {
    "statement": ["Hey!", "What's your name?"],
    "input": {"name": "name", "consequence": "2"},
  },
  "2": {
    "statement": function(context) {
      return ["Hello " + context.name];
    },
    "options": [{
      "choice": "Hello",
      "consequence": "4"
    }]
  },
  "4": {
    "statement": ["Nice to meet you.", "How are you doing today?"],
    "options": [{
      "choice": "Great",
      "consequence": "5.1"
    },{
      "choice": "So so",
      "consequence": "5.2"
    }]
  },
  "5.1": {
    "statement": ["Nice to hear that! 👍", "Take it easy!"],
    "options": [{
      "choice": "Ok",
      "consequence": "6"
    }],
    sideeffect: function(context) {
      context.feeling = "GREAT"
    }
  },
  "5.2": {
    "statement": ["I'm sorry. 😔", "Let me know if I can cheer you up."],
    "options": [{
      "choice": "Will do",
      "consequence": "6"
    }],
    sideeffect: function(context) {
      context.feeling = "SOSO"
    },
  },
  "6": {
    "statement": ["Ok. I've got to go.", "Talk to you later!"],
    "options": [{
      "choice": "Bye",
      "consequence": null
    }]
  }
};