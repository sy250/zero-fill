(function(pluginId) {
    "use strict";

    // プラグインの設定情報を取得
    let plugInConf = kintone.plugin.app.getConfig(pluginId)
    if (!plugInConf) { return false; }
    console.log(plugInConf);
    let config = {
        'ZeroFillItem': JSON.parse(plugInConf.ZeroFillItem)
    };
    console.log(config);

    // 詳細画面　編集
    kintone.events.on(['app.record.edit.show', 'app.record.create.show'], function(event) {
        let myIndexButton = document.createElement('button');
        myIndexButton.id = 'my_index_button';
        myIndexButton.innerHTML = 'ゼロ埋めボタン';
        myIndexButton.onclick = function() {
            let record = kintone.app.record.get();
            console.log(record);
            config.ZeroFillItem.forEach(function(value){
                // プラグインの設定値がオブジェクトの時
                if ( Object.prototype.toString.call( value ) === "[object Object]" ) {
                    // SUBTABLEの場合
                    // console.log("is Object: " + value);
                    // console.log(Object.keys(value)[0]);
                    // console.log(Object.values(value));
                    let objVal = Object.values(value);
                    let objKey = Object.keys(value)[0];
                    // console.log(objKey);
                    // console.log(record.record[objKey]);
                    // console.log(record.record[objKey].value);
                    for (let values of record.record[objKey].value) {
                        console.log(values);
                        for (let v of objVal[0]) {
                            if (!values.value[v].value) {
                                console.log("record.value is NULL or undefined");
                                values.value[v].value = 0;
                            } else {
                                console.log(values.value[v].value);
                            }
                        }
                    }

                } else {
                    // SUBTABLE以外
                    // console.log(record);
                    // console.log(value);
                    // console.log(record.record[value]);
                    // console.log(record.record[value].value);
                    if (!record.record[value].value) {
                            console.log("record.value is NULL or undefined");
                        record.record[value].value = 0;
                    } else {
                        console.log(record.record[value].value);
                    }

                }
            });
            kintone.app.record.set(record);
        }
        kintone.app.record.getHeaderMenuSpaceElement().appendChild(myIndexButton);
        return event;
    });
})(kintone.$PLUGIN_ID);
