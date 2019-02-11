(function(pluginId) {
    "use strict";

    // プラグインの設定情報を取得
    // var CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
    // if (!CONFIG) { return false; }

    // var DisabeleItemFields = JSON.parse(CONFIG.DisableItem);
    // var DisabeleLineFields = JSON.parse(CONFIG.DisableLine);


    // var config = {
    //     'ZeroFillItem': JSON.stringify(arrayZeroFillItem),
    // };

    // let config = kintone.plugin.app.getConfig(pluginId)
    // console.log(config);
    let plugInConf = kintone.plugin.app.getConfig(pluginId)
    if (!plugInConf) { return false; }
    console.log(plugInConf);
    let config = {
        'ZeroFillItem': JSON.parse(plugInConf.ZeroFillItem)
    };
    // config = {
    //     'ZeroFillItem': JSON.stringify(arrayDisableItem),
    // };
    // if (!CONFIG) { return false; }
    // let config = JSON.parse(CONFIG.ZeroFillItem);

    // ダミー設定値
    // config = {
    //     'ZeroFillItem': ["単価", "単価_1", "単価_0"]
    // };
    console.log(config);
    console.log(JSON.stringify(config));

    // 詳細画面　編集
    kintone.events.on(['app.record.edit.show', 'app.record.create.show'], function(event) {
        let myIndexButton = document.createElement('button');
        myIndexButton.id = 'my_index_button';
        myIndexButton.innerHTML = 'ゼロ埋めボタン';
        myIndexButton.onclick = function() {
            let record = kintone.app.record.get();
            console.log(record);
            config.ZeroFillItem.forEach(function(value){
                console.log(record);
                console.log(value);
                console.log(record.record[value]);
                console.log(record.record[value].value);
                if (!record.record[value].value) {
                        console.log("record.value is NULL or undefined");
                    record.record[value].value = 0;
                } else {
                    console.log(record.record[value].value);
                }
            });
            kintone.app.record.set(record);
        }
        kintone.app.record.getHeaderMenuSpaceElement().appendChild(myIndexButton);
        return event;
    });
})(kintone.$PLUGIN_ID);
