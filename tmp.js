
jQuery(document).on('pageshow',function(){

	var f = new Date();
	var d = f.getDate();
    var m = f.getMonth() + 1;
    var y = f.getFullYear();

    var selectMateria = document.getElementById('materia');
    
	$('#fecha_inicio').val(y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d));
	$(document).on('change','#carrera',function(){ 
		if(materias.length == 0)
		{
			$('#materia').html('');
			var opt = document.createElement('option');
			opt.value = 0;
			opt.innerHTML = "Cargando...";
			selectMateria.appendChild(opt);
			cargarMaterias();
		}
		else
			procesarCargaMaterias();
	});
	
	$(document).on('change','#nivel',function(){ 
		procesarCargaMaterias();
	});
	

	//cargarMaterias();
	
	var carreraElegida = localStorage.getItem("carrera");
    var nivelElegido = localStorage.getItem("nivel");
	
	if(carreraElegida != null && nivelElegido != null)
	{
		if(carreraElegida.length > 0 && nivelElegido.length > 0)
		{
			$('#carrera').val(carreraElegida);
			$('#nivel').val(nivelElegido);

			if(materias.length == 0)
			{
				$('#materia').html('');
				var opt = document.createElement('option');
				opt.value = 0;
				opt.innerHTML = "Cargando...";
				selectMateria.appendChild(opt);
				cargarMaterias();
			}
		}
	}
});

function cargarUltimaNoticia(noticia_vista)
{
	var xmlhttp;

	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange=function()
	{		
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			noticia = xmlhttp.responseText;
			noticia = JSON.parse(noticia);

			if(noticia_vista == null || Number(noticia_vista) < Number(noticia.id_notificacion))
			{
				//Cargo el contenido de la noticia
				$('#contenido').html(noticia.noticia);
				//Muestro la noticia
				$('.publicidad').show();
				//Guardo el ultimo id de noticia visto
				localStorage.setItem("noticia", noticia.id);
			}
			
		}
	}
	xmlhttp.open("GET","http://www.frsf.utn.edu.ar/getNoticiaCC.php",true);
	xmlhttp.send();
}

//Arreglo para guardar las materias que devuelve el webservice
var materias = '';
function cargarMaterias()
{	
	var xmlhttp;
	var selectComisiones = $('#comisiones-clon');
	
	if(materias.length == 0)
	{
		if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
		else
		{// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				materias = xmlhttp.responseText;
				materias = JSON.parse(materias);
				var comisiones = [];
				for(var index in materias)
				{
					var materia = materias[index];
					var comisionesMateria = materia.comisiones;
						
					for(var indexComision in comisionesMateria)
					{
						var comision = comisionesMateria[indexComision];

						if(comisiones[comision.id] == undefined)
						{
							comisiones[comision.id] = [];
							comisiones[comision.id]['nombre'] = comision.nombre;
							comisiones[comision.id]['materias'] = materia.id;
						}
						else
						{
							comisiones[comision.id]['materias'] = comisiones[comision.id]['materias'] + " " +materia.id;
						}
					}
				}
				procesarCargaMaterias();
			}

			for(var indexComision in comisiones)
			{
				var comision = comisiones[indexComision];
				var opt = document.createElement('option');
				opt.value = indexComision;
				opt.innerHTML = comision["nombre"];
				opt.setAttribute("data-materia",comision["materias"]);
				
				selectComisiones.append(opt);	
			}
		}
		xmlhttp.open("GET","http://www.frsf.utn.edu.ar/getMaterias.php",true);
		xmlhttp.send();
	}
}

function procesarCargaMaterias()
{	
	$('#materia').html('');		
	var selectMateria = document.getElementById('materia');
	
	if(document.getElementById('carrera') != undefined)
		var carrera = document.getElementById('carrera').value;
	else
		var carrera = 0;
		
	if(document.getElementById('nivel') != undefined)
		var nivel = document.getElementById('nivel').value;
	else
		var nivel = 0;
		
	var opt = document.createElement('option');
	opt.value = 0;
	opt.innerHTML = "Seleccione una materia";
	if(selectMateria != undefined)
	{
		selectMateria.appendChild(opt);

		for(var index in materias)
		{
			var materia = materias[index];
			
			var opt = document.createElement('option');
			opt.value = materia.id;
			opt.innerHTML = (materia.nombre).substring(0,45);
			opt.setAttribute("data-carrera",materia.id_carrera);
			opt.setAttribute("data-nivel",materia.nivel);
			if(document.getElementById('nivel') != null)
				var auxNivel = document.getElementById('nivel').value;
			else
				var auxNivel = 0;
			var pasa = true;
			if(auxNivel != 0 && auxNivel != materia.nivel)
			{
				opt.setAttribute("style","display:none;");
				pasa = false;
			}	
			if(document.getElementById('carrera') != null)
				var auxCarrera = document.getElementById('carrera').value;
			else
				var auxCarrera = 0;
			if(auxCarrera != 0 && auxCarrera != materia.id_carrera)
			{
				pasa = false;
				opt.setAttribute("style","display:none;");
			}	

			if(pasa)
				selectMateria.appendChild(opt);
		}
	}

	$('#comisiones').find('option').remove();
	$('#comisiones').css('display','none');

}

function changeMateria()
{
	var materia = $('#materia').find('option:selected');
	var clonComisiones = $('#comisiones-clon');
				
	//Limpio las comisiones cargadas
	$('#comisiones').find('option').remove();

	if(materia.val() > 0)
	{	
		clonComisiones.clone().find('option[value=0]').appendTo('#comisiones');
		clonComisiones.clone().find('option[data-materia~=\"'+materia.val()+'\"]').appendTo('#comisiones');
	}

	$('#comisiones').css('display','');
}

function nuevaConsulta()
{
	$('#boton_buscar').show();
	$('#buscando').hide();
	$('#formulario').show();
	$('#nueva_consulta').hide();
	$('#resultados').hide();
}

function buscarDistribucion()
{
	var xmlhttp;
	var distribucion = [];

	if($('#carrera').val() != 0)
	{
		if($('#nivel').val() != 0 )
		{
			if($('#fecha_inicio').val() != '')
			{
				$('#boton_buscar').hide();
				$('#buscando').show();

				if (window.XMLHttpRequest)
				{// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp=new XMLHttpRequest();
				}
				else
				{// code for IE6, IE5
					xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
				
				xmlhttp.onreadystatechange=function()
				{
					if (xmlhttp.readyState==4 && xmlhttp.status==200)
					{
						distribucion = xmlhttp.responseText;
						$('#formulario').hide();
						$('#nueva_consulta').show();
						$('#resultados').html(distribucion);
						$('#resultados').show();
						$('#boton_buscar').show();
						$('#buscando').hide();
					}
				}
				var params = "fecha_inicio="+$('#fecha_inicio').val()+"&carrera="+$('#carrera').val()+"&nivel="+$('#nivel').val()+"&materia="+$('#materia').val()+"&comisiones="+$('#comisiones').val();
				
				xmlhttp.open("POST","http://www.frsf.utn.edu.ar/getDistribucion.php",true);
				xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				xmlhttp.send(params);
				
				 localStorage.setItem("carrera", $('#carrera').val());
				 localStorage.setItem("nivel", $('#nivel').val());
 
			}
			else
		       alert('Debe seleccionar  una fecha válida');
		
		}
		else
			alert('Debe seleccionar  un nivel');
		
	}
	else
	  alert('Debe seleccionar una carrera');
	
}

