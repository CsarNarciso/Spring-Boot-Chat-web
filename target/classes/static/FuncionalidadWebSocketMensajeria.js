$(document).ready(function() {


	////////////////VARIABLES////////////////////
	/////////////////////////////////////////////
	var socket = new SockJS("/chat/index");
	var stomp = Stomp.over(socket);
	
	var nombre = $("#datosUsuario").attr("data-Nombre");
	var id = $("#datosUsuario").attr("data-Id");
	var nombreImagen = $("#datosUsuario").attr("data-NombreImagen");
	
	var idDestinatarioActual;
	var nombreDestinatarioActual;
	var nombreImagenDestinatarioActual;

	var rutaImagenesPerfil = "/imagenesDePerfil/";
	var rutaImagenesGenerales = "/imagenesGenerales/";
	
	var destinoSuscripcion_ListaUsuarios = "/topic/mostrarListaUsuariosOnline";
	var destinoSuscripcion_ListaConversaciones = "/user/" + id + "/queue/conversaciones";
	var destinoSuscripcion_RecibirMensaje = "/user/" + id + "/queue/recibirMensaje";
	var destinoSuscripcion_ActualizarDatosConversacion = "/topic/actualizarDatosConversacion/";
	var destinoSuscripcion_ListaMensajes = "/user/" + id + "/queue/mensajes";
	
	var destinoEnvio_Mensaje = "/enviarMensaje";
	var destinoEnvio_ActualizarListaUsuarios = "/actualizarListaUsuariosOnline";
	var destinoEnvio_ObtenerListaConversaciones = "/obtenerListaConversaciones";
	var destinoEnvio_CrearConversacion = "/crearConversacion";
	var destinoEnvio_EliminarConversacion = "/eliminarConversacion";
	var destinoEnvio_ActualizarDatosUsuario = "/actualizarDatosUsuario"
	var destinoEnvio_ActualizarMensajesNuevos = "/actualizarMensajesNuevos";
	var destinoEnvio_ObtenerListaMensajes = "/obtenerListaMensajes";



	//////////////////////MOSTRAR NOMBRE E IMAGEN DEL USUARIO EN LA INTERFAZ////////////////
	///////////////////////////////////////////////////////////////////////////////////////
	$("#nombreUsuario").text(nombre);
	$("#imagenUsuario").attr("src", rutaImagenesPerfil + nombreImagen);




	stomp.connect({}, function() {
		
		
		
		/////////SUSCRIPCION MOSTRAR LISTA DE USUARIOS ONLINE//////////
		/////////////////////////////////////////////////////////////////
		stomp.subscribe(destinoSuscripcion_ListaUsuarios, function(message){

			var listaUsuarios = JSON.parse(message.body);
			
			$("#listaUsuarios").empty();
			
			listaUsuarios.forEach(function(u){
				
				agregarUsuario(u.id, u.nombre, u.nombreImagen)
				
			});

		});
		
		
		
		/////////SUSCRIPCION MOSTRAR LISTA DE CONVERSACIONES//////////
		/////////////////////////////////////////////////////////////////
		stomp.subscribe(destinoSuscripcion_ListaConversaciones, function(message){
			
			var listaConversaciones = JSON.parse(message.body);
			
			$("#listaConversaciones").empty();
			
			listaConversaciones.forEach(function(c){
				
				agregarConversacion(c.id_remitente, c.id_destinatario, c.nombre, c.nombreImagen, c.mensajesNuevos)

			});
			
		});
		
		
		/////////SUSCRIPCION MOSTRAR LISTA DE CONVERSACIONES//////////
		/////////////////////////////////////////////////////////////////
		stomp.subscribe(destinoSuscripcion_ListaMensajes, function(message){
			
			var listaMensajes = JSON.parse(message.body);

			$("#bandejaConversacion").empty();
			
			listaMensajes.forEach(function(m){
				
				agregarMensajeBandejaConversacion(m);
			})
			
		});
		

		/////////SUSCRIPCION PARA PROCESAMIENTO DE MENSAJES//////////
		/////////////////////////////////////////////////////////////////
		stomp.subscribe(destinoSuscripcion_RecibirMensaje, function(message){
			
			var envio = JSON.parse(message.body);
			
			var datosRemitente = envio.datosRemitente;
			var mensaje = envio.mensaje;
			
			var idRemitente = mensaje.id_remitente;
			
			var nombreRemitente = datosRemitente.nombre;
			var nombreImagenRemitente = datosRemitente.nombreImagen;
			
			
			if ( $("#conversacion_" + idRemitente).length === 0) {
				
				agregarConversacionAndGuardarBBDD(id, idRemitente, nombreRemitente, nombreImagenRemitente, 1);
			}
			else{
				
				if ( $("#formEnviar").is(":visible") ){
					
					if ( idDestinatarioActual === idRemitente ){
						
						agregarMensajeBandejaConversacion(mensaje.contenido);
					}
				}
				else{
					
					actualizarMensajesNuevos(idRemitente, "+");
				}
			}
			
			
		});
		
		
		
		
		
		
		//////////ENVIO OBTENER Y ACTUALIZAR GLOBALMENTE USUARIOS ONLINE///////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////
		stomp.send(destinoEnvio_ActualizarListaUsuarios, {}, {
			"accion" : "agregar", 
			"id" : id, 
			"nombre" : nombre,
			"nombreImagen" : nombreImagen
		});
		
		
		//////////ENVIO OBTENER LISTA CONVERSACIONES///////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////
		stomp.send(destinoEnvio_ObtenerListaConversaciones, {}, id);
	
		

		
	});
	
	
	

	///////////ENVIO ACTUALIZAR NOMBRE PERFIL/////////
	//////////////////////////////////////////////////
	$("#formEditarNombre").submit(function(event) {
		
		var nuevoNombre = $("#campoNuevoNombre").val();
		
		stomp.send(destinoEnvio_ActualizarDatosUsuario, {
			"actualizar" : "nombre", 
			"id" : id, 
			"nuevoNombre" : nuevoNombre, 
			"nombreImagen" : nombreImagen
		});
		
	});
	
	
	
	///////////ENVIO ACTUALIZAR IMAGEN PERFIL/////////
	//////////////////////////////////////////////////
	$("#formEditarImagen").submit(function(event){
		
		var metadatosNuevaImagen = $("#campoNuevaImagen").val();
		
		stomp.send(destinoEnvio_ActualizarDatosUsuario, {
			"actualizar" : "imagen", 
			"id" : id, 
			"nuevaImagen" : metadatosNuevaImagen,
			"nombre" : nombre
		});
		
	});


	
	//////////////ENVIO DE MENSAJE///////////////////
	////////////////////////////////////////////////
	$("#formEnviar").submit(function(event) {
		
		event.preventDefault(); 

		if( $("#formEnviar").attr("data-CrearConversacion") === "Si" ){
			
			agregarConversacionAndGuardarBBDD(id, idDestinatarioActual, nombreDestinatarioActual, nombreImagenDestinatarioActual, 0);
		}
		
		

		var datosRemitente = {
			"nombre" : nombre,
			"nombreImagen" : nombreImagen
		}
		
		var mensaje = {
			"id_remitente" : id,
			"id_destinatario" : idDestinatarioActual,
			"contenido" : $("#campoMensaje").val(),
			"fecha" : new Date().toISOString
		}
		
		var envio = {
			"datosRemitente" : datosRemitente,
			"mensaje" : mensaje
		}
		
		
		agregarMensajeBandejaConversacion(mensaje);

		stomp.send(destinoEnvio_Mensaje, {}, envio);
						
	});
	
	
	
	
	
	
	/////////////CAPTURA DE EVENTO DE DESCONEXION/////////////
 	$(window).on('unload', function() {
		 
		//ACTUALIZAR LISTA USUARIOS ONLINE
        stomp.send(destinoEnvio_ActualizarListaUsuarios, {}, {
			"accion" : "quitar",
			"id" : id, 
        });
        
        stomp.disconnect(function() {});
        
    });
	
	
	
	
	////////////////////////////////////FUNCIONES////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	
	function agregarUsuario(idP, nombreP, nombreImagenP){
		
		if( idP !== id ) {
					
			$("#listaUsuarios").append(
				
				"<li id='usuario_" + idP + "'>" + 
					"<span id='elemento_nombre'>" + nombreP + "</span>" +
					"<img id='elemento_imagen' src='" + (rutaImagenesPerfil + nombreImagenP) + "'></img>" +
				"</li>"
				
			);
			
			$("#usuario_" + idP).attr("data-Id", idP);
			$("#usuario_" + idP).attr("data-Nombre", nombreP);
			$("#usuario_" + idP).attr("data-NombreImagen", nombreImagenP);
			

			$("#usuario_" + idP).click(function(){
				
				$("#nombreConversacion").text( $(this).attr("data-Nombre") );
				
				$("#nombreConversacion").toggle();
				$("#formEnviar").toggle();
				
				idDestinatarioActual = $(this).attr("data-Id");
				nombreDestinatarioActual = $(this).attr("data-Nombre");
				nombreImagenDestinatarioActual = $(this).attr("data-NombreImagen");
				
				
				if( $("#conversacion_" + idP).length ){
					
					$("#formEnviar").attr("data-CrearConversacion", "No");
					
					stomp.send(destinoEnvio_ObtenerListaMensajes, {}, {"idRemitente" : id, "idDestinatario" : idP});
				}
				else{
					
					$("#formEnviar").attr("data-CrearConversacion", "Si");
				}
				
				
			});
					
		}
		else{
			
			nombre = nombreP;
			$("#nombreUsuario").text(nombreP);
			$("#datosUsuario").attr("data-Nombre", nombreP);
			
			nombreImagen = nombreImagenP;
			$("#imagenUsuario").attr("src", nombreImagenP);
			$("#datosUsuario").attr("data-NombreImagen", nombreImagenP);
		}
		
		
	}
	
	
	function agregarConversacion(idRemitente, idDestinatario, nombre, nombreImagen, mensajesNuevos){
					
		$("#listaConversaciones").append(
		
			"<li id='conversacion_" + idDestinatario + "'>" + 
				"<img id='elemento_eliminar' src='" + (rutaImagenesGenerales + "EliminarConversacion.png") + "'></img>" +
				"<img id='elemento_imagen' src='" + (rutaImagenesPerfil + nombreImagen) + "'></img>" +
				"<span id='elemento_nombre'>" + nombre + "</span>" +
				"<span id='elemento_mensajesNuevos'>" + mensajesNuevos + "</span>" +
			"</li>"
		
		);	
	
	
		$("#conversacion_" + idDestinatario).attr("data-IdRemitente", idRemitente);
		$("#conversacion_" + idDestinatario).attr("data-IdDestinatario", idDestinatario);
		$("#conversacion_" + idDestinatario).attr("data-Nombre", nombre);
		$("#conversacion_" + idDestinatario).attr("data-NombreImagen", nombreImagen);
		$("#conversacion_" + idDestinatario).attr("data-MensajesNuevos", mensajesNuevos);
		
		
		
		
		$("#conversacion_" + idDestinatario).click(function(){


			$("#nombreConversacion").text( $(this).attr("data-Nombre") );
			
			
			$("#nombreConversacion").toggle();
			$("#formEnviar").toggle();
			
			
			idDestinatarioActual = $(this).attr("data-IdDestinatario");
			nombreDestinatarioActual = $(this).attr("data-Nombre");
			nombreImagenDestinatarioActual = $(this).attr("data-NombreImagen");
			
			
			$("#formEnviar").attr("data-CrearConversacion", "No");
			
			
			
			if ( $(this).attr("data-MensajesNuevos") > 0 ){
			
				actualizarMensajesNuevos(idDestinatario, "0");
			}
			
			
			stomp.send(destinoEnvio_ObtenerListaMensajes, {}, {"idRemitente" : id, "idDestinatario" : idDestinatario});
			

		});
		
		
		
		
		$("#conversacion_" + idDestinatario + " #elemento_eliminar").click( eliminarConversacion(idDestinatario) );
		

		stomp.subscribe(destinoSuscripcion_ActualizarDatosConversacion + idDestinatario, function(message){
			
			
			var datosUsuarioActualizado = JSON.parse(message.body);


			if ( datosUsuarioActualizado.actualizar === "nombre" ){
				
				var nuevoNombre = datosUsuarioActualizado.nombre;
				
				$("#conversacion_" + idDestinatario).attr("data-Nombre", nuevoNombre);
				$("#conversacion_" + idDestinatario +" #elemento_nombre").text(nuevoNombre);
				

			}
			else{
				
				var nuevoNombreImagen = datosUsuarioActualizado.nombreImagen;
				
				$("#conversacion_" + idDestinatario).attr("data-NombreImagen", nuevoNombreImagen);
				$("#conversacion_" + idDestinatario +" #elemento_imagen").attr("src", rutaImagenesPerfil + nuevoNombreImagen);
				
			}
			
			
			
			if ( $("#formEnviar").is(":visible") ){
				
				if ( idDestinatarioActual === idDestinatario ){
					
					if ( datosUsuarioActualizado.actualizar === "nombre" ){
						
						var nuevoNombre = datosUsuarioActualizado.nombre;
						
						$("#nombreConversacion").text(nuevoNombre);
						nombreDestinatarioActual = nuevoNombre;	
					}
					else{
						
						var nuevoNombreImagen = datosUsuarioActualizado.nombreImagen;

						nombreImagenDestinatarioActual = nuevoNombreImagen;	
					}
				}	
			}
			
			
			
		});
		

					
	}
	
	
	function agregarConversacionAndGuardarBBDD(idRemitente, idDestinatario, nombre, nombreImagen, mensajesNuevos){
		
		agregarConversacion(idRemitente, idDestinatario, nombre, nombreImagen, mensajesNuevos);
		
		var conversacion = {
			"id_remitente" : idRemitente,
			"id_destinatario" : idDestinatario, 
			"nombre" : nombre, 
			"nombreImagen" : nombreImagen,
			"mensajesNuevos" : mensajesNuevos
		}
			
		stomp.send(destinoCrearConversacion, JSON.stringify(conversacion));
	}
	
	
	
	
	
	function eliminarConversacion(id){

		$("#conversacion_" + id).remove();
		
		stomp.send(destinoEnvio_EliminarConversacion, {}, {"id" : id});
	}
	
	
	
	
	function actualizarMensajesNuevos(idConversacion, accion){
		
		var mensajesNuevos;
		
		
		if ( accion === "+" ){
			
			mensajesNuevos = $("#conversacion_" + idConversacion).attr("data-MensajesNuevos") + 1;
		}
		
		else if ( accion === "0" ) {
			
			mensajesNuevos = 0;
		}
		
				
		var datosActualizacion = {
			"idRemitente" : id,
			"idDestinatario" : idConversacion,
			"mensajesNuevos" : mensajesNuevos
		}
		
		
		$("#conversacion_" + idConversacion).attr("data-MensajesNuevos", mensajesNuevos);
		$("#conversacion_" + idConversacion + " #elemento_mensajesNuevos").text(mensajesNuevos);
		
		
		stomp.send(destinoEnvio_ActualizarMensajesNuevos, {}, datosActualizacion);
	}
	
	
	
	function agregarMensajeBandejaConversacion(mensaje){
		
		var idRemitente = mensaje.id_remitente;
		var idDestinatario = mensaje.id_destinatario;
		var contenido = mensaje.contenido;
		var fechaEnvio = new Date(mensaje.fecha);
		
		
		var fechaActual = new Date();
		
		var milisegundosDiferencia = fechaActual.getTime() - fechaEnvio.getTime();
		
		var segundos = Math.floor( milisegundosDiferencia / 1000 );
		var minutos = Math.floor( segundos / 60 );
		var horas = Math.floor( minutos / 60 );
		var dias = Math.floor( horas / 24 );
		
		
		var enviadoHace;
		
		if ( segundos > 0 ){
			
			enviadoHace = "un instante";
		}
		if ( minutos > 0 ){
			
			enviadoHace = minutos + " minutos";
		}
		if ( horas > 0 ){
			
			enviadoHace = horas + " horas";
		}
		if ( dias > 0 ){
			
			enviadoHace = dias + " dias";
		}
		
		$("#bandejaConversacion").append(mensaje.contenido);
	}
	
	
	
	
	//////////////////INICIALIZACION Y ASIGNACION DE FUNCIONES A ELEMENTOS////////////////////
	/////////////////////////////////////////////////////////////////////////
	
	
		////////////ocultar menu para eliminar conversacion
	$(this).click(function(){
		$("#menu_OpcionesPerfil").hide();
		$("#menu_EditarPerfil").hide();
	});
	

		////////mostrar menu de opciones del perfil
	$("#imagenUsuario").click(function(e){
		
		$("#menu_EditarPerfil").hide();
		
		$("#menu_OpcionesPerfil").toggle();
	});
	
	
	
		////////mostrar menu para editar perfil
	$("#botonEditarPerfil").click(function(e){
		
		$("#menu_OpcionesPerfil").hide();
		
		$("#campoNuevoNombre").val(nombre);
		
		$("#campoNuevaImagen").val("");
		
		$("#menu_EditarPerfil").css({
			display:"block"
		});
		
	});
	
	
	
		/////////Comprobar valor del campo nuevoNombre para habilitar o no el boton actualizarNombre 
	$("#campoNuevoNombre").on("input", function(){
		
		var nuevoNombre = $(this).val(); 
		
		if( nuevoNombre.trim() !== "" ){
			if ( nuevoNombre !== nombre ){
				
				$("#botonEditarNombre").prop("disabled", false);
				
			}
		}
		else{
			$("#botonEditarNombre").prop("disabled", true);
		}
		
	});
	
	
	
	
		/////////Comprobar valor del campo nuevaImagen para habilitar o no el boton actualizarImagen 
	$("#campoNuevaImagen").on("input", function(){
		
		var metadatosNuevaImagen = $(this).val(); 
		
		if( metadatosNuevaImagen !== "" ){

			$("#botonEditarImagen").prop("disabled", false);
		}
		else{
			$("#botonEditarImagen").prop("disabled", true);
		}
		
	});
	
	
		//////////comprobar valor de campoMensaje para habilitar o no botonEnviarMensaje
		$("#campoMensaje").on("input", function(){
			
			if ( $(this).val().trim() !== "" ){
				
				$("#botonEnviarMensaje").prop("disabled", false);
			}
			else{
				
				$("#botonEnviarMensaje").prop("disabled", true);
			}
			
		});
	
	
	

});









