$(document).ready(function() {

	var socket = new SockJS("/chat/index");
	var stomp = Stomp.over(socket);
	
	var remitente = $("#nombreUsuario").text();





	stomp.connect({}, function() {
		
//		var destinoSuscripcion = "/user/" + remitente + "/queue/conversacion";
//		
//		stomp.subscribe(destinoSuscripcion, function(message){
//			
//			var mensaje = JSON.parse(message.body);
//			
//			$("#bandejaMensajes").append(
//				"<br><br>" + 
//				"De " + mensaje.remitente +
//				"<br>" +
//				mensaje.contenido
//				);
//			
//		});
		
	});
	
	
	

//	$("#formEnviar").submit(function(event) {
//		event.preventDefault(); 
//
//		var contenido = $("#campoMensaje").val();
//		var destinatario = $("#campoRemitente").val();
//		
//		var mensaje = {
//			"remitente" : remitente, 
//			"destinatario" : destinatario,
//			"contenido" : contenido
//			}
//		
//		var destinoMensajePrivado = "/mensajePrivado/user/" + destinatario; 
//
//
//		stomp.send(destinoMensajePrivado, {}, JSON.stringify(mensaje));
//
//
//		$("#campoMensaje").val(""); 
//	});
	
	
	
	
	

});






