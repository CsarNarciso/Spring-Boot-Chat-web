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



	
	////////ENVIO ACTUALIZAR CONVERSACIONES PERTENECIENTES A USUARIO MODIFICADO////////
	///////////////////////////////////////////////////////////////////////////////////



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
				
				agregarConversacion(c.id, c.id_remitente, c.id_destinatario, c.nombre, c.nombreImagen, c.mensajesNuevos)

			});
			
		});
		
		
		
		
		//////////ENVIO NOTIFICACION OBTENER Y ACTUALIZAR GLOBALMENTE USUARIOS ONLINE///////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////
		stomp.send(destinoEnvio_ActualizarListaUsuarios, {
			"accion" : "agregar", 
			"id" : id, 
			"nombre" : nombre,
			"nombreImagen" : nombreImagen
		});
		
		
		//////////ENVIO NOTIFICACION OBTENER LISTA CONVERSACIONES///////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////
		stomp.send(destinoEnvio_ObtenerListaConversaciones, {"id" : id});
	
		
		
		
		
		
		
		/////////SUSCRIPCION PARA PROCESAMIENTO DE MENSAJES//////////
		/////////////////////////////////////////////////////////////////
		stomp.subscribe(destinoSuscripcion_Mensajes, function(message){
			
			var mensaje = JSON.parse(message.body);
			
			$("#bandejaMensajes").append(
				"<br><br>" + 
				"De " + mensaje.remitente +
				"<br>" +
				mensaje.contenido
				);
			
		});
		
		
		
		
		
		
	});
	
	
	

	///////////ENVIO ACTUALIZAR NOMBRE PERFIL/////////
	//////////////////////////////////////////////////
	$("#formEditarNombre").submit(function(e){
		
		var nuevoNombre = $("#campoNuevoNombre").val();
		
		stomp.send(destinoEnvio_ActualizarDatosUsuario, {"actualizar" : "nombre", "id" : id, "nuevoNombre" : nuevoNombre});
		
	});
	
	
	
	///////////ENVIO ACTUALIZAR IMAGEN PERFIL/////////
	//////////////////////////////////////////////////
	$("#formEditarImagen").submit(function(e){
		
		var metadatosNuevaImagen = $("#campoNuevaImagen").val();
		
		stomp.send(destinoEnvio_ActualizarDatosUsuario, {"actualizar" : "imagen", "id" : id, "nuevaImagen" : metadatosNuevaImagen});
		
	});


	
	//////////////ENVIO DE MENSAJE///////////////////
	////////////////////////////////////////////////
	$("#formEnviar").submit(function(event) {
		
		event.preventDefault(); 

		var contenido = $("#campoMensaje").val();
		
	 	var mensaje = {
		 	"id_remitente" : id, 
			"id_destinatario" : idDestinatarioActual,
			"contenido" : contenido
			};
			

		if($("#formEnviar").attr("data-CrearConversacion") == "Si"){
			
			agregarConversacion(idDestinatarioActual, id, idDestinatarioActual, nombreDestinatarioActual, nombreImagenDestinatarioActual, 0);
			
			var conversacion = {
				"id_remitente" : id,
				"id_destinatario" : idDestinatarioActual, 
				"nombre" : nombreDestinatarioActual, 
				"nombreImagen" : nombreImagenDestinatarioActual,
				"mensajesNuevos" : 0
			}
			
			stomp.send(destinoCrearConversacion, JSON.stringify(conversacion));
		}


		stomp.send(destinoEnvio_Mensaje, JSON.stringify(mensaje));
						

		$("#campoMensaje").val(""); 
	});
	
	
	
	
	
	
	/////////////CAPTURA DE EVENTO DE DESCONEXION/////////////
 	$(window).on('unload', function() {
		 
		//ACTUALIZAR LISTA USUARIOS ONLINE
        stomp.send(destinoEnvio_ActualizarListaUsuarios, {"accion" : "quitar"});
        
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
	
	
	function agregarConversacion(id, idRemitente, idDestinatario, nombre, nombreImagen, mensajesNuevos){
					
		$("#listaConversaciones").append(
		
			"<li id='conversacion_" + id + "'>" + 
				"<img id='elemento_eliminar' src='" + (rutaImagenesGenerales + "EliminarConversacion.png") + "'></img>" +
				"<img id='elemento_imagen' src='" + (rutaImagenesPerfil + nombreImagen) + "'></img>" +
				"<span id='elemento_nombre'>" + nombre + "</span>" +
				"<span id='elemento_mensajesNuevos'>" + mensajesNuevos + "</span>" +
			"</li>"
		
		);	
	
	
					
		$("#conversacion_" + id).attr("data-Id", id);
		$("#conversacion_" + id).attr("data-IdRemitente", idRemitente);
		$("#conversacion_" + id).attr("data-IdDestinatario", idDestinatario);
		$("#conversacion_" + id).attr("data-Nombre", nombre);
		$("#conversacion_" + id).attr("data-NombreImagen", nombreImagen);
		$("#conversacion_" + id).attr("data-MensajesNuevos", mensajesNuevos);
		
		
		
		$("#conversacion_" + id).click(function(){

			$("#nombreConversacion").text( $(this).attr("data-Nombre") );
			
			$("#nombreConversacion").toggle();
			$("#formEnviar").toggle();
			
			idDestinatarioActual = $(this).attr("data-IdDestinatario");
			
			$("#formEnviar").attr("data-CrearConversacion", "No");
		
		});
		
		
		
		$("#conversacion_" + id + " #elemento_eliminar").click( eliminarConversacion(id) );
		

		stomp.subscribe(destinoSuscripcion_ActualizarDatosConversacion + c.idDestinatario, function(message){
			
			var conversacionActualizada = JSON.parse(message.body);
			
			$("#conversacion_" + id).attr("data-Nombre", conversacionActualizada.nombre);
			$("#conversacion_" + id).attr("data-NombreImagen", conversacionActualizada.nombreImagen);
			
			$("#conversacion_" + id +" #elemento_nombre").text(conversacionActualizada.nombre);
			$("#conversacion_" + id +" #elemento_imagen").attr("src", rutaImagenesPerfil + conversacionActualizada.nombreImagen);
		});
		

					
	}
	
	
	
	function eliminarConversacion(id){
		
		var id = id;
		
		$("#conversacion_" + id).remove();
		
		stomp.send(destinoEnvio_EliminarConversacion, {"id" : id});
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









