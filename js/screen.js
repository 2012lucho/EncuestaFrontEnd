class Screen{

  constructor(p,site) {
    this.site       = site;
    this.background = p.background;
    this.template   = p.template;
  }

  show(){
    $(LOADING_CONTANIER).show();
    let screen = this;
    $.get('templates/'+this.template)
      .done(function(d){
        $('.wrapper').html(d);
        screen.startCss();
        screen.completarHtml();
        screen.startEvents();
        screen.finishload();
      })
      .fail(function(d){
        $(LOADING_CONTANIER).hide();
        screen.showAlert(ERROR_LOAD);
      });
  }

  finishload(){
    $(LOADING_CONTANIER).hide();
  }

  completarHtml(){
  }

  startEvents(){
    let screen = this;
    $('.e-nav').each(function(){
      $(this).on('click',function(e){
        screen.site.goTo($(this).attr('data-e-nav'));
      });
    });

  }

  showAlert(msg){
    this.site.showError(ERROR_CONECT);
  }

  startCss(){
    $('body').css('background',this.background);
  }
}
