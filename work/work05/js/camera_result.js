
$(function(){

  result_arr = new Array();
  result_number_arr = new Array();
  result_lang_arr = new Array();
  result_img_arr = new Array();

  //  ログインIDを変数へ
  //if(sessionStorage.getItem('login_user_id') !== null){
  //  var login_user_id = sessionStorage.getItem('login_user_id');
  //  $("#result_db_set").show();
  //}else{
    $("#result_db_set").hide();
  //}

  //  結果をcookieから配列へ格納
  for( var i=0; i<$.cookie("count"); i++){
    var k = i + 1;
    result_arr[i] = $.cookie("result"+k);
    result_number_arr[i] = $.cookie("result_number"+k);
    result_lang_arr[i] = $.cookie("result_lang"+k);
    result_img_arr[i] = $.cookie("result_img"+k);

    //  結果をHTMLにセット
    $("#grading_main").append("<div class=\"main__row clearfix\"><p class=\"label\">"+k+"文字目</p><p class=\"point\">"+result_arr[i]+"点</p></div>");
  }

  //  結果を保存が押された場合
  $("#result_db_set").on('click', function(){
    //  同日付かつ同じユーザのデータ件数を取得
    dataCountGet(login_user_id);
  });



  //  同日付かつ同じユーザのデータ件数を取得
  function dataCountGet(){
    var param = {user_id: login_user_id};

    $.ajax({
      type: "POST",
      url: "http://mayomayooo.sakura.ne.jp/json_test/count_get.php",
      dataType : "json",
      data: param,
      cache: "false"
    }).done(function(data){

      //  5回分の結果をサーバーへ送信する
      for(var i=0; i<5; i++){
        dataSend(login_user_id,data.count,result_lang_arr[i],result_number_arr[i],result_arr[i]);
      }

      //  保存成功をアラート表示
      swal("データの保存に成功しました");
      $("#result_db_set").hide();

    }).fail(function(XMLHttpRequest, textStatus, errorThrown, data){
      alert("データの保存に失敗しました");
    });
  }



  //  結果をサーバーに送信
  function dataSend(login_user_id,count,word_lang,word_number,point){

    var param = {user_id: login_user_id, count: count, word_lang: word_lang, word_number: word_number, point: point};

    $.ajax({
      type: "POST",
      url: "http://mayomayooo.sakura.ne.jp/json_test/result_set.php",
      dataType : "json",
      data: param,
      cache: "false"
    }).done(function(data){

    }).fail(function(XMLHttpRequest, textStatus, errorThrown, data){
      //  保存失敗をアラート表示
      swal("保存に失敗しました");
    });
  }
});
