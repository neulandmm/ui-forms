describe('uib-form-group', function() {
  var element, scope, $compile;

  beforeEach(module('ui.forms'));

  beforeEach(inject(function($rootScope, _$compile_) {
    scope = $rootScope;
    $compile = _$compile_;

    element = angular.element([
      '<uib-form-group>',
      '<label>Test</label>',
      '<input type="text" ng-model="test" name="test"/>',
      '</uib-form-group>'
    ].join(' '));

    scope.test = 'test';

  }));

  function createFormGroup() {
    $compile(element)(scope);
    scope.$digest();
    return element;
  }

  it('should expose the controller to the view', function () {
    element = $compile('<uib-form-group></uib-form-group>')(scope);
    scope.$digest();

    var ctrl = element.controller('uib-form-group');
    expect(ctrl).toBeDefined();
  });

  it('should have the form-group class', function () {
    var formGroup = createFormGroup();
    expect(formGroup.eq(0)).toHaveClass('form-group');
  });

});
