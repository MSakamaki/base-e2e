export default class funcController{
    constructor($resource, $http, navbarFactory) {
      this.$http = $http;
      this.$resource = $resource;
      this.navbarFactory = navbarFactory;
      this.load();
    }

    splitMessage(msg) {
      return msg.split('\n');
    }

    load() {
      var _this = this;
      this.$http.get('functional/functional.json').then((res)=> {

        // set navigation bar
        angular.forEach(res.data, (suite)=> {
          this.navbarFactory.push({
            name: suite.description,
            links:suite.description,
          });
        });

        // set viewing
        for (var suite in res.data) {
          res.data[suite].sucess = function() {
            return this.specs.reduce(_this.specSucessResult, 0);
          };

          res.data[suite].successRate = function() {
            return this.specs.length === 0 ? 100 :
                Math.round(this.sucess() / this.specs.length * 100);
          };
        }

        var reports = {
          body: res.data,
          specNum: function() {
            var result = 0;
            for (var suite in this.body) {
              result += this.body[suite].specs.length;
            }

            return result;
          },

          successSpecNum: function() {
            var result = 0;
            for (var suite in this.body) {
              result += this.body[suite].specs.reduce(_this.specSucessResult, 0);
            }

            return result;
          },

          successRate: function() {
            var specNum = this.specNum();
            var successSpecNum = this.successSpecNum();
            return specNum === 0 ? 100 :
                Math.round(successSpecNum / specNum * 100);
          },
        };
        this.reports = reports;
      }).catch(e => console.log('リソースなし', e));
    }

    specSucessResult(acc, spec) {
      return acc + (spec.status === 'passed' ? 1 : 0);
    }
}
funcController.$inject = ['$resource', '$http', 'navbarFactory'];
