jQuery.noConflict();
(function ($, pluginId) {
    "use strict";
    // window.addEventListener('DOMContentLoaded', function() {
    $(document).ready(function() {

        function escapeHtml(htmlstr) {
            return htmlstr
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/'/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        console.log(kintone.plugin.app.getConfig(pluginId));
        // let config = kintone.plugin.app.getConfig(pluginId);
        // if (typeof (config['name']) !== 'undefined') {
        //     document.getElementById('name').value = config['name'];
        // }
        // if (typeof (config['unsei']) !== 'undefined') {
        //     document.getElementById('unsei').value = config['unsei'];
        // }

        // 設定を取得する
        var conf = kintone.plugin.app.getConfig(pluginId);
        var confValue = new Array(1);
        if (Object.keys(conf).length !== 0) {
            confValue = [
                JSON.parse(conf.ZeroFillItem),
            ];
        }
        console.log(confValue);

        var param = {'app': kintone.app.getId()};
        var url = kintone.api.url('/k/v1/preview/app/form/fields', true);
        // アプリのフォームフィールド情報を取得
        kintone.api(url, 'GET', param, function(resp) {
            console.log(resp);
            var cnt = 0;
            // tr１行目の要素のクローンを変数にセット
            var $cloneElem = $('.zero-fill-plugin_div').clone();
            // var $cloneElem = $('.prt-plugin_tr').clone();
            console.log($cloneElem);
            // フィールド要素ごとループ
            for (var key in resp.properties) {
                // keyが存在しない場合は次へ
                if (!resp.properties.hasOwnProperty(key)) { continue; }
                // フィールド要素１つ取り出し
                var prop = resp.properties[key];
                // フィールドタイプごとに処理を分ける
                switch (prop.type) {
                    case 'SUBTABLE':
                    case 'STATUS':
                    case 'STATUS_ASSIGNEE':
                    case 'RECORD_NUMBER':
                    case 'CALC':
                        break;
                    
                    case 'NUMBER':
                        if (cnt !== 0) {
                            // ２行目以降は、要素をクローンして追加
                            // $cloneElem.clone().appendTo('#prt-plugin-table');
                            $cloneElem.clone().appendTo('#form');
                        }

                        // $('.label').eq(cnt).text(escapeHtml(prop.label));
                        $('.label').eq(cnt).text(escapeHtml(prop.code));
                        $('.checkbox').eq(cnt).attr('name', escapeHtml(prop.code));
                        $('.checkbox').eq(cnt).attr('id', 'check_' + cnt);
                        $('.checkbox').eq(cnt).attr('value', escapeHtml(prop.code));

                        // 既存の設定値を反映
                        if ($.inArray(prop.code, confValue[0]) !== -1) {
                            $('.checkbox').eq(cnt).attr('checked', 'checked');
                        }

                        // 設定画面のテーブルの列ループ
                        // for (var i = 0; i < 3; i++) {
                        //     switch (i) {
                        //         case 0:
                        //             // タイトル
                        //             $('.prt-plugin-td_title').eq(cnt).text(escapeHtml(prop.label));
                        //             break;
                        //         case 1:
                        //         case 2:
                        //             // checkboxに id と value をセット
                        //             $('.checkbox_' + i).eq(cnt).attr('id', 'check_' + cnt + '-' + i);
                        //             $('.checkbox_' + i).eq(cnt).attr('value', escapeHtml(prop.code));
                        //             // 既存の設定値を反映
                        //             if ($.inArray(prop.code, confValue[i - 1]) !== -1) {
                        //                 $('.checkbox_' + i).eq(cnt).attr('checked', 'checked');
                        //             }
                        //             // label に checkbox の id を関連付ける
                        //             $('.label_' + i).eq(cnt).attr('for', 'check_' + cnt + '-' + i);
                        //             break;
                        //     }
                        // }

                        // default :

                        cnt++;
                        break;
                }
            }
        });

        function createConfig() {
            // 項目にチェックがついているフィールドを取得
            var arrayZeroFillItem = $('.checkbox:checked').map(function() {
                return $(this).val();
            }).get();
            console.log(arrayZeroFillItem);
            var config = {
                'ZeroFillItem': JSON.stringify(arrayZeroFillItem),
            };
            return config;
        }

        // 保存
        $('#button_submit').on('click', function() {
            var config = createConfig();
            console.log(config);
            // 設定を保存する
            kintone.plugin.app.setConfig(config);
            window.alert("保存しました");
    });

        // キャンセル
        $('#button_cancel').on('click', function() {
            window.history.back();
        });

        // document.getElementById("button_submit").onclick = function() {
        //     // let elName = document.getElementById('name');
        //     // let elUnsei = document.getElementById('unsei');
        //     // let config = {
        //     //     "name": elName.value,
        //     //     "unsei": elUnsei.value
        //     // };
        //     // kintone.plugin.app.setConfig(config);
        //     window.alert("保存しました");
        // };

    });

})(jQuery, kintone.$PLUGIN_ID);
