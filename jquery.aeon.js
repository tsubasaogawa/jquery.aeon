// TODO: 
//   * グローバルの変数関数？はオブジェクト内に入れてあげて、オブジェクト->メソッド() みたいに呼び出せるようにしたい
//   * gzip 圧縮済みの JSON をデコードして読み出すようにしたい

  var aeons = null;
  var draw_aeons = function(aeons) {
    $("#aeon-contents").html('&nbsp;');

    // 各店舗ごとに処理
    for(var i in aeons) {
      var aeon_info = [];
      var aeon = aeons[i];

      // 店舗の情報を HTML に出力
      aeon_info.push("<h3>" + aeon.name + "</h3>");
      aeon_info.push("<div class=\"row\">");
      aeon_info.push("<div class=\"col-sm-12 col-md-7\">");
      aeon_info.push("<img src=\"images/aeon_" + aeon.id + ".jpg\" class=\"img-responsive\" /></div>");
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
      aeon_info.push("<h4>Comments</h4>");
      aeon_info.push("<ul>");

      for(var j in aeon.comments) {
        aeon_info.push("<li>" + aeon.comments[j] + "</li>");
      }
      aeon_info.push("</ul></div></div><hr />");
      $("#aeon-contents").append(aeon_info.join(""));
    }
    return true;
  };

  var get_aeon_count_as_pref = function(aeons) {
    var count = [];

    // 都道府県のイオンカウントを初期化
    for(var i=1; i<=47; i++) { count[i] = 0; }
    for(var i in aeons) {
      count[aeons[i].prefecture]++;
    }
    return count;
  }

  var get_regions = function(region_type) {
    var offsets = null;
    switch(region_type) {
    case 0:
      offsets = { start: 1, end: 1 };
      break;
    case 1:
      offsets = { start: 2, end: 7 };
      break;
    case 2:
      offsets = { start: 8, end: 14 };
      break;
    case 3:
      offsets = { start: 15, end: 23 };
      break;
    case 4:
      offsets = { start: 24, end: 30 };
      break;
    case 5:
      offsets = { start: 31, end: 35 };
      break;
    case 6:
      offsets = { start: 36, end: 39 };
      break;
    case 7:
      offsets = { start: 40, end: 46 };
      break;
    case 8:
      offsets = { start: 47, end: 47 };
      break;
    default:
      offsets = { start: 1, end: 1 };
    }
    // var count = offsets['end'] - offsets['start'];
    // return [...Array(count).keys()].map(i => i + 1 + offsets['start']);
    return offsets;
  };

  var sort_aeons = function(aeons, key, order=true) {
    var sorted_arr = _.sortBy(aeons, function(part) {
      if(key.indexOf('.') > -1) {
        keys = key.split('.');
        return part[keys[0]][keys[1]];
      }
      return part[key];
    });
    return order ? sorted_arr.reverse() : sorted_arr;
  };

jQuery(document).ready(function($) {
  // 色の設定
  // 最後の要素は白にしておく
  var areas = [
    {"code": 1, "color": "#ff99a8", "prefectures": []},
    {"code": 2, "color": "#fff099", "prefectures": []},
    {"code": 3, "color": "#a8ff99", "prefectures": []},
    {"code": 4, "color": "#ffffff", "prefectures": []}
  ];

  var draw_japanmap = function(count_pref) {
    // 色分けのしきい値
    var def_count_pref = [
      { "code": 1, "thres": 8 },
      { "code": 2, "thres": 5 },
      { "code": 3, "thres": 1 }
    ];

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
    return true;
  };

  $.when(
    $.getJSON("./data.json", function(json_data) {
      aeons = json_data.aeon;
    })
  ).done(function() {
    draw_aeons(aeons);

    var count_pref = get_aeon_count_as_pref(aeons);
    draw_japanmap(count_pref);
  });
});

var redraw_aeons = function(aeons) {
  var form = document.filter_sort;
  var params = {
    "filter": {
      "type": form.filter_type.value,
    },
    "sort": {
      "type": form.sort_type.value,
    }
  };
  
  switch(params['filter']['type']) {
  case 'region':
    pref_offsets = get_regions(form.filter_region_name.selectedIndex);
    aeons = _.filter(aeons, function(aeon) {
      pref = aeon['prefecture'];
      return (pref_offsets['start'] <= pref && pref <= pref_offsets['end']);
    });
    break;
  default: break;
  }

  aeons = sort_aeons(aeons, params['sort']['type'], form.sort_option_desc.checked);

  draw_aeons(aeons);
  return true;
};