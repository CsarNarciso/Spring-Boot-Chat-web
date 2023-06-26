$(document).ready(function() {


	////////////////VARIABLES////////////////////
	/////////////////////////////////////////////
	var socket = new SockJS("/chat/index");
	var stomp = Stomp.over(socket);
	
	var nombre = $("#datosUsuario").attr("data-Nombre");
	var id = $("#datosUsuario").attr("data-Id");
	var nombreImagen = $("#datosUsuario").attr("data-NombreImagen");
	
	var nombreDestinatarioActual;
	var idDestinatarioActual;
	
	var rutaImagenesPerfil = "/imagenesDePerfil/";
	
	var destinoSuscripcion_ListaUsuarios = "/topic/mostrarListaUsuariosOnline";
	var destinoSuscripcion_ListaConversaciones = "/user/" + id + "/queue/conversaciones";
	var destinoSuscripcion_Mensajes = "/user/" + id + "/queue/mensajes";
	var destinoEnvio_Mensaje = "/enviarMensaje";
	var destinoEnvio_ActualizarListaUsuarios = "/actualizarListaUsuariosOnline";
	var destinoEnvio_ObtenerListaConversaciones = "/obtenerListaConversaciones";
	var destinoCrearConversacion = "/crearConversacion";




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
				if(u.id !== id){
					
					$("#listaUsuarios").append(
						
						"<li id='usuario_" + u.id + "'>" + 
							"<span>" + u.nombre + "</span>" +
							"<span>Activo</span>" + 
						"</li>"
						
					);
					
					$("#usuario_" + u.id).attr("data-Id", u.id);
					$("#usuario_" + u.id).attr("data-Nombre", u.nombre);
					
		
					$("ul#listaUsuarios").find("li[id='usuario_" + u.id + "']").click(function(){
						
						$("#nombreConversacion").empty();
						$("#nombreConversacion").append(u.nombre);
						
						$("#nombreConversacion").toggle();
						$("#formEnviar").toggle();
						
						idDestinatarioActual = $(this).attr("data-Id");
						nombreDestinatarioActual = $(this).attr("data-Nombre");
						
						
						if($("ul#listaConversaciones").find("li[id='" + u.id + "']").length > 0){
							$("#formEnviar").attr("data-CrearConversacion", "No");
						}
						else{
							$("#formEnviar").attr("data-CrearConversacion", "Si");
						};
						
					});
					
				}
			});

		});
		
		
		
		/////////SUSCRIPCION MOSTRAR LISTA DE CONVERSACIONES//////////
		/////////////////////////////////////////////////////////////////
		stomp.subscribe(destinoSuscripcion_ListaConversaciones, function(message){
			
			var listaConversaciones = JSON.parse(message.body);
			
			$("#listaConversaciones").empty();
			
			listaConversaciones.forEach(function(c){
				
				$("#listaConversaciones").append(
					
					"<li id='conversacion_" + c.id + "' " + 
					"data-Nombre='" + c.nombre + "'" +
					">" +
					"<span>" + $(this).attr("data-Nombre") + "</span>" +
					"</li>"
					
				);	
				
				$("ul#listaConversaciones").find("li[id='conversacion_" + c.id + "']").attr("data-Id", c.id);
				
				$("ul#listaConversaciones").find("li[id='conversacion_" + c.id + "']").click(function(){
					
					$("#nombreConversacion").empty();
					$("#nombreConversacion").append(c.nombre);
						
						$("#nombreConversacion").toggle();
						$("#formEnviar").toggle();
						
						idDestinatarioActual = $(this).attr("data-Id");
						
						$("#formEnviar").attr("data-CrearConversacion", "No");
					
				});
				
			});
			
			
		});
		
		
		
		
		//////////ENVIO NOTIFICACION OBTENER Y ACTUALIZAR GLOBALMENTE USUARIOS ONLINE///////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////
		stomp.send(destinoEnvio_ActualizarListaUsuarios, {
			"accion" : "agregar", 
			"id" : id, 
			"nombre" : nombre
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
			
			$("ul#listaConversaciones").append(
				"<li id='" + idDestinatarioActual + "'>" + 
					"<span>" + nombreDestinatarioActual + "</span>"+ 
				"</li>"
			);
			
			var conversacion = {
				"idDestinatario" : idDestinatarioActual, 
				"nombreDestinatario" : nombreDestinatarioActual, 
				"idRemitente" : id
			}
			
			stomp.send(destinoCrearConversacion, conversacion);
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
	
	
	
	
	
	
	

});









