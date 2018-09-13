const LOADING_CONTANIER = '.loader-container';
const ERROR_MODAL       = '#errorModal';
const ERROR_LOAD        = 'No se pudo cargar el elemento';
const ERROR_CONECT      = 'Vuelva a intentarlo';
const TIME_SPLASH       = 2000;

const URL_ANSWER        = 'json/answer.json';

$(document).ready(function(){
  let site = new Site();
});

class Site{

  constructor(){
    this.customer = localStorage.getItem("customer");

    this.screens = [];
    this.screens['splash']       = new Screen({template:'splash.html',background:'#008000'},this);

    this.screens['registro']     = new Formulario({template:'form-registro.html',background:'#fff'},this);
    this.screens['registro'].onSubmit  = 'InitScreen';
    this.screens['registro'].submitUrl = 'json/login.json';

    this.screens['InitScreen']   = new Screen({template:'menu.html',background:'#f6e9c6'},this);
    this.screens['AcercaEvento'] = new Screen({template:'acerca-evento.html',background:'#fff'},this);
    this.screens['Gracias']      = new Screen({template:'gracias.html',background:'#fff'},this);

    this.cargarCuestionario();

    this.goTo('splash');

    let site = this;
    setTimeout(function(){
      if(site.customer==null){
        site.goTo('registro');
      } else {
        site.goTo('InitScreen');
      }

    },TIME_SPLASH);
  }

  setCustomer(c){
    this.customer = c;
    localStorage.setItem("customer",this.customer);
  }

  cargarCuestionario(){
    this.screens['cuestionario1Init'] = this.cuestionario = new Cuestionario({
      name:'cuestionario1',
      finishScreen:'Gracias',
      template:'cuestionario1.html',background:'#fff',
      site:this,
      urlPreguntas:'json/current.json'
    });

    this.cuestionario.addConfirmScreen({template:'confirmar-rta.html',background:'#fff'});
  }

  goTo(screen){
    this.screens[screen].show();
  }

  showError(e){
    $(ERROR_MODAL).modal();
    $(ERROR_MODAL +' .modal-body').html(e);

    $(".btn-lg-dismiss").on("click",function(){ $(ERROR_MODAL).modal("hide"); });
  }
}
