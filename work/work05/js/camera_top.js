//  オブジェクトを初期化
var hiraganaObjevt = new Object;
var countObject = new Object;

var kanziArray = new Array;
var hiraganaArray = new Array;


/////////////////////////////////////////////////////////
//  カメラモードの起動
$(function(){

  $("#camera").on("click",function(){
    snapPicture();
  });

  //  izimodalの設定
  $('#word_list_modal').iziModal({
    headerColor: '#37abd0', //ヘッダー部分の色
    width: 300,
    overlayColor: 'rgba(0, 0, 0, 0.7)', //モーダルの背景色
    fullscreen: true, //全画面表示
    transitionIn: 'fadeInUp', //表示される時のアニメーション
    transitionOut: 'fadeOutDown' //非表示になる時のアニメーション
  });
});
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  カメラ起動 & 撮影
function snapPicture(){
  navigator.camera.getPicture(onSuccess, onFail, { quality: 1, encodingType: Camera.EncodingType.JPEG, destinationType: Camera.DestinationType.DATA_URL});

  //A callback function when snapping picture is success.
  function onSuccess (imageData) {
    googleOcr(imageData);
  }

  //A callback function when snapping picture is fail.
  function onFail (message) {
    alert ('Error occured: ' + message);
  }
}
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  文字認識APIの利用
function googleOcr(b64){

  $("#photo_result").html("<img class=\"image\" src=\"data:image/jpeg;base64,"+b64+"\">");
  //var url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBAGfU0h87hk5BoN_FIf4T2AmHK5Aj7PbY";

  //var param = {"requests":[{"image":{"content":b64},"features":[{"type":"TEXT_DETECTION","maxResults":1}]}]};
  var param = {request_b64: b64};

  //  ローディングGIFの表示
  dispLoading("処理中...");

  $.ajax({
    type : 'post',
    url : "http://mayomayooo.sakura.ne.jp/json_test/ocr.php",
    data : param,
    cache: 'false',
    dataType : "json"
  })
  .done(function(data){
    removeLoading();

    //  アラート表示
    swal({
      title: data.responses[0].textAnnotations[0].description,
      text: "以上の文章で正しいですか？",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#37abd0",
      confirmButtonText: "単語を表示する",
      cancelButtonText: "撮り直し",
      closeOnConfirm: false,
      closeOnCancel: false
    },
    function(isConfirm){
      if (isConfirm) {
        //  アラートを閉じる
        swal.close();
        //  改行コードの削除
        var str = data.responses[0].textAnnotations[0].description;
        str = str.replace(/\r?\n/g,"");
        proccessDo(str);
      } else {
        //  カメラを起動する
        snapPicture();
      }
    });
  })
  .fail(function(data){
    alert("失敗");
    removeLoading();
  })
}
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  各種APIを順番に実行
function proccessDo(sentence){
  $.when(
    wordBlockGet(sentence)
  ).done(function(){
    //  アラートに単語一覧を表示
    wordListAlertDisp();
  });
}
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  形態素解析APIの利用
function wordBlockGet(sentence){
  var sentence = sentence;
  var key = "f84818115700e2095e988f6e49bfe9a4e03815c50bd93a667479a7cf2fd0ea4d";
  var url = "https://labs.goo.ne.jp/api/morph";

  var param = {app_id: key, sentence: sentence, info_filter: "form", pos_filter: "名詞"};

  $.ajax({
    type: "POST",
    url: url,
    dataType : "json",
    contentType: 'application/json',
    data: JSON.stringify(param),
    cache: "false"
  }).done(function(data){
    //  形態素APIで取得した単語をひらがなへ変換する
    for(var i=0; i<data.word_list[0].length; i++){
      //alert(data.word_list[0][i]);//  「桃」「桃太郎」
      wordhiraganaChange(data.word_list[0][i],i);
    }

    //  アラートに単語一覧を表示
    //wordListAlertDisp();

  }).fail(function(XMLHttpRequest, textStatus, errorThrown, data){
    alert(errorThrown);
    alert("失敗");
  });
}
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  ひらがな化APIの利用
function wordhiraganaChange(word,roop_count){
  var word = word;
  var roop_count = roop_count;
  var key = "f84818115700e2095e988f6e49bfe9a4e03815c50bd93a667479a7cf2fd0ea4d";
  var url = "https://labs.goo.ne.jp/api/hiragana";

  var param = {app_id: key, sentence: word, output_type: "hiragana"};

  $.ajax({
    type: "POST",
    url: url,
    dataType : "json",
    contentType: 'application/json',
    data: JSON.stringify(param),
    cache: "false"
  }).done(function(data){
    //  ひらがな化した単語
    var hiragana_word = data.converted;
    $("#list").append("<li class=\"hiragana_list__item\"><a class=\"link animsition-link\" href=\"camera_quiz.html?word="+hiragana_word+"\">"+hiragana_word+"</a></li>");

  }).fail(function(XMLHttpRequest, textStatus, errorThrown, data){
    return "error";
  });
}
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
function wordListAlertDisp(){
  //  izimodalの起動
  event.preventDefault();
  $('#word_list_modal').iziModal('open');
}
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
// Loadingイメージ表示関数
function dispLoading(msg){
    // 画面表示メッセージ
    var dispMsg = "";

    // 引数が空の場合は画像のみ
    if( msg != "" ){
        dispMsg = "<div class='loadingMsg'>" + msg + "</div>";
    }
    // ローディング画像が表示されていない場合のみ表示
    if($("#loading").size() == 0){
        $("body").append("<div id='loading'>" + dispMsg + "</div>");
    }
}

// Loadingイメージ削除関数
function removeLoading(){
	$("#loading").remove();
}
/////////////////////////////////////////////////////////
