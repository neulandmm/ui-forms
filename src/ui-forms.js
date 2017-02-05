angular.module('ui.forms', [])
  .provider('$uibFormControlErrors', function () {

    var uibFormControlErrorsProvider;

    var messages = {
      required: 'This is required.',
      minlength: 'Minlength is required',
//      maxlength: '...',
    };

    var errorIconTemplate = '<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>';

    return uibFormControlErrorsProvider = {
      addMessage: function (type, message) {
        messages[type] = message;
      },
      errorIconTemplate: function (template) {
        errorIconTemplate = template;
      },
      $get: function () {
        var uibFormControlErrors = function () {

        }

        uibFormControlErrors.getMessages = function (types) {
          var tmp = [];
          angular.forEach(types, function (type, key) {
            if (messages[key]) {
              tmp.push(messages[key]);
            }
          })
          return tmp;
        }

        uibFormControlErrors.getErrorIconTemplate = function () {
          return errorIconTemplate;
        }

        return uibFormControlErrors;
      }
    }
  })

  .factory('$uibUtil', function () {
    var nextUniqueId = 0;

    var $uibUtil = {
      // uid
      nextUid: function () {
        return '' + nextUniqueId++;
      }
    }

    return $uibUtil;
  })

  .directive('uibFormGroup', function ($parse, $uibFormControlErrors) {
    return {
      restrict: 'E',
      compile: function (tElement) {

        return function postLink(scope, element) {
          element.addClass('form-group');
        };
      },
      controller: function ($scope, $element, $attrs, $animate) {
        var vm = this;

        vm.isErrorGetter = $attrs.uibIsError && $parse($attrs.uibIsError);

        vm.element = $element;

        var feedbackIcon = angular.element($uibFormControlErrors.getErrorIconTemplate());

        vm.setInvalid = function (isInvalid) {
          if (isInvalid) {
            $animate.addClass($element, 'has-error');

            if ($attrs.hasOwnProperty('uibWithIcon')) {
              $element.addClass('has-feedback');
              $element.append(feedbackIcon);
            }
          } else {
            $animate.removeClass($element, 'has-error');

            if ($attrs.hasOwnProperty('uibWithIcon')) {
              $element.removeClass('has-feedback');
              feedbackIcon.remove();
            }
          }
        };

        $scope.$watch(function () {
          return vm.label && vm.input;
        }, function (hasLabelAndInput) {
          if (hasLabelAndInput && !vm.label.attr('for')) {
            vm.label.attr('for', vm.input.attr('id'));
          }
        })
      }
    }
  })

  .directive('label', function () {
    return {
      restrict: 'E',
      require: '^?uibFormGroup',
      link: function (scope, element, attr, containerCtrl) {
        if (!containerCtrl || attr.uibNoFloat || element.hasClass('uib-group-ignore'))
          return;

        containerCtrl.label = element;
        scope.$on('$destroy', function () {
          containerCtrl.label = null;
        });
      }
    };
  })

  .directive('input', inputTextareaDirective)
  .directive('select', inputTextareaDirective)
  .directive('textarea', inputTextareaDirective)

  .directive('ngMessages', function () {
    return {
      restrict: 'EA',
      // This is optional because we don't want target *all* ngMessage instances, just those inside of
      // mdInputContainer.
      require: '^^?uibFormGroup',
      link: function (scope, element, attrs, formGroup) {
        // If we are not a child of an input container, don't do anything
        if (!formGroup)
          return;

        // Add our md-auto-hide class to automatically hide/show messages when container is invalid
        element.toggleClass('uib-auto-hide', true);
      }
    };
  })

  .directive('ngMessage', function () {
    return {
      priority: 100,
      restrict: 'EA',
      compile: function (tElement) {
        tElement.toggleClass('help-block', true);
      }
    };
  })

  .directive('uibFormControlErrors', function ($uibFormControlErrors) {
    return {
      restrict: 'E',
      require: ['^?uibFormGroup', '?^form', 'uibFormControlErrors'],
      template: '<div class="help-block" ng-repeat="message in vm.messages">{{message}}</div>',
      bindToController: true,
      scope: true,
      controller: function ($scope) {
        var vm = this;

        vm.messages = []

        $scope.$watch(function () {
          return vm.error;
        }, function (errors) {
          vm.messages = $uibFormControlErrors.getMessages(errors)
        }, true);
      },
      controllerAs: 'vm',
      link: function (scope, element, attrs, ctrls) {
        // If we are not a child of an input container, don't do anything
        var formGroup = ctrls[0];
        var parentForm = ctrls[1];
        var ctrl = ctrls[2];

        if (!formGroup) {
          return;
        }

        // Add our md-auto-hide class to automatically hide/show messages when container is invalid
        element.toggleClass('uib-auto-hide', true);

        if (!formGroup.input) {
          return;
        }

        var formControlName = formGroup.input[0].name;
        ctrl.error = parentForm[formControlName].$error;
      }
    }
  })

  ;

function inputTextareaDirective($uibUtil, $parse) {
  return {
    restrict: 'E',
    require: ['^?uibFormGroup', '?ngModel', '?^form'],
    link: function (scope, element, attr, ctrls) {
      var containerCtrl = ctrls[0];
      var hasNgModel = !!ctrls[1];
      var ngModelCtrl = ctrls[1] || null;
      var parentForm = ctrls[2];
      var isReadonly = angular.isDefined(attr.readonly);
      var tagName = element[0].tagName.toLowerCase();

      if (!containerCtrl)
        return;

      containerCtrl.input = element;

      setupAttributeWatchers();

      element.addClass('form-control');
      if (!element.attr('id')) {
        element.attr('id', 'input_' + $uibUtil.nextUid());
      }

      var isErrorGetter = containerCtrl.isErrorGetter || function () {
        return ngModelCtrl.$invalid && (ngModelCtrl.$touched || (parentForm && parentForm.$submitted));
      };

      scope.$watch(isErrorGetter, containerCtrl.setInvalid);

      scope.$on('$destroy', function () {
        containerCtrl.input = null;
      })

      function setupAttributeWatchers() {
        if (containerCtrl.label) {
          attr.$observe('required', function (value) {
            containerCtrl.label.toggleClass('uib-required', value);
          });
        }
      }

    }
  }
}
