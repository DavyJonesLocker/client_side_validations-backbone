module('Backbone: Validate View', {
  setup: function() {
    ClientSideValidations.models['user'] = {
      type: 'ActionView::Helpers::FormBuilder',
      input_tag: '<div class="field_with_errors"><span id="input_tag" /><label for="user_name" class="message"></label></div>',
      label_tag: '<div class="field_with_errors"><label id="label_tag" /></div>',
      validators: {'name':{"presence":{"message": "must be present"}}}
    }
    UserModel = Backbone.Model.extend({ url: '/users.json' });
    ClientSideValidations.decorateModel(UserModel, 'user');
    
    UserView = Backbone.View.extend({ });
    ClientSideValidations.decorateView(UserView);
    
    userModel = new UserModel();

    $('#qunit-fixture')
      .append($('<form />', {
        id: 'user',
        action: 'user_form'  // Used to create an iFrame for tests; unnecessary in normal usage
      }))
      .find('form')
        .append($('<input />', {
          name: 'user[name]',
          id: 'user_name',
          'data-validate': 'true',
          type: 'text'
        }))
        .append($('<label for="user_name">Name</label>'));

    userView = new UserView({
      el: 'form',
      model: userModel
    });
    
    submitSuccess = false;
    userView.bind('success', function() {
      submitSuccess = true;
    });

  }
});

asyncTest('Validate form with invalid input', 4, function() {
  var form = $('form#user'), input = form.find('input#user_name');
  var label = $('label[for="user_name"]');

  form.trigger('submit');
  setTimeout(function() {
    start();
    ok(input.parent().hasClass('field_with_errors'));
    ok(label.parent().hasClass('field_with_errors'));
    ok(input.parent().find('label:contains("must be present")')[0]);
    ok(!submitSuccess);
  }, 30);
});

asyncTest('Validate form with valid form', 1, function() {
  var form = $('form#user'), input = form.find('input#user_name');
  input.val('Test');
  
  form.trigger('submit');
  setTimeout(function() {
    start();
    ok(submitSuccess == true);
  }, 30);
});

// Don't validate before focusout
asyncTest('Validate form when input focusout first time (failed input)', 2, function () {
  var form = $('form#user'), input = form.find('input#user_name');
  
  input.val('');
  input.trigger('change');
  setTimeout(function() {
    start();
    ok(!input.parent().hasClass('field_with_errors'));
    input.trigger('focusout')
    ok(input.parent().hasClass('field_with_errors'));
  });
});

// Validate change from good to bad on focusout
asyncTest('Validate form when good to bad on focusout', 2, function () {
  var form = $('form#user'), input = form.find('input#user_name');
  
  input.val('Test');
  input.trigger('focusout'); // First focusout
  setTimeout(function() {
    start();
    ok(!input.parent().hasClass('field_with_errors'));
    input.val('');
    input.trigger('focusout')
    ok(input.parent().hasClass('field_with_errors'));
  });
});

// Validate change from good to bad on focusout
asyncTest('Validate form when bad to good on focusout', 2, function () {
  var form = $('form#user'), input = form.find('input#user_name');
  
  input.val('');
  input.trigger('focusout'); // First focusout
  setTimeout(function() {
    start();
    ok(input.parent().hasClass('field_with_errors'));
    input.val('Test');
    input.trigger('focusout')
    ok(!input.parent().hasClass('field_with_errors'));
  });
});

// Validate change from good to bad on change after focusout
asyncTest('Validate form when good to bad on change after focusout', 2, function () {
  var form = $('form#user'), input = form.find('input#user_name');
  
  input.val('Test');
  input.trigger('focusout'); // First focusout
  setTimeout(function() {
    start();
    ok(!input.parent().hasClass('field_with_errors'));
    input.val('');
    input.trigger('change')
    ok(input.parent().hasClass('field_with_errors'));
  });
});

// Validate change from bad to good on change after focusout
asyncTest('Validate form when bad to good on change after focusout', 2, function () {
  var form = $('form#user'), input = form.find('input#user_name');
  
  input.val('');
  input.trigger('focusout'); // First focusout
  setTimeout(function() {
    start();
    ok(input.parent().hasClass('field_with_errors'));
    input.val('Test');
    input.trigger('change')
    ok(!input.parent().hasClass('field_with_errors'));
  });
});
