'use strict';

/* Controllers */

var profitabilityApp = angular.module('profitabilityApp');

profitabilityApp.controller('ProjectEstimateCtrl', ['$scope', '$http', '$location', '$localStorage', '$routeParams', 'Auth',
  function($scope, $http, $location, $localStorage, $routeParams, Auth) {
    
    $scope.routeParams = $routeParams;

    $scope.resources = [];
    $scope.timelines = [];
    $scope.resource_timelines = [];
    $scope.project = {};
    $scope.is_resource_changed = false;
    $scope.is_resource_timeline_changed = false;

    $scope.bullet_count = 0;
    $scope.current_bullet_index = 0;
    $scope.current_min_timeline_index = 0;
    $scope.current_max_timeline_index = 0;
    $scope.resource_total_hours = [];
    $scope.total_hours = 0;
    $scope.gross_total_info = {
      gross_revenue: "0.00",
      gross_expense: "0.00",
      gross_profit: "0.00",
      gross_margin: "0.00",
    };

    $scope.resource_change = function() {
      $scope.is_resource_changed = true;
    }

    $scope.load = function() {

      if (!Auth.isLoggedIn()) {
        $location.path('/signin');
        return;
      };

      var req = {
        method: 'GET',
        url: '/v1/projects/' + $scope.routeParams.project_id,
        headers: {
          "Authorization": $localStorage.logged_user.access_token
        },
        data: {
          
        }
      }

      $http(req).then(function(data) {
        console.log(data);
        // $location.path('/projects/' + )
        $scope.project.id = data.data.project.id;
        $scope.project.name = data.data.project.name;
        $scope.project.project_type = data.data.project.project_type;

        $scope.resources = data.data.project.estimated_resources;
        $scope.timelines = data.data.project.estimated_timelines;
        $scope.resource_timelines = data.data.project.estimated_resource_timelines;
        $scope.client_id = data.data.project.client_id;
        $scope.after_load_project();
      }, function(data) {
        console.log(data);
      });
    }

    $scope.adjust_bullet_index = function() {
      $scope.bullet_count = Math.ceil($scope.timelines.length / 3);
      if ($scope.bullet_count > 0) {
        if ($scope.current_bullet_index > $scope.bullet_count - 1) {
          $scope.current_bullet_index = $scope.bullet_count - 1
        };
        $scope.current_bullet_index = Math.min($scope.current_bullet_index, $scope.bullet_count - 1)
        $scope.current_min_timeline_index = $scope.current_bullet_index * 3;
        $scope.current_max_timeline_index = Math.min($scope.current_bullet_index * 3 + 2, $scope.timelines.length - 1);
      } else {
        $scope.current_min_timeline_index = 0;
        $scope.current_max_timeline_index = 0;
      }
    }

    $scope.cal_total_resource_hours = function() {
      $scope.resource_total_hours = [];
      var resource_total_hours = 0;
      var total_hours = 0;
      for(var i = 0; i < $scope.resources.length; i++) {
        resource_total_hours = 0;
        for(var j = 0; j < $scope.timelines.length; j++) {
          resource_total_hours += $scope.resource_timelines[i][j].hours.formatNumber();
        }
        total_hours += resource_total_hours;
        $scope.resource_total_hours.push(resource_total_hours);
      }
      $scope.total_hours = total_hours;
    }

    $scope.after_load_project = function() {
      $scope.adjust_bullet_index();
      $scope.cal_total_resource_hours();
      // $scope.cal_gross_total_info();
    }

    $scope.init = function() {
      $scope.load();
      $('body').removeClass();
    }
    
    $scope.init();

    $scope.change_bullet_index = function(bullet_index) {
      if ($scope.current_bullet_index == bullet_index) {
        return;
      };
      $scope.current_bullet_index = bullet_index;
      $scope.adjust_bullet_index();
    }

    $scope.next_bullet_index = function() {
      $scope.current_bullet_index++;
      $scope.current_bullet_index = Math.min($scope.current_bullet_index, $scope.bullet_count - 1);
      $scope.adjust_bullet_index();
    }
    $scope.previous_bullet_index = function() {
      $scope.current_bullet_index--;
      $scope.current_bullet_index = Math.max($scope.current_bullet_index, 0);
      $scope.adjust_bullet_index();
    }


    // $scope.cal_gross_total_info = function() {
    //   var gross_revenue = 0.0;
    //   var gross_expense = 0.0;
    //   var gross_profit = 0.0;
    //   var gross_margin = 0.0;
    //   for(var i = 0; i < $scope.resources.length; i++) {
    //     gross_revenue += parseFloat($scope.cal_total_resource(i));
    //     gross_expense += parseFloat($scope.cal_expense_resource(i));
    //     gross_profit += parseFloat($scope.cal_profit_resource(i));
    //   }
    //   if (gross_revenue > 0) {
    //     gross_margin = gross_profit / gross_revenue * 100;
    //   };
    //   $scope.gross_total_info = {
    //     gross_revenue: gross_revenue.formatMoney(1),
    //     gross_expense: gross_expense.formatMoney(1),
    //     gross_profit: gross_profit.formatMoney(1),
    //     gross_margin: gross_margin.formatMoney(1),
    //   };
    // }

    $scope.cal_gross_total = function() {
      var gross_revenue = 0.0;
      for(var i = 0; i < $scope.resources.length; i++) {
        // gross_revenue += parseFloat($scope.cal_total_resource(i));
        gross_revenue += $scope.cal_total_resource(i).formatNumber();
      }
      return gross_revenue.formatMoney(1);
    }

    $scope.cal_gross_expense = function() {
      var gross_expense = 0.0;
      for(var i = 0; i < $scope.resources.length; i++) {
        // gross_expense += parseFloat($scope.cal_expense_resource(i));
        gross_expense += $scope.cal_expense_resource(i).formatNumber();
      }
      return gross_expense.formatMoney(1);
    }

    $scope.cal_gross_profit = function() {
      var gross_profit = 0.0;
      for(var i = 0; i < $scope.resources.length; i++) {
        // gross_profit += parseFloat($scope.cal_profit_resource(i));
        gross_profit += $scope.cal_profit_resource(i).formatNumber();
      }
      return gross_profit.formatMoney(1);
    }

    $scope.cal_gross_margin = function() {
      var gross_margin = 0.0;
      // var gross_revenue = $scope.cal_gross_total();
      var gross_revenue = $scope.cal_gross_total().formatNumber();
      // var gross_profit = $scope.cal_gross_profit();
      var gross_profit = $scope.cal_gross_profit().formatNumber();
      if (gross_revenue > 0) {
        gross_margin = gross_profit / gross_revenue * 100;
      };
      return gross_margin.formatMoney(1);
    }

    $scope.cal_total_resource = function(resource_index) {
      var resource = $scope.resources[resource_index]
      var total = resource.client_rate.formatNumber() * $scope.resource_total_hours[resource_index];
      return total.formatMoney(1);
    }

    $scope.cal_expense_resource = function(resource_index) {
      var resource = $scope.resources[resource_index]
      var expense = resource.resource_rate.formatNumber() * $scope.resource_total_hours[resource_index];
      return expense.formatMoney(1);
    }

    $scope.cal_profit_resource = function(resource_index) {
      var resource = $scope.resources[resource_index]
      var profit = (resource.client_rate.formatNumber() - resource.resource_rate.formatNumber()) * $scope.resource_total_hours[resource_index];
      return profit.formatMoney(1);
    }


    $scope.cal_margin_resource = function(resource_index) {
      var resource = $scope.resources[resource_index]
      var total = $scope.resource_total_hours[resource_index] * resource.client_rate.formatNumber();
      var profit = (resource.client_rate.formatNumber() - resource.resource_rate.formatNumber()) * $scope.resource_total_hours[resource_index];
      var margin = 0.0;
      if (total > 0) {
        margin = profit / total * 100;
      };
      return margin.formatMoney(1);
      
    }

    $scope.add_resource = function() {
      var resource = {
        resource: {
          role: '',
          client_rate: 0.00,
          name: '',
          resource_rate: 0.00,
          is_estimated: true
        }
      }

      var req = {
        method: 'POST',
        url: '/v1/projects/' + $scope.routeParams.project_id + '/resources',
        headers: {
          "Authorization": $localStorage.logged_user.access_token
        },
        data: resource
      }
      // $scope.resources.push(resource);
      $http(req).then(function(data) {
        console.log(data);
        // $location.path('/projects/' + )
        $scope.project.id = data.data.project.id;
        $scope.project.name = data.data.project.name;
        $scope.project.project_type = data.data.project.project_type;

        $scope.resources = data.data.project.estimated_resources;
        $scope.timelines = data.data.project.estimated_timelines;
        $scope.resource_timelines = data.data.project.estimated_resource_timelines;
        $scope.after_load_project();
      }, function(data) {
        console.log(data);
      });
    }

    $scope.remove_resource = function(resource_index) {
      var resource = $scope.resources[resource_index]
      var req = {
        method: 'DELETE',
        url: '/v1/projects/' + $scope.routeParams.project_id + '/resources/' + resource.id,
        headers: {
          "Authorization": $localStorage.logged_user.access_token
        },
        data: resource
      }
      // $scope.resources.push(resource);
      $http(req).then(function(data) {
        console.log(data);
        $scope.project.id = data.data.project.id;
        $scope.project.name = data.data.project.name;
        $scope.project.project_type = data.data.project.project_type;

        $scope.resources = data.data.project.estimated_resources;
        $scope.timelines = data.data.project.estimated_timelines;
        $scope.resource_timelines = data.data.project.estimated_resource_timelines;
        $scope.after_load_project();
      }, function(data) {
        console.log(data);
      });
    }

    $scope.update_resource = function(resource_index) {
      if (!$scope.is_resource_changed) {
        return;
      };
      var resource = $scope.resources[resource_index]
      var req = {
        method: 'PATCH',
        url: '/v1/projects/' + $scope.routeParams.project_id + '/resources/' + resource.id,
        headers: {
          "Authorization": $localStorage.logged_user.access_token
        },
        data: {
          resource: resource
        }
      }
      // $scope.resources.push(resource);
      $http(req).then(function(data) {
        console.log(data);
        // resource = data.data.resource
        resource.client_rate = data.data.resource.client_rate;
        resource.name = data.data.resource.name;
        resource.resource_rate = data.data.resource.resource_rate;
        resource.role = data.data.resource.role;
        $scope.is_resource_changed = false;
      }, function(data) {
        console.log(data);
      });
    }

    $scope.add_timeline = function() {
      var timeline = {
        project_id: $scope.routeParams.project_id,
        is_estimated: true
      }
      var req = {
        method: 'POST',
        url: '/v1/projects/' + $scope.routeParams.project_id + '/timelines',
        headers: {
          "Authorization": $localStorage.logged_user.access_token
        },
        data: {
          timeline: timeline
        }
      }
      // $scope.resources.push(resource);
      $http(req).then(function(data) {
        console.log(data);
        // $location.path('/projects/' + )
        $scope.project.id = data.data.project.id;
        $scope.project.name = data.data.project.name;
        $scope.project.project_type = data.data.project.project_type;

        $scope.resources = data.data.project.estimated_resources;
        $scope.timelines = data.data.project.estimated_timelines;
        $scope.resource_timelines = data.data.project.estimated_resource_timelines;
        $scope.after_load_project();
      }, function(data) {
        console.log(data);
      });
    }

    $scope.remove_timeline = function(timeline_index) {
      var timeline = $scope.timelines[timeline_index]
      var req = {
        method: 'DELETE',
        url: '/v1/projects/' + $scope.routeParams.project_id + '/timelines/' + timeline.id,
        headers: {
          "Authorization": $localStorage.logged_user.access_token
        },
        data: timeline
      }
      // $scope.timelines.push(timeline);
      $http(req).then(function(data) {
        console.log(data);
        $scope.project.id = data.data.project.id;
        $scope.project.name = data.data.project.name;
        $scope.project.project_type = data.data.project.project_type;

        $scope.resources = data.data.project.estimated_resources;
        $scope.timelines = data.data.project.estimated_timelines;
        $scope.resource_timelines = data.data.project.estimated_resource_timelines;
        $scope.after_load_project();
      }, function(data) {
        console.log(data);
      });
    }

    $scope.resource_timeline_change = function() {
      $scope.is_resource_timeline_changed = true;
    }

    $scope.update_resource_timeline = function(resource_index, timeline_index) {
      if (!$scope.is_resource_timeline_changed) {
        return;
      };
      var resource_timeline = $scope.resource_timelines[resource_index][timeline_index]
      var req = {
        method: 'PATCH',
        url: '/v1/resource_timelines/' + resource_timeline.id,
        headers: {
          "Authorization": $localStorage.logged_user.access_token
        },
        data: {
          resource_timeline: resource_timeline
        }
      }
      // $scope.resources.push(resource);
      $http(req).then(function(data) {
        console.log(data);
        resource_timeline.hours = data.data.resource_timeline.hours
        $scope.cal_total_resource_hours();
        $scope.is_resource_timeline_changed = false;
      }, function(data) {
        console.log(data);
      });
    }

    $scope.sign_out = function() {
      Auth.signOut();
    }

  }]);