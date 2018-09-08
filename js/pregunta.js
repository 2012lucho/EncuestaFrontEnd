const SIN_RESPUESTA = -1;

class Pregunta extends Screen{

  constructor(d,s,c){
    super(d,s);
    this.cuestionario=c;
    this.respuesta;
    this.options = d['params'];
    this.id;
  }

  startEvents(){
    super.startEvents();

    let preg = this;
    $('.e-confirm').on('click',function(e){
      preg.respuesta = preg.getRespuesta();
      if (preg.respuesta != SIN_RESPUESTA){
        preg.cuestionario.confirmRta(preg);
      }
    });

    $('.e-next').on('click',function(){
      preg.cuestionario.siguientePregunta();
    });

    $('.e-nr').on('click',function(){
      $(LOADING_CONTANIER).show();
      let e = {
        "customer":preg.site.customer,
        "cuestionario":preg.cuestionario.preguntas[preg.cuestionario.preguntaActual].options["cuestionario"],
        "pregunta":preg.cuestionario.preguntas[preg.cuestionario.preguntaActual].options["id"],
        "respuesta":"1"
      };
      $.post(URL_ANSWER,JSON.stringify(e))
        .done(function(d){
          $(LOADING_CONTANIER).hide();
          preg.cuestionario.siguientePregunta();
        })
        .fail(function(){
          $(LOADING_CONTANIER).hide();
          preg.site.showError(ERROR_CONECT);
        });
    });

    $('.e-back').on('click',function(){
      preg.cuestionario.anteriorPregunta();
    });

    $('.e-n-confirm').on('click',function(){
      preg.cuestionario.notConfirmPregunta();
    });

    autosize($('textarea'));
  }

  getRespuesta(){
    return SIN_RESPUESTA;
  }

  getRespuestaText(){
    return this.respuesta;
  }

  completarHtml(){
    if(this.options !== undefined){
      $('#p-title').html(this.options['pregunta']);
    }

    $("#c-title").html(this.cuestionario.title);
  }
}

class PreguntaEscrita extends Pregunta{
  completarHtml(){
    super.completarHtml();
  }

  startEvents(){
    super.startEvents();
  }

  getRespuesta(){
      return $('#respuesta').val();
  }
}

class PreguntaUnica extends Pregunta{
  startEvents(){
    super.startEvents();

    let preg = this;
    $('.list-group-item').on('click',function(){
      $('.list-group-item').removeClass('selected');
      $(this).addClass('selected');
    });
  }

  completarHtml(){
    super.completarHtml();
    let h = $(".cuestionario").html();
    for (let k in this.options['opciones']) {
      h += '<li class="list-group-item" id="op-'+k+'">' + this.options['opciones'][k] + '</li>';
    }
    $(".cuestionario").html(h);
  }

  getRespuesta(){
    let s = $('.selected');
    if (s[0] === undefined){ return SIN_RESPUESTA; }
    return s[0].innerText;
  }
}

class PreguntaNumeros extends Pregunta{
  completarHtml(){
    super.completarHtml();
  }

  startEvents(){
    super.startEvents();

    $("#respuesta").on("keypress",function(e){
      switch (e.key){case"0": case"1": case"3": case"4": case"5": case"6": case"7": case"8": case"9": break; default:e.preventDefault();}
      let key = e.which || e.keyCode; if (key < 48 || key > 57) {e.preventDefault(); }
    });

    $("#respuesta").on("keydown",function(e){
      let key = e.which || e.keyCode; if (key < 48 || key > 57) {e.preventDefault(); }
    });
  }

  getRespuesta(){
    return $('#respuesta').val().replace(/[^\d]/g, '');
  }
}

class PreguntaMultiple extends Pregunta{
  startEvents(){
    super.startEvents();

    $('.list-group-item').on('click',function(){
      $('#ck-'+$(this).attr('data-id')).click();
    });

    $('.checkbox-1').on('click',function(){
      $('#ck-'+$(this).attr('data-id')).click();
    });
  }

  completarHtml(){
    super.completarHtml();
    let o = this.options['opciones'];
    for (let k in o){
      $('.cuestionario-checkbox').append(
        '<li class="list-group-item" data-id="'+k+'">'+
        '<div class="checkbox-1 form-check" data-id="'+k+'">'+
        '<input type="checkbox" id="ck-'+k+'" data-id="'+k+'" class="form-check-input" />'+
        '<label for="ck-'+k+'"></label>'+
        '</div><span id="tx-'+k+'">'+o[k]+'</span></div></li>');
    }
  }

  getRespuesta(){
    let s = $("input[type=checkbox]:checked");
    let r = [];
    if (s[0] === undefined){ return SIN_RESPUESTA; }

    $("input[type=checkbox]:checked").each(function(){
      r.push($('#tx-'+$(this).attr('data-id')).text());
    });

    return r;
  }

  getRespuestaText(){
    let t = "";
    for (let k in this.respuesta){
      t += this.respuesta[k]+'<br>';
    }
    return t;
  }
}

class CuestionarioConfirm extends Pregunta{
  completarHtml(){
    super.completarHtml();
    let r = this.getRespuestaText();
    r = r.replace(/\n/g, "<br>");
    $("#c-respuesta").html(r);
  }

  startEvents(){
    super.startEvents();
    let preg = this;

    $('.e-enviar').on('click',function(){
      $(LOADING_CONTANIER).show();
      let e = {
        "customer":preg.site.customer,
        "cuestionario":preg.cuestionario.preguntas[preg.cuestionario.preguntaActual].options["cuestionario"],
        "pregunta":preg.cuestionario.preguntas[preg.cuestionario.preguntaActual].options["id"],
        "respuesta":preg.cuestionario.preguntas[preg.cuestionario.preguntaActual].respuesta
      };
      $.post(URL_ANSWER,JSON.stringify(e))
        .done(function(d){
          $(LOADING_CONTANIER).hide();
          let data = JSON.parse(d);

          preg.cuestionario.siguientePregunta();
        })
        .fail(function(){
          $(LOADING_CONTANIER).hide();
          preg.site.showError(ERROR_CONECT);
        });

    });
  }

  getRespuestaText(){
    return this.cuestionario.preguntas[this.cuestionario.preguntaActual].getRespuestaText();
  }
}
