module('Backbone: Validate Model', {
  setup: function() {
    ClientSideValidations.models['user'] = {
      validators: {'name':{"presence":{"message": "must be present"}}}
    }
    UserModel = Backbone.Model.extend({ url: '/users' });
    ClientSideValidations.decorateModel(UserModel, 'user');
    
    userModel = new UserModel();
  }
});

asyncTest('Validate model with invalid data', 2, function() {
  var errors;
  userModel.bind('error', function(model, error) {
    errors = {
      model: model,
      error: error
    }
  });
  
  setTimeout(function() {
    start();
    ok(!userModel.set({ name: '' }))
    ok(errors.error.name);
  }, 30);
});

asyncTest('Validate model with valid data', 1, function() {
  setTimeout(function() {
    start();
    ok(userModel.set({ name: 'my name' }))
  }, 30);
});
