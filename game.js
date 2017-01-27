var latlongdata;
var option = [];
var correct_option;
var reset_button;
var map_area;
var correct_answers = 0;
var total_questions = 0;
var score;
var option_list;
var success_message;
var failure_message;
var success_text;
var failure_text;
var max_zoom = 18;
var min_zoom = 12;
var min_zoom_dispabled = 8;
var screen_option=[];
var success_sound;
var failure_sound;

function setup(){
  noCanvas();

  //LOADING JSON FILE
  $.getJSON("latlongdata.json", dataready);

  //DISPLAY STARTING SCORE (0/0)
  display_score();

  //THESE THREE BUCKETS WILL APPEAR IN SAME AREA DEPENDING ON CONTEXT
  option_list = select("#options");
  success_message = select("#success");
  failure_message = select("#failure");

  //INORDER TO CHANGE THE MESSAGES
  success_text = select(".success_text");
  failure_text = select(".failure_text");

  //SETTING CLICK BEHAVIOR ON OPTIONS
  for(i = 0; i < 4; i++){
    screen_option[i] = select("#option" + i);
    screen_option[i].mousePressed(check_answer);
  }

  //REFOCUSSING MAP TO ORIGINAL
  reset_button = select("#reset");
  reset_button.mousePressed(function(){
    initialize_map(correct_option, min_zoom);
  });

  //AVAILABLE IN SUCCESS/FAILURE MESSAGES
  var next_button = selectAll(".next_button");
  for(i = 0 ; i < next_button.length ; i++){
    next_button[i].mousePressed(function(){
      getoptions();
    });
  }

  success_sound = loadSound('correct.wav');
  failure_sound = loadSound('incorrect.mp3');

}

function display_score(){
  score = select("#score_tally");
  score.html(correct_answers + "/" + total_questions);
}

function dataready(data) {
  latlongdata = data;
  getoptions();
};

function getoptions(){
  var n = 0;
  //FINDS FOUR RANDOM NUMBERS BETWEEN 0-THE NUMBER OF ELEMENTS IN JSON
  for(i = 0 ; i < 4 ; i++){
    option[i] = floor(random(n, n + latlongdata.length / 4));
    if(option[i] > latlongdata.length - 1){option[i] = latlongdata.length - 1;}
    n += latlongdata.length / 4;
  }
  //RANDOMLY ASSIGNS ONE NUMBER AS THE CORRECT ANSWER
  correct_option = option[floor(random(0,4))];
  console.log(latlongdata[correct_option].state);
  //INITIALIZE THE MAP TO CORRECT OPTION
  if(!map_area){
    map_area = L.map('map');
    initialize_map(correct_option);
  }
  else{
    initialize_map(correct_option);
  }

  //DISPLAY OPTIONS ON SCREEN
  display_options();
}

function display_options(){
  for(i = 0; i < 4; i++){
    screen_option[i].html(latlongdata[option[i]].state);
  }
  option_list.style("display", "inline-block");
  success_message.style("display", "none");
  failure_message.style("display", "none");
  reset_button.style("display", "inline-block");
}

function check_answer(){
  console.log("checking answer");
  if(this.elt.innerHTML == latlongdata[correct_option].state){
    success_sound.play();
    display_success();
  }
  else{
    failure_sound.play();
    display_failure(this.elt.innerHTML);
  }
}

function display_success(){
  correct_answers += 1;
  total_questions += 1;
  console.log("total question: " + total_questions);
  display_score();
  option_list.style("display", "none");
  success_message.style("display", "inline-block");
  success_text.html("That's right! It is indeed " + latlongdata[correct_option].state);
  reset_button.style("display", "none");
}

function display_failure(selected_option){
  total_questions += 1;
  console.log("total question: " + total_questions);
  display_score();
  option_list.style("display", "none");
  failure_message.style("display", "inline-block");
  failure_text.html("Nope! It is not " + selected_option + ". It is actually " + latlongdata[correct_option].state);
  reset_button.style("display", "none");
}

// MAP STUFF
// Initialize function is made separately to regenerate map
function initialize_map(option){
  var xpos = latlongdata[option].latitude;
  var ypos = latlongdata[option].longitude;
  map_area.setView([xpos, ypos], 13);
  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png',{
    maxZoom: max_zoom,
    minZoom: min_zoom
  }).addTo(map_area);
}
