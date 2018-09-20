class Formulario extends Screen{

  startEvents(){
    super.startEvents();

    let form = this;
    $('.e-submit').on('click',function(){
      form.submit();
    });

    $('#dtBox').DateTimePicker({
// "date", "time", or "datetime"
mode: "date",

//dateSeparator: "/",
dateFormat: "dd-MM-yyyy",

shortDayNames: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
fullDayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
shortMonthNames: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
fullMonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],

titleContentDate: "Fecha de nacimiento",

buttonsToDisplay: ["HeaderCloseButton", "SetButton", "ClearButton"],
setButtonContent: "ACEPTAR",
clearButtonContent: "CANCELAR",
   });
    autosize($('textarea'));
  }

  submit(){
    let dsp = $('#fechaNac').val().split("-");
    let edad = (new Date().getTime() - new Date(dsp[2],dsp[1],dsp[0]).getTime())/(1000*60*60*24*365);
    let sub = 0;
    if ($("input[type=checkbox]:checked").length == 1){ sub = 1;}

    let data = {
      "email":$('#email').val(),
      "nombre":$('#nombre').val(),
      "edad":Math.floor(edad),
      "suscripcion":sub,
    };

    let errors = "<p><strong>Revise los campos:</strong></p>";
    let onE = false;
    if(data["email"] == ""){errors += "<p>Email</p>"; onE=true;}
    if(data["nombre"] == ""){errors += "<p>Nombre y apellido </p>"; onE=true;}
    if($('#fechaNac').val() == ""){errors += "<p>Fecha de nacimiento </p>"; onE=true;}

    if(onE){
      this.site.showError(errors);
      return false;
    }

    let form = this;
    $(LOADING_CONTANIER).show();
    $.post(this.submitUrl,JSON.stringify(data))
    .done(function(d){
      form.site.setCustomer(d["customer"]);
      $(LOADING_CONTANIER).hide();
      form.site.goTo(form.onSubmit);
    })
    .fail(function(){
      $(LOADING_CONTANIER).hide();
      form.site.showError(ERROR_CONECT);
    });

  }
}
