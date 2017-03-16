// 配列の宣言
// ひらがな
var word_img_arr = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74'];

// アルファベット
var alphabet_img_arr = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26'];

// 数字
var number_img_arr = ['00','01','02','03','04','05','06','07','08','09'];

// 採点回数
var grading_count = 0;

// 結果保持
var result_arr = new Array();
var result_number_arr = new Array();
var result_lang_arr = new Array();
var result_img_arr = new Array();


$(function(){

  //  GETパラメーターを取得
  var lang = getUrlParam();

  //  初めの画像を設定
  firstImageSet(lang);

  // canvasを取得
  var canvas = document.getElementById("rgba_canvas");
  var c = canvas.getContext("2d");

  //  結果表示ボタンを消す(5問終了で表示)
  $("#go_to_result").hide();

  // 「書き直し」をクリック
  $("#canvas_delete").click(function () {
    c.clearRect(0, 0, $(canvas).width(), $(canvas).height());
  });

  // 「次のひらがな」をクリック
  $("#go_to_next").click(function () {

    // 「次のひらがなへ」をクリックした1秒後に次のひらがなを表示
    setTimeout(function(){
      c.clearRect(0, 0, $(canvas).width(), $(canvas).height());
      nextWordSet(lang);
    },1000);
  });

  // 「結果表示」をクリック
  $("#go_to_result").click(function () {
    resultSet();
  });

  // canvasを画像に変換
  $("#canvas_to_img").click(function(){

    // キャンパス要素を取得 (既に描画されている)
    var canvas = document.getElementById("rgba_canvas") ;

    // 描画内容をデータURIに変換する (引数なしだとPNG)
    var dataURI = canvas.toDataURL() ;

    //  現在設定されているひらがな画像のsrc属性を取得
    var now_word = $("#canvas_back__image").attr("src");

    // Base64化した画像データをサーバーに送信
    sendImage(dataURI,now_word,lang);
  });
});




// Base64化した画像データをサーバーに送信
function sendImage(dataURI,now_word,lang){

  var param = {text: dataURI,now_word: now_word,now_lang: lang};

  $.ajax({
    type: "POST",
    url: "http://mayomayooo.sakura.ne.jp/json_test/ajax.php",
    dataType : "json",
    data: param,
    cache: "false"
  }).done(function(data){
    // 採点を行う
    grading(data.white,data.black,data.border,data.number,data.lang);

  }).fail(function(XMLHttpRequest, textStatus, errorThrown, data){
    alert(errorThrown);
  });
}



// 採点を行う
function grading(white,black,border,number,lang){

  var word_number = ('00'+number).slice(-2);
  var word_lang = lang;

  //  GETパラメーターを取得
  var lang = getUrlParam();

  // 全座標数から白抜きの部分を減算
  var word_black = 45000 - white;

  // なぞった部分が何パーセント一致しているか計算
  var percent = 100*(black/word_black);

  // 採点を何回行ったか記録
  grading_count++;

  swal("点数は"+percent.toFixed(2)+"点でした!!","採点"+grading_count+"回目!!");

  result_arr.push(percent.toFixed(2));
  result_number_arr.push(word_number);
  result_lang_arr.push(word_lang);
  result_img_arr.push(word_lang+"_"+word_number+".png");

  // 5回採点を行うと結果を表示するメニューを表示
  if(grading_count === 5){
    $("#go_to_result").show();
    $("#canvas_delete").hide();
    $("#canvas_to_img").hide();

  }else{
    // canvasを取得
    var canvas = document.getElementById("rgba_canvas");
    var c = canvas.getContext("2d");

    // canvasを削除
    c.clearRect(0, 0, $(canvas).width(), $(canvas).height());

    // 次の画像をセット
    nextWordSet(lang);
  }
}



// 次の画像をセットする
function nextWordSet(lang){
  if(lang === "word"){
    var next_image = "img/word_white_"+word_img_arr[Math.floor(Math.random() * word_img_arr.length)]+".png";

  }else if(lang === "alphabet"){
    var next_image = "img/alphabet_white_"+alphabet_img_arr[Math.floor(Math.random() * alphabet_img_arr.length)]+".png";

  }else{
    var next_image = "img/number_white_"+number_img_arr[Math.floor(Math.random() * number_img_arr.length)]+".png";
  }

  $("#canvas_back__image").attr("src",next_image);
}



// URLからGETパラメータを取得
function getUrlParam(){
  var arg  = new Object;
  url = location.search.substring(1).split('&');

  for(i=0; url[i]; i++) {
    var k = url[i].split('=');
    arg[k[0]] = k[1];
  }

  var lang = arg.lang;

  return lang;
}



// 最初の画像をセット
function firstImageSet(lang){

  if(lang === "word"){
    var first_image = "img/word_white_"+word_img_arr[Math.floor(Math.random() * word_img_arr.length)]+".png";

  }else if(lang === "alphabet"){
    var first_image = "img/alphabet_white_"+alphabet_img_arr[Math.floor(Math.random() * alphabet_img_arr.length)]+".png";

  }else{
    var first_image = "img/number_white_"+number_img_arr[Math.floor(Math.random() * number_img_arr.length)]+".png";
  }

  $("#canvas_back__image").attr("src",first_image);
}



// 結果を保存
function resultSet(){
  for(var i=0; i<5; i++){
    var k = i + 1;
    $.cookie("result"+k,result_arr[i]);
    $.cookie("result_number"+k,result_number_arr[i]);
    $.cookie("result_lang"+k,result_lang_arr[i]);
    $.cookie("result_img"+k,result_img_arr[i]);
  }
  //alert($.cookie("result1")+"<br>"+$.cookie("result2")+"<br>"+$.cookie("result3")+"<br>"+$.cookie("result4")+"<br>"+$.cookie("result5"));
}
