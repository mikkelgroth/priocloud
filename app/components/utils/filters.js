angular
    .module('riskApp')
    .filter('multiFilter', function () {

        return function (items, filterData) {

            if (filterData == undefined)
                return items;

            var keys = Object.keys(filterData);
            var filtered = [];
            var populate = true;

            for (var i = 0; i < items.length; i++) {

                var item = items[i];
                populate = true;

                for (var j = 0; j < keys.length; j++) {

                    if (filterData[keys[j]] != undefined) {
                        if (keys[j] === "support") {
                            
                            if (filterData[keys[j]].length == 0 || 
                                doesListContain(filterData[keys[j]], item["support"]) || 
                                doesListContain(filterData[keys[j]], item["support2"]) ||
                                doesListContain(filterData[keys[j]], item["support3"]) || 
                                doesListContain(filterData[keys[j]], item["support4"]) ||
                                doesListContain(filterData[keys[j]], item["support5"])) {

                                populate = true;
    
                            } else {
                                
                                populate = false;
                                break;
                            }

                        } else {
                        
                            if (filterData[keys[j]].length == 0 || doesListContain(filterData[keys[j]], item[keys[j]])) {

                                populate = true;

                            } else {
                                
                                populate = false;
                                break;
                            }
                    }
                        
                    }
                }

                if (populate) {
                    filtered.push(item);
                }
            }

            function doesListContain(list, obj) {

                var i = list.length;

                while (i--) {
                    if (list[i] === obj) {
                        return true;
                    }
                }

                return false;
            }

            return filtered;
        };
    });
