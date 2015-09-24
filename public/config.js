System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "angular": "github:angular/bower-angular@1.4.4",
    "angular-animate": "github:angular/bower-angular-animate@1.4.4",
    "angular-aria": "github:angular/bower-angular-aria@1.4.4",
    "angular-material": "github:angular/bower-material@0.10.1",
    "angular-resource": "github:angular/bower-angular-resource@1.4.4",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.15",
    "babel": "npm:babel-core@5.8.23",
    "babel-runtime": "npm:babel-runtime@5.8.20",
    "core-js": "npm:core-js@1.1.1",
    "github:angular-ui/ui-router@0.2.15": {
      "angular": "github:angular/bower-angular@1.4.4"
    },
    "github:angular/bower-angular-animate@1.4.4": {
      "angular": "github:angular/bower-angular@1.4.4"
    },
    "github:angular/bower-angular-aria@1.4.4": {
      "angular": "github:angular/bower-angular@1.4.4"
    },
    "github:angular/bower-material@0.10.1": {
      "angular": "github:angular/bower-angular@1.4.4",
      "angular-animate": "github:angular/bower-angular-animate@1.4.4",
      "angular-aria": "github:angular/bower-angular-aria@1.4.4",
      "css": "github:systemjs/plugin-css@0.1.15"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:babel-runtime@5.8.20": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@1.1.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});
