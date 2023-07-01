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
	var destinoEnvio_Mensaje = "/enviarMensaje";
	var destinoEnvio_ActualizarListaUsuarios = "/actualizarListaUsuariosOnline";
	var destinoEnvio_ObtenerListaConversaciones = "/obtenerListaConversaciones";
	var destinoEnvio_CrearConversacion = "/crearConversacion";
	var destinoEnvio_EliminarConversacion = "/eliminarConversacion";



	
	//////////////ENVIO ACTUALIZAR CONVERSACION//////////////////////////
	/////////////////////////////////////////////////////////////////////



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
							"<img id='elemento_imagen' scr='" + (rutaImagenesPerfil + nombreImagenP) + "'></img>" +
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
				"<span id='elemento_nombre'>" + nombre + "</span>" +
				"<img id='elemento_imagen' scr='" + (rutaImagenesPerfil + nombreImagen) + "'></img>" +
				"<span id='elemento_mensajesNuevos'>" + mensajesNuevos + "</span>" +
			"</li>"
		
		);	
	
	
						//////AGREGAR ID DE REMITENTE Y DESTINATARIO A CONVERSACION (CLIENTE)///////////////
	////////////////////////////////////////////////////////////////////////////////////

	///////////////////SUBSCRIBIR PARA ACTUALIZAR CONVERSACION CUANDO DESTINATARIO MODIFIQUE SUS DATOS//////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
					
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
		
		
		$("#conversacion_" + id).on("contextmenu", function(e){
			
			e.preventdefault();
			
			$("#menu_OpcionesConversacion").css(
				{
					display: "block",
					top: e.pageX,
					left: e.pageY
				}
			);
			
			
			$("#opcionesConversacion #eliminar").attr("idConversacion", id);
			
		});
		

					
	}
	
	
	
	function eliminarConversacion(){
		var idConversacion = $("#opcionesConversacion #eliminar").attr("idConversacion")
		stomp.send(destinoEnvio_EliminarConversacion, {"id" : idConversacion});
	}
	
	
	
	
	//////////////////ASIGNACION DE FUNCIONES A ELEMENTOS////////////////////
	/////////////////////////////////////////////////////////////////////////
	
		////////////ocultar menu para eliminar conversacion
	$(this).click(function(){
		$("#menu_OpcionesConversacion").hide();	
	});
	
		//////////eliminar conversacion en opciones de conversacion
	$("#opcionesConversacion #eliminar").click(eliminarConversacion());
	
	
	
	
	

});









