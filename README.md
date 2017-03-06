# AngularJS bootstrap-ui-forms

A marriage of bootstraps form-groups and angulars form validation

### examples

```html
<uib-form-group>
  <label>MyField</label>
  <input type="text" ng-model="mymodel" name="myfield" required/>
  <uib-form-control-errors></uib-form-control-errors>
</uib-form-group>
```

The lib handels styling, error handling, error messaging and attribute completion e.g. "id" on input, "for" on label.

### bootstrap

The angular module requires Bootstrap version 3.x.

#### installation with bower

```sh
$ bower install bootstrap-ui-forms
```
