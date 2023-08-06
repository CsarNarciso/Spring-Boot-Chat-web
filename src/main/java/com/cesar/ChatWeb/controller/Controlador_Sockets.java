package com.cesar.ChatWeb.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.messaging.support.NativeMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartFile;

import com.cesar.ChatWeb.entity.Conversacion;
import com.cesar.ChatWeb.entity.Mensaje;
import com.cesar.ChatWeb.entity.Usuario;
import com.cesar.ChatWeb.repository.Conversacion_Repositorio;
import com.cesar.ChatWeb.repository.Mensaje_Repositorio;
import com.cesar.ChatWeb.repository.Usuario_Repositorio;
import com.cesar.Methods.ActualizarDatosUsuario;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class Controlador_Sockets {



	@MessageMapping("/actualizarUsuariosOnline")
	public void actualizarUsuariosOnline(Map<String, Object> datos) {

		String accion = (String) datos.get("accion");
		Long id = Long.valueOf( (String) datos.get("id") );
		
		System.out.println("Accion: " + accion);

		if( accion.equals("agregar") || accion.equals("actualizar") ) {
			
			if ( accion.equals("actualizar") ) {
				
				System.out.println("Actualizando usuario online");
				
				usuariosOnline.remove(id);
			}

			if( !usuariosOnline.containsKey(id) ) {
				
				System.out.println("Agregando usuario online");

				String nombre = (String) datos.get("nombre");
				String nombreImagen = (String) datos.get("nombreImagen");

				Usuario usuario = new Usuario(id, nombre, nombreImagen);

				usuariosOnline.put(id, usuario);
				
			}
		}

		else if ( accion.equals("quitar") ){

			if(usuariosOnline.containsKey(id)) {
				
				System.out.println("Quitando usuario online");

				usuariosOnline.remove(id);
			}
		}
		
		simp.convertAndSend("/topic/mostrarListaUsuariosOnline", usuariosOnline);
		
		System.out.println("Lista usuarios online devuelta");

	}




	@MessageMapping("/obtenerListaConversaciones")
	public void obtenerListaConversaciones(Long id) {

		List<Conversacion> conversaciones = conversacionRepo.findAllByUserID(id);

		simp.convertAndSend("/user/" + id + "/queue/conversaciones", conversaciones);

	}





	@MessageMapping("/enviarMensaje")
	public void enviarMensaje(Map<String, Object> envio) {

		Mensaje mensaje = (Mensaje) envio.get("mensaje");

		Long idDestinatario = mensaje.getId_destinatario();

		String destinoEnvio = "/user/" + idDestinatario + "/queue/recibirMensaje";

		mensajeRepo.save(mensaje);

		simp.convertAndSend(destinoEnvio, envio);

	}





	@MessageMapping("/crearConversacion")
	public void crearConversacion(Conversacion conversacion) {
		conversacionRepo.save(conversacion);
	}




	@MessageMapping("/eliminarConversacion")
	public void eliminarConversacion(Long id) {
		conversacionRepo.deleteById(id);
	}


	
	
	
	@MessageMapping("/actualizarMensajesNuevos")
	public void actualizarMensajesNuevos(Map<String, Object> datos) {

		conversacionRepo.updateMensajesNuevosByIDs(
			(Long) datos.get("idRemitente"),
			(Long) datos.get("idDestintatario"),
			(Integer) datos.get("mensajesNuevos")
		);
	}





	@MessageMapping("/obtenerListaMensajes")
	public void obtenerListaMensajes(Map<String, Long> ids) {

		Long idRemitente = ids.get("idRemitente");
		Long idDestinatario = ids.get("idDestinatario");

		List<Mensaje> listaMensajes = mensajeRepo.findAllByIDs(idRemitente, idDestinatario);

		simp.convertAndSend("/user/" + idRemitente + "/queue/mensajes", listaMensajes);
	}




	@Autowired
	private SimpMessagingTemplate simp;

	@Autowired
	private Conversacion_Repositorio conversacionRepo;

	@Autowired
	private Mensaje_Repositorio mensajeRepo;

	@Autowired
	private Usuario_Repositorio usuarioRepo;

	private Map<Long, Usuario> usuariosOnline = new HashMap<>();



}
