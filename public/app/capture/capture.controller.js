export default class captureController{
    constructor($resource, $http, navbarFactory) {
      this.$http = $http;
      this.navbarFactory = navbarFactory;
      this.initialize();
    }

    initialize() {
      this.$http.get('functional/capture/photo.json')
          .then((req)=> {
            this.suites = req.data;
          }).catch(e => console.log('リソースなし', e));
    }
}
captureController.$inject = ['$resource', '$http', 'navbarFactory'];
