// TODO: 
//   * 機能の関数化
// 覚書:
//   * getJSON() 内で行ったことは、たとえグローバル変数に対してもスコープ外ではなかったことになる

jQuery(document).ready(function($) {
  var count_pref = [];
  // 都道府県のイオンカウントを初期化
  for(var i=1; i<=47; i++) { count_pref[i] = 0; }

  // 最後の要素は白にしておく
  var areas = [
    {"code": 1, "color": "#57389e", "prefectures": []},
    {"code": 2, "color": "#92a1e8", "prefectures": []},
    {"code": 3, "color": "#dcd3ff", "prefectures": []},
    {"code": 4, "color": "#ffffff", "prefectures": []}
  ];
  // 色分けされるしきい値を設定
  var def_count_pref = [
    { "code": 1, "thres": 8, "color": "#57389e" },
    { "code": 2, "thres": 5, "color": "#92a1e8" },
    { "code": 3, "thres": 1, "color": "#dcd3ff" }
  ];

  $.getJSON("./data.json", function(aeons) {
    // 各店舗ごとに処理
    for(var i in aeons.aeon) {
      var aeon_info = [];
      var aeon = aeons.aeon[i];
      // イオンの所在地からイオンカウントをインクリメント
      count_pref[aeon.prefecture]++;

      // 店舗の情報を HTML に出力
      aeon_info.push("<h2>" + aeon.name + "</h2>");
      aeon_info.push("<div class=\"row\">");
      aeon_info.push("<div class=\"col-sm-12 col-md-7\">");
      aeon_info.push("<img src=\"images/aeon_" + i + ".jpg\" class=\"img-responsive\" /></div>");
      aeon_info.push("<div class=\"col-sm-12 col-md-5\">");
      aeon_info.push("<table class=\"table\">");
      aeon_info.push("<thead><th colspan=\"2\">Details</th></thead>");
      aeon_info.push("<tbody>");
      aeon_info.push("<tr><td>Location</td><td>" + aeon.location + "</td></tr>");
      aeon_info.push("<tr><td>Open</td><td>" + aeon.open + "</td></tr>");
      aeon_info.push("<tr><td>Tel</td><td>" + aeon.tel + "</td></tr>");
      aeon_info.push("<tr><td>Visit day</td><td>" + aeon.visit + "</td></tr>");
      aeon_info.push("<tr><td>URL</td><td><a href=\"" + aeon.url + "\" target=\"_blank\">" + aeon.url + "</a></td></tr>");
      aeon_info.push("</tbody></table></div>");
      aeon_info.push("<div class=\"col-sm-12 col-md-6\">");
      aeon_info.push("<table class=\"table table-condensed rating\">");
      aeon_info.push("<thead><tr><th colspan=\"2\">Ratings</th></tr></thead>");
      aeon_info.push("<tbody>");
      aeon_info.push("<tr><td>Building scale</td><td><span class=\"badge\">" + aeon.ratings.build_scale + "</span></td></tr>");
      aeon_info.push("<tr><td>Accessibility</td><td><span class=\"badge\">" + aeon.ratings.access + "</span></td></tr>");
      aeon_info.push("<tr><td>Food court</td><td><span class=\"badge\">" + aeon.ratings.food_court + "</span></td></tr>");
      aeon_info.push("<tr><td>Favorite</td><td><span class=\"badge\">" + aeon.ratings.favorite + "</span></td></tr>");
      aeon_info.push("</tbody></table></div>");
      aeon_info.push("<div class=\"col-sm-12 col-md-6\">");
      aeon_info.push("<h3>Comments</h3>");
      aeon_info.push("<ul>");

      for(var j in aeon.comments) {
        aeon_info.push("<li>" + aeon.comments[j] + "</li>");
      }
      aeon_info.push("</ul></div></div><hr />");
      $("#aeon-contents").append(aeon_info.join(""));
    }

    // 都道府県ごとに何色なのかを判定
    for(var i=1; i<=47; i++) {
      var succeeded_flag = false;
      for(var j in def_count_pref) {
        if(count_pref[i] >= def_count_pref[j]["thres"]) {
          areas[j]["prefectures"].push(i);
          succeeded_flag = true;
          break;
        }
      }
      // 1度も判定されなかったら最後の areas (= 白) に設定しておく
      if(! succeeded_flag) areas[areas.length - 1]["prefectures"].push(i);
    }
    $("#map-container").japanMap({
      areas: areas,
      selection: "prefecture",
      borderLineWidth: 0.25,
      borderLineColor: "#333333",
      drawsBoxLine: false,
      movesIslands: true,
      showsAreaName: false,
      width: 640,
      font: "MS Mincho",
      fontSize: 12,
      fontColor: "areaColor",
      fontShadowColor: "black",
    });
  });
});
