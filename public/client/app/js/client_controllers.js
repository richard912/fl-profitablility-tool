'use strict';

/* Controllers */

var profitabilityApp = angular.module('profitabilityApp');

profitabilityApp.controller('ClientCtrl', ['$scope', '$http', '$location', '$localStorage', '$routeParams', 'Auth',
  function($scope, $http, $location, $localStorage, $routeParams, Auth) {
    
    $scope.name = $scope.industry = $scope.location = '';
    $scope.size = '';
    $scope.routeParams = $routeParams;
    console.log($routeParams);
    $scope.projects = [];
    $scope.project_types = [];

    // for adding the product
    $scope.project_name = $scope.project_type = '';

    $scope.gross_info = {
      revenue: 0.0,
      expense: 0.0,
      profit: 0.0,
      margin: 0.0
    }

    $scope.init = function() {

      if (!Auth.isLoggedIn()) {
        $location.path('/signin');
        return;
      };

      if ($location.$$path == '/add-client') {
        $('body').removeClass().addClass('short-header');
      } else if ($location.$$path.indexOf('/clients/') !== -1) {
        $('body').removeClass();
        var req = {
          method: 'GET',
          url: '/v1/users/clients/' + $scope.routeParams.client_id,
          headers: {
            "Authorization": $localStorage.logged_user.access_token
          },
          data: {
          }
        }

        $http(req).then(function(data) {
          console.log(data);
          $scope.projects = data.data.client.projects;
          $scope.project_types = data.data.client.project_types
          $scope.industry = data.data.client.industry
          $scope.location = data.data.client.location
          
          $scope.load_gross_info();
          if ($scope.projects.length == 0) {
            $('#modal-client-wizard').modal('show')
          };
        }, function(data) {
          console.log(data);
        });
      };
      fitScreenHeight();
    }

    $scope.load_gross_info = function() {
      var total_revenue = 0.0
      var total_expense = 0.0
      var total_profit = 0.0
      var total_margin = 0.0
      for(var i = 0; i < $scope.projects.length; i++) {
        total_revenue += parseFloat($scope.projects[i].estimated_gross_info.gross_revenue.toString());
        total_expense += parseFloat($scope.projects[i].estimated_gross_info.gross_expense.toString());
        total_profit += parseFloat($scope.projects[i].estimated_gross_info.gross_profit.toString());
      }

      if (total_revenue > 0) {
        total_margin = total_profit / total_revenue * 100;
      };
      $scope.gross_info = {
        revenue: total_revenue.formatMoney(),
        expense: total_expense.formatMoney(),
        profit: total_profit.formatMoney(),
        margin: total_margin.formatMoney()
      }
    }

    $scope.init();

    $scope.goto_project = function(project_id) {
      $location.path('/projects/' + project_id + '/estimate');
    }

    $scope.add_client = function() {
      var req = {
        method: 'POST',
        url: '/v1/users/clients',
        headers: {
          "Authorization": $localStorage.logged_user.access_token
        },
        data: {
          client: {
            name: $scope.name,
            industry: $scope.industry,
            location: $scope.location,
            size: $scope.size
          }
        }
      }

      $http(req).then(function(data) {
        console.log(data);
        $location.path('/client');
      }, function(data) {
        console.log(data);
      });
    }

    $scope.add_project = function() {
      var req = {
        method: 'POST',
        url: '/v1/users/clients/' + $scope.routeParams.client_id + '/projects',
        headers: {
          "Authorization": $localStorage.logged_user.access_token
        },
        data: {
          project: {
            name: $scope.project_name,
            project_type: $scope.project_type
          }
        }
      }

      $http(req).then(function(data) {
        console.log(data);
        $scope.projects = data.data.client.projects;
        $scope.project_name = $scope.project_type = '';
        $('#modal-add-project .modal-dialog .modal-content .modal-header button').trigger('click');
        $('.modal-backdrop').remove();
      }, function(data) {
        console.log(data);
      });
    }

    $scope.show_display_gross_revenue = function(project_index) {
      var project = $scope.projects[project_index]
      return project.estimated_gross_info.gross_revenue.toString().formatNumber().formatMoney();
    }

    $scope.show_display_gross_expense = function(project_index) {
      var project = $scope.projects[project_index]
      return project.estimated_gross_info.gross_expense.toString().formatNumber().formatMoney();
    }

    $scope.show_display_gross_profit = function(project_index) {
      var project = $scope.projects[project_index]
      return project.estimated_gross_info.gross_profit.toString().formatNumber().formatMoney();
    }

    $scope.show_display_gross_margin = function(project_index) {
      var project = $scope.projects[project_index]
      return project.estimated_gross_info.gross_margin.toString().formatNumber().formatMoney();
    }

    $scope.remove_project = function(project_index) {
      var project = $scope.projects[project_index];
      var req = {
        method: 'DELETE',
        url: '/v1/projects/' + project.id,
        headers: {
          "Authorization": $localStorage.logged_user.access_token
        },
        data: {
        }
      }

      $http(req).then(function(data) {
        console.log(data);
        // $scope.projects = data.data.client.projects;
        $scope.projects.splice(project_index, 1);

        $scope.load_gross_info();
        
      }, function(data) {
        console.log(data);
      });
    }

    $scope.sign_out = function() {
      Auth.signOut();
    }
  }]);