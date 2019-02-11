jQuery.noConflict();
(function ($, pluginId) {
    "use strict";
    // window.addEventListener('DOMContentLoaded', function() {
    $(document).ready(function() {
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
