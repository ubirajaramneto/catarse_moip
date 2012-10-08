CATARSE.MoipForm = Backbone.View.extend({
  el: 'form.moip',

  getMoipToken: function(onSuccess){
    var that = this;
    $.post('/payment/moip/' + this.backerId + '/get_moip_token').success(function(response, textStatus){
      console.log(response.widget_tag);
      $('#catarse_moip_form').prepend(response.widget_tag);
      if(_.isFunction(onSuccess)){
        onSuccess(response);
      }
    });
  },

  checkoutFailure: function(data) {
    var response_data = (data.length > 0 ? data[0] : data);
    this.message.find('p').html(response_data.Mensagem);
    this.message.fadeIn('fast');
    this.loader.hide();
  },

  updateMoipResponse: function(data){
    return $.post('/payment/moip/' + this.backerId + '/moip_response', {response: data});
  },

  checkoutSuccessful: function(data) {
    this.loader.hide();
    $.post('/payment/moip/' + this.backerId + '/moip_response', {response: data}).success(function(){
      if(data.url) {
        var link = $('<a target="__blank">'+data.url+'</a>')
        link.attr('href', data.url);
        $('.link_content').empty().html(link);
        $('.subtitle').fadeIn('fast');
      }

      if($('#payment_type_cards_section').css('display') == 'block') {
        location.href = '/thank_you';
      }
    });
  },

  initialize: function(){
    this.message = this.$('.next_step_after_valid_document .alert-danger');
    this.backerId = $('input#backer_id').val();
    this.projectId = $('input#project_id').val();

    this.loader = this.$('.loader');

    this.paymentChoice = new CATARSE.PaymentChoice();
    this.paymentCard = new CATARSE.PaymentCard({moipForm: this});
    this.paymentSlip = new CATARSE.PaymentSlip({moipForm: this});
    this.paymentAccount = new CATARSE.PaymentAccount({moipForm: this});
    window.checkoutSuccessful = _.bind(this.checkoutSuccessful, this);
    window.checkoutFailure = _.bind(this.checkoutFailure, this);
    console.log('ok');
  }
});

