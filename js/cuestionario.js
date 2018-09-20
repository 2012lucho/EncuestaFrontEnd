class Cuestionario extends Screen{
  constructor(p){
    super(p);

    this.preguntas = [];
    this.name   = p['name'];
    this.title  = "";
    this.site   = p['site'];
    this.finish = p['finishScreen'];
    this.init   = 'cuestionario1Init';
    this.urlPreguntas = p['urlPreguntas'];

    this.confirmRtaScreen;
    this.confirmScreenObj;

    this.cant = 0;
    this.preguntaActual = 0;
  }

  getScreens(){
    let s = [];
    s[this.confirmRtaScreen] = this.confirmScreenObj;
    for (let k in this.preguntas){
      s[this.name+k] = this.preguntas[k];
    }
    return s;
  }

  resetScreens(){
    for (let k in this.preguntas){
      delete this.site.screens[this.name+k];
    }
    this.preguntas = [];
    this.cant = 0;
    this.preguntaActual = 0;
  }

  finishload(){}

  startEvents(){
    super.startEvents();

    let screen = this;
    $('.c-start').on('click',function(e){
      if(screen.cant == 0){
        screen.site.goTo(screen.finish);
        return false;
      }
      screen.site.goTo(screen.name+screen.preguntaActual);
    });

    this.resetScreens();

    $.post(this.urlPreguntas,JSON.stringify({"customer":this.site.customer}))
      .done(function(d){
        $(LOADING_CONTANIER).hide();
        let data = d;

        screen.title = data["charla"]["nombre"];
        $('#c-title').html(screen.title);
        $('#c-name').html(data["charla"]["adicional1"]);
        $('#c-hora').html(data["charla"]["adicional2"]);

        let a = data["charla"]["preguntas"];
        for (let k in a){
          switch (a[k]["tipo"]){
            case '0':
              screen.addPregunta(new PreguntaEscrita({template:'rta-escrita.html',background:'#fff', params:a[k]},screen.site,screen));
            break;
            case '1':
              screen.addPregunta(new PreguntaNumeros({template:'rta-numeros.html',background:'#fff', params:a[k]},screen.site,screen));
            break;
            case '2':
              screen.addPregunta(new PreguntaUnica({template:'rta-unica.html',background:'#fff', params:a[k]},screen.site,screen));
            break;
            case '3':
              screen.addPregunta(new PreguntaMultiple({template:'rta-multiple.html',background:'#fff', params:a[k]},screen.site,screen));
            break;
          }
        }

        let s = screen.getScreens();
        for (let k in s){
          screen.site.screens[k] = s[k];
        };

      })
      .fail(function(){
        $(LOADING_CONTANIER).hide();
        screen.site.showError(ERROR_CONECT);
      });
  }

  confirmRta(pregunta){
    this.site.goTo(this.confirmRtaScreen);
  }

  siguientePregunta(){
    if(this.preguntaActual+1 == this.cant || this.cant == 0){
      this.site.goTo(this.finish);
      return false;
    }

    this.preguntaActual++;
    this.site.goTo(this.name+this.preguntaActual);
  }

  anteriorPregunta(){
    if(this.preguntaActual-1 <0 ){
      this.site.goTo(this.init);
      return false;
    }

    this.preguntaActual--;
    this.site.goTo(this.name+this.preguntaActual);
  }

  notConfirmPregunta(){
    this.site.goTo(this.name+this.preguntaActual);
  }

  addPregunta(p){
    this.preguntas[this.cant] = p;
    this.cant ++;
  }

  addConfirmScreen(p){
    this.confirmRtaScreen = this.name+'confirmRta';
    this.confirmScreenObj = new CuestionarioConfirm(p,this.site,this);
  }

}
