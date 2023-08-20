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

	var rutaImagenesPerfil = "/ImagenesDePerfil/";
	var rutaImagenesGenerales = "/imagenesGenerales/";
	
	var destinoSuscripcion_RecivirListaUsuarios = "/user/" + id + "/queue/RecivirListaUsuarios";
	var destinoSuscripcion_ActualizarListaUsuarios = "/topic/ActualizarListaUsuarios";
	var destinoSuscripcion_ListaConversaciones = "/user/" + id + "/queue/conversaciones";
	var destinoSuscripcion_RecibirMensaje = "/user/" + id + "/queue/recibirMensaje";
	var destinoSuscripcion_ActualizarDatosConversacion = "/topic/actualizarDatosConversacion/";
	var destinoSuscripcion_ListaMensajes = "/user/" + id + "/queue/mensajes";
	
	
	var destinoEnvio_ActualizarUsuariosOnline = "/actualizarUsuariosOnline";
	var destinoEnvio_Mensaje = "/enviarMensaje";
	var destinoEnvio_ActualizarMensajesNuevos = "/actualizarMensajesNuevos";
	var destinoEnvio_ObtenerListaMensajes = "/obtenerListaMensajes";
	var destinoEnvio_CrearConversacion = "/crearConversacion";
	var destinoEnvio_ObtenerListaConversaciones = "/obtenerListaConversaciones";
	var destinoEnvio_EliminarConversacion = "/eliminarConversacion";
	



	//////////////////////MOSTRAR NOMBRE E IMAGEN DEL USUARIO EN LA INTERFAZ////////////////
	///////////////////////////////////////////////////////////////////////////////////////
	$("#nombreUsuario").text(nombre);
	$("#imagenUsuario").attr("src", rutaImagenesPerfil + nombreImagen);




		stomp.connect({}, function() {
			
			
			
			/////////SUSCRIPCION OBTENER LISTA USUARIOS ONLINE//////////
			/////////////////////////////////////////////////////////////////
			stomp.subscribe(destinoSuscripcion_RecivirListaUsuarios, function(message){
				
				var listaUsuarios = JSON.parse(message.body);
	
				for (const [clave, u] of Object.entries(listaUsuarios)) {
		
					agregarUsuario(u.id, u.nombre, u.nombreImagen);		
	    		}
			});
			
			
			
			/////////SUSCRIPCION ACTUALIZAR LISTA USUARIOS ONLINE//////////
			/////////////////////////////////////////////////////////////////
			stomp.subscribe(destinoSuscripcion_ActualizarListaUsuarios, function(message){
	
				var u = JSON.parse(message.body);
				
				if ( u.estado === "CONECTADO" ) {
						
					agregarUsuario(u.id, u.nombre, u.nombreImagen);	
				}
				else if ( u.estado === "DESCONECTADO" ) {
						
					$("#usuario_" + u.id).remove();
				}
				else if ( u.estado === "ACTUALIZAR_NOMBRE" ) {
						
					$("#usuario_" + u.id + " #elemento_nombre").text(u.nombre);
					$("#usuario_" + u.id).attr("data-Nombre", u.nombre);
				}
				else if ( u.estado === "ACTUALIZAR_IMAGEN" ) {
					
					$("#usuario_" + u.id + " #elemento_imagen").attr("src", rutaImagenesPerfil + u.nombreImagen);
					$("#usuario_" + u.id).attr("data-NombreImagen", u.nombreImagen);
				}
			});
			
			
	//		
	//		/////////SUSCRIPCION MOSTRAR LISTA DE CONVERSACIONES//////////
	//		/////////////////////////////////////////////////////////////////
	//		stomp.subscribe(destinoSuscripcion_ListaConversaciones, function(message){
	//			
	//			var listaConversaciones = JSON.parse(message.body);
	//			
	//			$("#listaConversaciones").empty();
	//			
	//			listaConversaciones.forEach(function(c){
	//				
	//				agregarConversacion(c.id_remitente, c.id_destinatario, c.nombre, c.nombreImagen, c.mensajesNuevos)
	//
	//			});
	//			
	//		});
	//		
	//		
	//		/////////SUSCRIPCION MOSTRAR LISTA DE MENSAJES//////////
	//		/////////////////////////////////////////////////////////////////
	//		stomp.subscribe(destinoSuscripcion_ListaMensajes, function(message){
	//			
	//			var listaMensajes = JSON.parse(message.body);
	//
	//			$("#bandejaConversacion").empty();
	//			
	//			listaMensajes.forEach(function(m){
	//				
	//				agregarMensajeBandejaConversacion(m);
	//			})
	//			
	//		});
	//		
	//
	//		/////////SUSCRIPCION PARA PROCESAMIENTO DE MENSAJES//////////
	//		/////////////////////////////////////////////////////////////////
	//		stomp.subscribe(destinoSuscripcion_RecibirMensaje, function(message){
	//			
	//			var envio = JSON.parse(message.body);
	//			
	//			var datosRemitente = envio.datosRemitente;
	//			var mensaje = envio.mensaje;
	//			
	//			var idRemitente = mensaje.id_remitente;
	//			
	//			var nombreRemitente = datosRemitente.nombre;
	//			var nombreImagenRemitente = datosRemitente.nombreImagen;
	//			
	//			
	//			if ( $("#conversacion_" + idRemitente).length === 0) {
	//				
	//				agregarConversacionAndGuardarBBDD(id, idRemitente, nombreRemitente, nombreImagenRemitente, 1);
	//			}
	//			else{
	//				
	//				if ( verificarSiConversacionEstaAbierta(idRemitente) ){
	//
	//					agregarMensajeBandejaConversacion(mensaje.contenido);
	//				}
	//				else{
	//					
	//					actualizarMensajesNuevos(idRemitente, "+");
	//				}
	//			}
	//			
	//			
	//		});
	//		
	//		
			
			
			
			
			//////////ENVIO CONECTAR USUARIO///////////////
			////////////////////////////////////////////////////////////////////////////////////////////////////
			
			var estado = "CONECTADO";
			
			if ( $("#datosUsuario").attr("data-Actualizar") === "Imagen" ){
				
				estado = "ACTUALIZAR_IMAGEN";
			}
			
			stomp.send(destinoEnvio_ActualizarUsuariosOnline, {}, JSON.stringify({ 
				"id" : id, 
				"estado" : estado,
				"nombre" : nombre,
				"nombreImagen" : nombreImagen
			}));
			
	//		
	//		//////////ENVIO OBTENER LISTA CONVERSACIONES///////////////
	//		////////////////////////////////////////////////////////////////////////////////////////////////////
	//		stomp.send(destinoEnvio_ObtenerListaConversaciones, {}, id);
	//	
	//		
	
			
		});
	
	
	
	

	
	
	
//	///////////ENVIO ACTUALIZAR IMAGEN PERFIL/////////
//	//////////////////////////////////////////////////
//	$("#formEditarImagen").submit(function(event){
//		
//		var metadatosNuevaImagen = $("#campoNuevaImagen").val();
//		
//		stomp.send(destinoEnvio_ActualizarDatosUsuario, {
//			"actualizar" : "imagen", 
//			"id" : id, 
//			"nuevaImagen" : metadatosNuevaImagen,
//			"nombre" : nombre
//		});
//		
//	});
//
//
//	
//	//////////////ENVIO DE MENSAJE///////////////////
//	////////////////////////////////////////////////
//	$("#formEnviar").submit(function(event) {
//		
//		event.preventDefault(); 
//
//		if( $("#formEnviar").attr("data-CrearConversacion") === "Si" ){
//			
//			agregarConversacionAndGuardarBBDD(id, idDestinatarioActual, nombreDestinatarioActual, nombreImagenDestinatarioActual, 0);
//		}
//		
//		
//
//		var datosRemitente = {
//			"nombre" : nombre,
//			"nombreImagen" : nombreImagen
//		}
//		
//		var mensaje = {
//			"id_remitente" : id,
//			"id_destinatario" : idDestinatarioActual,
//			"contenido" : $("#campoMensaje").val(),
//			"fecha" : new Date().toISOString
//		}
//		
//		var envio = {
//			"datosRemitente" : datosRemitente,
//			"mensaje" : mensaje
//		}
//		
//		
//		agregarMensajeBandejaConversacion(mensaje);
//
//		stomp.send(destinoEnvio_Mensaje, {}, envio);
//						
//	});
//	
//	
//	
//	
	
	
	/////////////CAPTURA DE EVENTO DE DESCONEXION/////////////
 	$(window).on('beforeunload', function() {
		 
		//ENVIO DESCONECTAR USUARIO
	    stomp.send(destinoEnvio_ActualizarUsuariosOnline, {}, JSON.stringify({
			"id" : id,
			"estado" : "DESCONECTADO"
	    })); 
	});  
		 
		 

	
	
	
	////////////////////////////////////FUNCIONES////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	
	function agregarUsuario(idP, nombreP, nombreImagenP) {
		
		if( idP != id ) {
					
			$("#listaUsuarios").append(
				
				"<li id='usuario_" + idP + "'>" + 
					"<span id='elemento_nombre'>" + nombreP + "</span>" +
					"<img id='elemento_imagen' src='" + (rutaImagenesPerfil + nombreImagenP) + "'></img>" +
				"</li>"
				
			);
			
			$("#usuario_" + idP).attr("data-Id", idP);
			$("#usuario_" + idP).attr("data-Nombre", nombreP);
			$("#usuario_" + idP).attr("data-NombreImagen", nombreImagenP);
			

			$("#usuario_" + idP).click( function() {
				abrirConversacion(idP, $(this))
			});
		}
			
			
//			
//			nombreImagen = nombreImagenP;
//			$("#imagenUsuario").attr("src", nombreImagenP);
//			$("#datosUsuario").attr("data-NombreImagen", nombreImagenP);
//			
//			if ( verificarSiConversacionEaAbierta(idP) ){
//			
//				$("#bandejaConversacioeach(function(){
//					
//					if ( $(this).attr("data-Remitente") === id ){
//						
//						if ( $(this).find("#imagen") > 0 ){
//							
//							$(this).find("#imagen").attr("src", rutaImagenesPerfil + nombreImagenP);
//						}
//					}
//				});
//			}
	}

	
//	
//	function agregarConversacion(idRemitente, idDestinatario, nombre, nombreImagen, mensajesNuevos){
//					
//		$("#listaConversaciones").append(
//		
//			"<li id='conversacion_" + idDestinatario + "'>" + 
//				"<img id='elemento_eliminar' src='" + (rutaImagenesGenerales + "EliminarConversacion.png") + "'></img>" +
//				"<img id='elemento_imagen' src='" + (rutaImagenesPerfil + nombreImagen) + "'></img>" +
//				"<span id='elemento_nombre'>" + nombre + "</span>" +
//				"<span id='elemento_mensajesNuevos'>" + mensajesNuevos + "</span>" +
//			"</li>"
//		
//		);	
//	
//	
//		$("#conversacion_" + idDestinatario).attr("data-IdRemitente", idRemitente);
//		$("#conversacion_" + idDestinatario).attr("data-IdDestinatario", idDestinatario);
//		$("#conversacion_" + idDestinatario).attr("data-Nombre", nombre);
//		$("#conversacion_" + idDestinatario).attr("data-NombreImagen", nombreImagen);
//		$("#conversacion_" + idDestinatario).attr("data-MensajesNuevos", mensajesNuevos);
//		
//		
//		
//		
//		$("#conversacion_" + idDestinatario).click(abrirConversacion(idDestinatario, $(this) ));
//		
//
//
//		var suscripcionActualizarDatosConversacion = stomp.subscribe(destinoSuscripcion_ActualizarDatosConversacion + idDestinatario, function(message){
//			
//			
//			var datosUsuarioActualizado = JSON.parse(message.body);
//
//
//			if ( datosUsuarioActualizado.actualizar === "nombre" ){
//				
//				var nuevoNombre = datosUsuarioActualizado.nombre;
//				
//				$("#conversacion_" + idDestinatario).attr("data-Nombre", nuevoNombre);
//				$("#conversacion_" + idDestinatario +" #elemento_nombre").text(nuevoNombre);
//				
//			}
//			else{
//				
//				var nuevoNombreImagen = datosUsuarioActualizado.nombreImagen;
//				
//				$("#conversacion_" + idDestinatario).attr("data-NombreImagen", nuevoNombreImagen);
//				$("#conversacion_" + idDestinatario +" #elemento_imagen").attr("src", rutaImagenesPerfil + nuevoNombreImagen);
//				
//			}
//			
//			
//			
//			if ( verificarSiConversacionEstaAbierta(idDestinatario) ){
//					
//				if ( datosUsuarioActualizado.actualizar === "nombre" ){
//					
//					var nuevoNombre = datosUsuarioActualizado.nombre;
//					
//					$("#nombreConversacion").text(nuevoNombre);
//					nombreDestinatarioActual = nuevoNombre;	
//				}
//				else{
//					
//					var nuevoNombreImagen = datosUsuarioActualizado.nombreImagen;
//
//					nombreImagenDestinatarioActual = nuevoNombreImagen;	
//					
//					$("#bandejaConversacion").each(function(){
//						
//						if ( $(this).attr("data-Remitente") === idDestinatario ){
//							
//							if ( $(this).find("#imagen") > 0 ){
//								
//								$(this).find("#imagen").attr("src", rutaImagenesPerfil + nuevoNombreImagen);
//							}
//						}
//					});
//				}
//			}
//			
//		});
//		
//		$("#conversacion_" + idDestinatario + " #elemento_eliminar").click( eliminarConversacion(idDestinatario, suscripcionActualizarDatosConversacion) );			
//	}
//	
//	
//	function agregarConversacionAndGuardarBBDD(idRemitente, idDestinatario, nombre, nombreImagen, mensajesNuevos){
//		
//		agregarConversacion(idRemitente, idDestinatario, nombre, nombreImagen, mensajesNuevos);
//		
//		var conversacion = {
//			"id_remitente" : idRemitente,
//			"id_destinatario" : idDestinatario, 
//			"nombre" : nombre, 
//			"nombreImagen" : nombreImagen,
//			"mensajesNuevos" : mensajesNuevos
//		}
//			
//		stomp.send(destinoCrearConversacion, JSON.stringify(conversacion));
//	}
	
	
	
	function abrirConversacion(id, elemento){
		console.log("------------------" + id);
		console.log("------------------" + elemento.attr("data-Nombre"));
		
		if ( verificarSiConversacionEstaAbierta(id) ){
			
			$("#nombreConversacion").hide();
			$("#formEnviar").hide();
		}
		else{
		
			$("#nombreConversacion").css({
				display:"block"
			});
			$("#formEnviar").css({
				display:"block"
			});
			
			$("#nombreConversacion").text( elemento.attr("data-Nombre") );
			
			idDestinatarioActual = elemento.attr("data-Id");
//			nombreDestinatarioActual = elemento.attr("data-Nombre");
//			nombreImagenDestinatarioActual = elemento.attr("data-NombreImagen");
			
//			if ( $("#conversacion_" + id).length > 0 ) {
//				
//				$("#formEnviar").attr("data-CrearConversacion", "No");
//				
//				if ( $("#conversacion_" + id).attr("data-MensajesNuevos") > 0 ){
//			
//					actualizarMensajesNuevos(id, "0");
//				}
//			}
//			else{
//				
//				$("#formEnviar").attr("data-CrearConversacion", "Si");
//			}
			
			
//			stomp.send(destinoEnvio_ObtenerListaMensajes, {}, {"idRemitente" : id, "idDestinatario" : idDestinatarioActual});

		}		
	}
	
	
	
//	function eliminarConversacion(id, suscripcionActualizarDatosConversacion){
//		
//		if ( verificarSiConversacionEstaAbierta(id) ){
//			
//			$("formEnviar").hide();
//			$("#nombreConversacion").hide();
//			$("#bandejaConversacion").empty();
//		}
//
//		$("#conversacion_" + id).remove();
//		
//		stomp.send(destinoEnvio_EliminarConversacion, {}, {"id" : id});
//		
//		stomp.unsubscribe(suscripcionActualizarDatosConversacion.id);
//	}
//	
	
	
	function verificarSiConversacionEstaAbierta(idDestinatario){
		
		if ( $("#formEnviar").is(":visible") ){
			
			if ( idDestinatarioActual == idDestinatario ){
				
				return true;
			}
		}
		else{
			return false;
		}
	}
	
	
	
//	function actualizarMensajesNuevos(idConversacion, accion){
//		
//		var mensajesNuevos;
//		
//		
//		if ( accion === "+" ){
//			
//			mensajesNuevos = $("#conversacion_" + idConversacion).attr("data-MensajesNuevos") + 1;
//		}
//		
//		else if ( accion === "0" ) {
//			
//			mensajesNuevos = 0;
//		}
//		
//				
//		var datosActualizacion = {
//			"idRemitente" : id,
//			"idDestinatario" : idConversacion,
//			"mensajesNuevos" : mensajesNuevos
//		}
//		
//		
//		$("#conversacion_" + idConversacion).attr("data-MensajesNuevos", mensajesNuevos);
//		$("#conversacion_" + idConversacion + " #elemento_mensajesNuevos").text(mensajesNuevos);
//		
//		
//		stomp.send(destinoEnvio_ActualizarMensajesNuevos, {}, datosActualizacion);
//	}
//	
//	
//	
//	function agregarMensajeBandejaConversacion(mensaje){
//		
//		var idRemitente = mensaje.id_remitente;
//		var idDestinatario = mensaje.id_destinatario;
//		var contenido = mensaje.contenido;
//		var fechaEnvio = new Date(mensaje.fecha);
//		
//		
//		var fechaActual = new Date();
//		
//		var milisegundosDiferencia = fechaActual.getTime() - fechaEnvio.getTime();
//		
//		var segundos = Math.floor( milisegundosDiferencia / 1000 );
//		var minutos = Math.floor( segundos / 60 );
//		var horas = Math.floor( minutos / 60 );
//		var dias = Math.floor( horas / 24 );
//		
//		
//		var enviadoHace;
//		
//		if ( segundos > 0 ){
//			
//			enviadoHace = "un instante";
//		}
//		if ( minutos > 0 ){
//			
//			enviadoHace = minutos + " minutos";
//		}
//		if ( horas > 0 ){
//			
//			enviadoHace = horas + " horas";
//		}
//		if ( dias > 0 ){
//			
//			enviadoHace = dias + " dias";
//		}
//		
//		
//		
//		
//		if ( $("#bandejaConversacion li").length > 0 ){
//			
//			
//			
//			if ( idRemitente === $("#bandejaConversacion li").last().attr("data-Remitente") ){
//				
//				if ( $("#bandejaConversacion li").last().attr("data-DiferenciaMinutos") - minutos <= 2 ){
//					
//					if ( id === idRemitente ){
//						
//						$("#bandejaConversacion li").last().find("#imagen").remove();	
//					}
//					
//					$("#bandejaConversacion li").last().find("#fecha").remove();	
//				}	
//				else{
//					
//					$("#bandejaConversacion li").last().append("<br>");	
//				}
//			}
//			else{
//				
//				$("#bandejaConversacion li").last().append("<br>");	
//			}
//		}
//		
//		
//		var elementoImagen = "";
//		
//		if ( id !== idRemitente ){
//			
//			elementoImagen = "<img id='imagen' src='" + rutaImagenesPerfil + nombreImagenDestinatarioActual + "'></img>";
//		}
//		
//		$("#bandejaConversacion").append(
//			
//			"<li data-Remitente='" + idRemitente + "' data-DiferenciaMinutos='" + minutos + ">" +
//				elementoImagen +
//				"<span id='contenido'>" + contenido + "</span>" + 
//				"<span id='fecha'> Enviado hace " + enviadoHace + "</span>" + 
//			
//			"</li>"
//			
//		);
//	}
//	
	
	
	
	//////////////////INICIALIZACION Y ASIGNACION DE FUNCIONES A ELEMENTOS////////////////////
	/////////////////////////////////////////////////////////////////////////
	

		////////mostrar menu de opciones del perfil
	$("#imagenUsuario").click(function(e){
		
		$("#menu_OpcionesPerfil").toggle();
		
		if ( $("#menu_OpcionesPerfil").is(":visible") ){
		
			$("#mensajeError_ActualizarNombre").hide();	
		}
		
		$("#menu_EditarPerfil").hide();
	});
	
	
	
		////////mostrar menu para editar perfil
	$("#botonEditarPerfil").click(function(e){
		
		$("#menu_OpcionesPerfil").hide();
		
		$("#campoNuevoNombre").val(nombre);
		$("#botonEditarNombre").prop("disabled", true);
		
		$("#campoNuevaImagen").val("");
		
		$("#menu_EditarPerfil").css({
			display:"block"
		});
		
	});
	
	
	$("#botonCerrar_MenuEditarPerfil").click(function(e){
	
		$("#menu_EditarPerfil").hide();	
		
		$("#mensajeError_ActualizarNombre").hide();
	});
	
	
	
		/////////Comprobar valor del campo nuevoNombre para habilitar o no el boton actualizarNombre 
	$("#campoNuevoNombre").on("input", function(){
		
		var nuevoNombre = $(this).val(); 
		
		if( nuevoNombre === nombre || nuevoNombre.trim() === ""){

			$("#botonEditarNombre").prop("disabled", true);
		}
		else{
			
			$("#botonEditarNombre").prop("disabled", false);
		}
		
	});
	
	
	/////////Comprobar resultado de validacion al actualizar nombre de usuario
	if( $("#mensajeError_ActualizarNombre").attr("data-ResultadoValidacion") === "Incorrecta"){
		
		$("#mensajeError_ActualizarNombre").text("Nombre no disponible.");
		
		$("#campoNuevoNombre").val( $("#mensajeError_ActualizarNombre").attr("data-NombreNoDisponible") );
		
		$("#menu_EditarPerfil").css({
			display:"block"
		});
	}
	
	

		//////////comprobar valor de campoMensaje para habilitar o no botonEnviarMensaje
		
		$("#botonEnviarMensaje").prop("disabled", true);
		
		$("#campoMensaje").on("input", function(){
			
			if ( $(this).val().trim() === "" ){
				
				$("#botonEnviarMensaje").prop("disabled", true);
			}
			else{
				
				$("#botonEnviarMensaje").prop("disabled", false);
			}
			
		});
	
	
	

});









