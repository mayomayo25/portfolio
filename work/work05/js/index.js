/////////////////////////////////////////////////////////
// iziModalの使用
$(document).on('click', '.open_config', function(event) {
  event.preventDefault();

  //  ログインしているか判定
  if(sessionStorage.getItem('login_user_id') !== null){
    $('#modal_config4').iziModal('open');
  }else{
    $('#modal_config2').iziModal('open');
  }
});
$(document).on('click', '.modal_prev', function(event) {
  event.preventDefault();
  $('#modal_config1').iziModal('next');
});
$(document).on('click', '.modal_next', function(event) {
  event.preventDefault();
  $('#modal_config3').iziModal('prev');
});
$('#modal_config1,#modal_config2,#modal_config3,#modal_config4,#modal_config5').iziModal({
  headerColor: '#37abd0', //ヘッダー部分の色
  width: 300,
  overlayColor: 'rgba(0, 0, 0, 0.7)', //モーダルの背景色
  fullscreen: true, //全画面表示
  transitionIn: 'fadeInUp', //表示される時のアニメーション
  transitionOut: 'fadeOutDown' //非表示になる時のアニメーション
});
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  ユーザ登録
$("#signup").on('click', function(){
  var name = $(".signup #name").val();
  var password = $(".signup #password").val();

  //  jsonにして格納
  var signup_user = {nickname: name,password: password};

  $.ajax({
    type: "POST",
    url: "http://mayomayooo.sakura.ne.jp/json_test/signup.php",
    dataType : "json",
    data: signup_user,
    cache: "false"
  }).done(function(data){
    signupAlert(data.nickname,data.password_hash);

  }).fail(function(XMLHttpRequest, textStatus, errorThrown, data){
    alert(errorThrown);
    alert(data.error);
  });
});
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  ログイン
$("#signin").on('click', function(){
  var name = $(".signin #name").val();
  var password = $(".signin #password").val();

  //  jsonにして格納
  var signin_user = {nickname: name,password: password};

  $.ajax({
    type: "POST",
    url: "http://mayomayooo.sakura.ne.jp/json_test/login.php",
    dataType : "json",
    data: signin_user,
    cache: "false"
  }).done(function(data){
    if("error" in data){
      loginFailAlert();
    }else{
      loginSet(data.user_id,data.nickname,data.password_hash);
      loginSuccessAlert(data.nickname);
      $('#modal_alert').iziModal('close');
    }
  }).fail(function(XMLHttpRequest, textStatus, errorThrown, data){
    alert(errorThrown);
  });
});
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  登録後のアラート表示
function signupAlert(nickname,password_hash){
  $('#modal_alert').iziModal('open');
  $('#modal_alert').iziModal({
    headerColor: '#0087b3', //ヘッダー部分の色
    width: 400, //横幅
    autoOpen:true, //ページを開いた時に表示
    timeout: 15000, //15秒で非表示
    pauseOnHover: true,　//マウスオーバーでカウントダウン停止
    timeoutProgressbar: true, //プログレスバーの表示
    attached: 'bottom' //アラートの表示位置 top or bottom or 指定なしで中央
  });

  //  アラートがタップされた場合
  $("#modal_alert").on('click', function(){
    userLogin(nickname,password_hash);
  });
}
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  ログイン成功時のアラート
function loginSuccessAlert(nickname){
  $("#login_success").attr("data-izimodal-title","ようこそ"+nickname+"さん！");
  $('#login_success').iziModal('open');
  $('#login_success').iziModal({
    headerColor: '#e87878', //ヘッダー部分の色
    width: 400, //横幅
    autoOpen:true, //ページを開いた時に表示
    timeout: 5000, //5秒で非表示
    pauseOnHover: true, //マウスオーバーでカウントダウン停止
    timeoutProgressbar: true, //プログレスバーの表示
    attached: 'bottom' //アラートの表示位置 top or bottom or 指定なしで中央
  });
}
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  ログイン失敗時のアラート
function loginFailAlert(){
  $("#login_fail").attr("data-izimodal-title","ログインに失敗しました");
  $('#login_fail').iziModal('open');
  $('#login_fail').iziModal({
    headerColor: '#e87878', //ヘッダー部分の色
    width: 400, //横幅
    autoOpen:true, //ページを開いた時に表示
    timeout: 5000, //5秒で非表示
    pauseOnHover: true, //マウスオーバーでカウントダウン停止
    timeoutProgressbar: true, //プログレスバーの表示
    attached: 'bottom' //アラートの表示位置 top or bottom or 指定なしで中央
  });
}
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  ログアウト時のアラート
function logoutAlert(nickname){
  $("#logout_alert").attr("data-izimodal-title","さようなら、"+nickname+"さん！");
  $('#logout_alert').iziModal('open');
  $('#logout_alert').iziModal({
    headerColor: '#e87878', //ヘッダー部分の色
    width: 400, //横幅
    autoOpen:true, //ページを開いた時に表示
    timeout: 5000, //5秒で非表示
    pauseOnHover: true, //マウスオーバーでカウントダウン停止
    timeoutProgressbar: true, //プログレスバーの表示
    attached: 'bottom' //アラートの表示位置 top or bottom or 指定なしで中央
  });
}
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  アラートをタップしてログイン
function userLogin(nickname,password_hash){
  var login_nickname = nickname;
  var login_password = password_hash;

  //  jsonにして格納
  var login_data = {nickname: login_nickname,password_hash: login_password};

  $.ajax({
    type: "POST",
    url: "http://mayomayooo.sakura.ne.jp/json_test/login.php",
    dataType : "json",
    data: login_data,
    cache: "false"
  }).done(function(data){
    $('#modal_alert').iziModal('close');
    loginSet(data.user_id,data.nickname,data.password_hash);
    loginSuccessAlert(data.nickname);

  }).fail(function(XMLHttpRequest, textStatus, errorThrown, data){
    alert(errorThrown);
    alert(data.error);
  });
}
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  ログイン
function loginSet(user_id,nickname,password_hash){
  //  sessionStrageにログイン情報を確認
  sessionStorage.setItem('login_user_id', user_id);
  sessionStorage.setItem('login_user_name', nickname);
  sessionStorage.setItem('login_password_hash', password_hash);
}
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  ログアウト
$("#logout").on('click', function(){
  var nickname = sessionStorage.getItem('login_user_name');

  //  セッションストレージに空文字をセット
  sessionStorage.removeItem('login_user_id');
  sessionStorage.removeItem('login_user_name');
  sessionStorage.removeItem('login_password_hash');
  //sessionStorage.clear();

  $('#modal_alert').iziModal('close');
  logoutAlert(nickname);
});
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  過去の結果を見る
$("#past_result").on('click', function(){
  //  過去のデータを取得
  pastResultGet(sessionStorage.getItem('login_user_id'));
});
/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
//  過去のデータを取得
function pastResultGet(user_id){

  var login_user_id = user_id;

  //  jsonにして格納
  var param = {login_user_id: login_user_id};

  $.ajax({
    type: "POST",
    url: "http://mayomayooo.sakura.ne.jp/json_test/past_result.php",
    dataType : "json",
    data: param,
    cache: "false"
  }).done(function(data){
    swal({
      title: "データの取得に成功しました!",text: "I will close in 2 seconds.",timer: 2000,showConfirmButton: false
    });
    $('#modal_config4').iziModal('close');
    $('#modal_config5').iziModal('open');

    //  過去のデータ表示用変数
    var str = "";
    var str2 = "";
    var k = 1;
    var l = 0;
    for(var i in data.aaa){
      if((i % 5) === 0){
        str += "<li id=\"record_row"+k+"\" class=\"record_row record"+k+"\"><p class=\"date\">"+data.aaa[i].insert_date.substring(0,10)+"&nbsp;その"+data.aaa[i].record_division+"</p></li>";
        k++;
      }
    }
    k--;//  10件のデータならk=2
    $("#past").html(str);

    for(var i=1; i<k+1; i++){
      str2 += "<ul class=\"item\">";
      for(var j=l; j<l+5; j++){
        str2 += "<li class=\"item__row clearfix\"><img class=\"image\" src=\"img/"+data.aaa[j].word_division+"_"+data.aaa[j].word_number+".png\"><div class=\"point\">"+data.aaa[j].grade_point+"点</div></li>";
      }
      l = j;
      str2 += "</ul>";

      $("#record_row"+i).append(str2);
      //  表示用変数を初期化
      str2 = "";
    }

  }).fail(function(XMLHttpRequest, textStatus, errorThrown, data){
    alert(errorThrown);
  });
}
/////////////////////////////////////////////////////////
