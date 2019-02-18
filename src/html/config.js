jQuery.noConflict();
(function ($, pluginId) {
    "use strict";
    $(document).ready(function() {

        function escapeHtml(htmlstr) {
            return htmlstr
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/'/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        // 設定を取得する
        // confValue = ["code", "code", ... ]
        // type: SUBTABLE
        //   confValue = ["subtable-code": ["code", "code", ... ]]
        let conf = kintone.plugin.app.getConfig(pluginId);
        let confValue = [];
        if (Object.keys(conf).length !== 0) {
            confValue = [
                JSON.parse(conf.ZeroFillItem),
            ];
        }
        console.log("ZeroFillItem: " + confValue);
        console.log(confValue[0]);

        let param = {'app': kintone.app.getId()};
        let url = kintone.api.url('/k/v1/preview/app/form/fields', true);
        // アプリのフォームフィールド情報を取得
        kintone.api(url, 'GET', param, function(resp) {
            console.log(resp);
            console.log(resp.properties);
            let cloneElemCnt = 0;
            // １つ目のdiv要素のクローンを変数にセット
            let $cloneElem = $('.zero-fill-plugin_div').clone();
            // $('.zero-fill-plugin_div').remove();
            console.log($cloneElem);
            // フィールド要素ごとループ
            for (let key in resp.properties) {
                console.log(key);
                // keyが存在しない場合は次へ
                if (!resp.properties.hasOwnProperty(key)) { continue; }
                // フィールド要素１つ取り出し
                let prop = resp.properties[key];
                // フィールドタイプごとに処理を分ける
                switch (prop.type) {
                    // サブテーブル対応
                    case 'SUBTABLE':
                    console.log(prop.code);
                    console.log(prop.fields);
                    for (let key in prop.fields) {
                        console.log(key);
                        // keyが存在しない場合は次へ
                        // if (!prop.fields.hasOwnProperty(key)) { continue; }
                        // フィールド要素１つ取り出し
                        let field = prop.fields[key];
                        console.log(field);
                        switch (field.type) {
                            case 'NUMBER':
                            console.log(field.code);
                            // console.log(prop.fields);
                            if (cloneElemCnt !== 0) {
                                // ２つ目以降は、要素をクローンして親要素に追加する
                                $cloneElem.clone().appendTo('#form');
                            }
                            $('.label').eq(cloneElemCnt).text(escapeHtml(field.code));
                            $('.checkbox').eq(cloneElemCnt).attr('name', escapeHtml(field.code));
                            // $('.checkbox').eq(cloneElemCnt).attr('class', escapeHtml("subtable_" + prop.code));
                            $('.checkbox').eq(cloneElemCnt).attr('id', 'check_' + cloneElemCnt);
                            $('.checkbox').eq(cloneElemCnt).attr('value', escapeHtml(field.code));
                            $('.checkbox').eq(cloneElemCnt).toggleClass(escapeHtml("subtable_" + prop.code));
                            // 既存の設定値を反映
                            // inArray から　filter に変更。

                            // let findFieldCode = confValue[0].find(function(value){
                            //     return value === field.code;
                            // });
                            // console.log("find field.code: " + findFieldCode);
                            // if ($.inArray(field.code, confValue[0]) !== -1) {
                            //     $('.checkbox').eq(cloneElemCnt).attr('checked', 'checked');
                            // }

                            let findFieldCode = confValue[0].find(function(value){
                                // return value[prop.code].find() === field.code;
                                // return $.inArray(value[prop.code], field.code) !== -1;
                                return $.inArray(value[prop.code], field.code) !== -1;
                            });
                            console.log("find field.code: " + findFieldCode);
                            if ($.inArray(field.code, findFieldCode) !== -1) {
                                $('.checkbox').eq(cloneElemCnt).attr('checked', 'checked');
                            }
                            cloneElemCnt++;
                            break;
                        }
                    }

                    case 'STATUS':
                    case 'STATUS_ASSIGNEE':
                    case 'RECORD_NUMBER':
                    case 'CALC':
                        break;
                    
                    case 'NUMBER':
                        if (cloneElemCnt !== 0) {
                            // ２つ目以降は、要素をクローンして親要素に追加する
                            $cloneElem.clone().appendTo('#form');
                        }
                        $('.label').eq(cloneElemCnt).text(escapeHtml(prop.code));
                        $('.checkbox').eq(cloneElemCnt).attr('name', escapeHtml(prop.code));
                        $('.checkbox').eq(cloneElemCnt).attr('id', 'check_' + cloneElemCnt);
                        $('.checkbox').eq(cloneElemCnt).attr('value', escapeHtml(prop.code));
                        // 既存の設定値を反映
                        if ($.inArray(prop.code, confValue[0]) !== -1) {
                            $('.checkbox').eq(cloneElemCnt).attr('checked', 'checked');
                        }
                        cloneElemCnt++;
                        break;

                    default :
                        break;
                }
            }
        });

        function createConfig() {
            console.log($("[class^='subtable']").map(function(){return $(this).val()}).get());
            // 項目にチェックがついているフィールドを取得
            let arrayZeroFillItem = $('.checkbox:checked').map(function() {
                return $(this).val();
            }).get();
            let config = {
                'ZeroFillItem': JSON.stringify(arrayZeroFillItem),
            };
            return config;
        }

        function createConfig_subtable() {
            let arrayZeroFillItem = [];
            // チェックした要素をループ
            $('.checkbox:checked').each(function(){
                // checked value
                console.log("checked: " + $(this).val());
                // subtableの時
                if($(this).attr("class").match(/subtable_/)) {
                    let matchStr = $(this).attr("class").match(/(subtable)(_)(.*)/g)[0].split(/_/g);
                    // subtable code
                    console.log("subtable code: " + matchStr[1]);
                    let subtableCode = matchStr[1];
                    // keyが存在した時
                    console.log(arrayZeroFillItem);
                    let findIndex = arrayZeroFillItem.findIndex(function(elm){
                    console.log("element: " + elm);
                        if(elm[subtableCode]){
                            console.log(elm[subtableCode]);
                            return elm;
                        } else {
                            console.log("not element");
                        }
                    });
                    console.log("find index: " + findIndex);
                    // if(keys.length){
                    if(findIndex !== -1){
                        arrayZeroFillItem[findIndex][subtableCode].push($(this).val());
                    } else {
                        // keyが存在しない時
                        let key = matchStr[1];
                        let obj = new Object();
                        console.log("new key: " + $(this).val());
                        obj[key] = new Array($(this).val());
                        arrayZeroFillItem.push(obj);
                    }
                } else { // subtableでは無い時
                    console.log($(this).val());
                    console.log("not subtable");
                    arrayZeroFillItem.push($(this).val());
                }
            });
            let config = {
                'ZeroFillItem': JSON.stringify(arrayZeroFillItem),
            };
            return config;
        }

        // 保存
        $('#button_submit').on('click', function() {
            // let config = createConfig();
            let config = createConfig_subtable();
            console.log(config);
            // 設定を保存する
            kintone.plugin.app.setConfig(config);
            window.alert("保存しました");
        });
        // キャンセル
        $('#button_cancel').on('click', function() {
            window.history.back();
        });
    });

})(jQuery, kintone.$PLUGIN_ID);
