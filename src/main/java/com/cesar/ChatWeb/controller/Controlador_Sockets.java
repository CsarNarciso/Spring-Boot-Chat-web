package com.cesar.ChatWeb.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.cesar.ChatWeb.entity.Conversacion;
import com.cesar.ChatWeb.entity.Mensaje;
import com.cesar.ChatWeb.entity.Usuario;
import com.cesar.ChatWeb.repository.Conversacion_Repositorio;
import com.cesar.ChatWeb.repository.Mensaje_Repositorio;
import com.cesar.ChatWeb.repository.Usuario_Repositorio;

@Controller
public class Controlador_Sockets {

	
	
	@MessageMapping("/actualizarUsuariosOnline")
	public void actualizarUsuariosOnline(Map<String, Object> datos) {
		
		Long id = (Long) datos.get("id");
	
		if( datos.get("accion") == "agregar" ) {
			
			if(!usuariosOnline.containsKey(id)) {
				
				String nombre = (String) datos.get("nombre");
				String nombreImagen = (String) datos.get("nombreImagen");
				
				Usuario usuario = new Usuario(id, nombre, nombreImagen);
				
				usuariosOnline.put(id, usuario);
			}
		}
		else {
			
			if(usuariosOnline.containsKey(id)) {
				
				usuariosOnline.remove(id);
			}
		}
		
		
		simp.convertAndSend("/topic/mostrarListaUsuariosOnline", usuariosOnline);
		
	}
	
	
	
	
	@MessageMapping("/obtenerListaConversaciones")
	public void obtenerListaConversaciones(Long id) {
	
		List<Conversacion> conversaciones = conversacionRepo.findAllByUserID(id);
		
		simp.convertAndSend("/user/" + id + "/queue/conversaciones", conversaciones);
	
	}
	

	
	

	@MessageMapping("/enviarMensaje")
	public void enviarMensaje(Map<String, Object> envio) {
		
		String destinoEnvio = "/user/" + envio.get("idDestinatario") + "/queue/mensajes";
		
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
	
	
	
	
	
	
	
	
	
	
	
	
	@Autowired
	private SimpMessagingTemplate simp; 
	
	@Autowired
	private Conversacion_Repositorio conversacionRepo;
	
	@Autowired
	private Mensaje_Repositorio mensajeRepo;
	
	@Autowired
	private Usuario_Repositorio usuarioRepo;
	
	private Map<Long, Usuario> usuariosOnline = new HashMap<Long, Usuario>();
	
	
	
}
