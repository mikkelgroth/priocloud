angular.module('riskApp.controllers')
.filter('multiFilter', function () {
  return function (items, filterData) {
      if(filterData == undefined)
          return items;
      var keys = Object.keys(filterData);  
      var filtered = [];
      var populate = true;
      for (var i = 0; i < items.length; i++) {
          var item = items[i];
          populate = true;
          for(var j = 0; j < keys.length ; j++){
              if(filterData[keys[j]] != undefined){
                   console.log(filterData[keys[j]]+ "    "+item[keys[j]]);
                  if(filterData[keys[j]].length == 0 || filterData[keys[j]].contains(item[keys[j]])){
                      populate = true;
                  }else{
                      populate = false;
                      break;
                  }
              }
          }
          if(populate){
              filtered.push(item);
          }
      }
    return filtered;
  };
});