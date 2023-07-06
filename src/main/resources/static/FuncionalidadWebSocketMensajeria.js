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
	var destinoSuscripcion_Mensajes = "/user/" + id + "/queue/mensajes";
	var destinoSuscripcion_ActualizarDatosConversacion = "/topic/actualizarDatosConversacion/";
	
	var destinoEnvio_Mensaje = "/enviarMensaje";
	var destinoEnvio_ActualizarListaUsuarios = "/actualizarListaUsuariosOnline";
	var destinoEnvio_ObtenerListaConversaciones = "/obtenerListaConversaciones";
	var destinoEnvio_CrearConversacion = "/crearConversacion";
	var destinoEnvio_EliminarConversacion = "/eliminarConversacion";
	var destinoEnvio_ActualizarDatosUsuario = "/actualizarDatosUsuario"



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
		
		
		
		/////////SUSCRIPCION PARA PROCESAMIENTO DE MENSAJES//////////
		/////////////////////////////////////////////////////////////////
		stomp.subscribe(destinoSuscripcion_Mensajes, function(message){
			
			var c = JSON.parse(message.body);
			
			if ( $("#conversacion_" + c.idRemitente).length === 0) {
				
				agregarConversacionAndGuardarBBDD(id, c.idRemitente, c.nombre, c.nombreImagen, 0);
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
		
		var envio = {
			"idRemitente" : id,
			"nombre" : nombre,
			"nombreImagen" : nombreImagen,
			"idDestinatario" : idDestinatarioActual
		}

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
						}
						else{
							
							$("#formEnviar").attr("data-CrearConversacion", "Si");
						}
						
					});
					
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
		
		});
		
		
		
		
		$("#conversacion_" + idDestinatario + " #elemento_eliminar").click( eliminarConversacion(idDestinatario) );
		

		stomp.subscribe(destinoSuscripcion_ActualizarDatosConversacion + idDestinatario, function(message){
			
			var conversacionActualizada = JSON.parse(message.body);
			
			$("#conversacion_" + idDestinatario).attr("data-Nombre", conversacionActualizada.nombre);
			$("#conversacion_" + idDestinatario).attr("data-NombreImagen", conversacionActualizada.nombreImagen);
			
			$("#conversacion_" + idDestinatario +" #elemento_nombre").text(conversacionActualizada.nombre);
			$("#conversacion_" + idDestinatario +" #elemento_imagen").attr("src", rutaImagenesPerfil + conversacionActualizada.nombreImagen);
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
		
		var nuevoNombre = $(this).val(); 
		
		if( nuevoNombre !== "" ){

			$("#botonEditarImagen").prop("disabled", false);
		}
		else{
			$("#botonEditarImagen").prop("disabled", true);
		}
		
	});
	
	
	

});









