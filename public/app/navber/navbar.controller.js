export default class navbarController{
    constructor(navbarFactory, $location, $anchorScroll) {
      this.links = navbarFactory;
      this.$location = $location;
      this.$anchorScroll = $anchorScroll;
    }

    isArray(data) {
      return angular.isArray(data);
    }
}
navbarController.$inject = ['navbarFactory', '$location', '$anchorScroll'];
