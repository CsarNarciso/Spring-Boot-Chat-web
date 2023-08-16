package com.cesar.ChatWeb.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Controller;

import com.cesar.ChatWeb.entity.Conversacion;
import com.cesar.ChatWeb.entity.Mensaje;
import com.cesar.ChatWeb.repository.Conversacion_Repositorio;
import com.cesar.ChatWeb.repository.Mensaje_Repositorio;
import com.cesar.ChatWeb.repository.Usuario_Repositorio;

@Controller
public class Controlador_Sockets {



	@MessageMapping("/actualizarUsuariosOnline")
	public void actualizarUsuariosOnline(UsuarioOnline usuario) {

		System.out.println("-----------------------actualizarObtenerUsuariosOnline-----------------------" );
		
		//Instancias necesarias
		String actualizar = "";
		
		//Obtener info usuario
		String estado = usuario.getEstado();
		Long id = usuario.getId();
		
		
		System.out.println("Estado: " + estado);

		
		if ( estado.equals("CONECTADO") ) {
		
			//Reconectar
			if ( usuariosOnline.containsKey(id) ) {
			
				UsuarioOnline usuarioDesconectado = usuariosOnline.get(id);
				System.out.println(usuarioDesconectado.getNombre());
				
				if ( ! usuarioDesconectado.getEstado().equals(estado) ) {
				
					//Tiempo desconectado
					if ( System.currentTimeMillis() - usuarioDesconectado.getHoraDesconexion() < 5000 ) {
	
						//Correcto. 
						accionRealizada = "Reconectar";
						usuariosOnline.replace(id, usuario);
						simp.convertAndSend("/user/" + id + "/queue/RecivirListaUsuarios", usuariosOnline);
					}
				}	
			}
			//Conectar
			else {

				accionRealizada = "Agregar";
				usuariosOnline.put(id, usuario);
				System.out.println(usuario.getNombre());
				
				simp.convertAndSend("/user/" + id + "/queue/RecivirListaUsuarios", usuariosOnline);
				simp.convertAndSend("/topic/ActualizarListaUsuarios", usuario);
			}
		}
		else if ( estado.equals("DESCONECTADO") ) {
			
			//Desconectar
			if ( usuariosOnline.containsKey(id) ) {
				
				if ( ! usuariosOnline.get(id).getEstado().equals(estado) ) {
					
					//Guardar hora de desconexion
					usuariosOnline.get(id).setHoraDesconexion(System.currentTimeMillis());
					usuariosOnline.get(id).setEstado(estado);
					
					accionRealizada = "EsperarReconexion";
					
					//Timer: esperar reconexion
					new Timer().schedule(new TimerTask() {
						
						private Long idUsuarioDesconectado = id;
						private int contador=0;
						
						@Override
						public void run() { 
							
							if ( contador > 0 ) {
								
								//Si no se reconecta...
								if ( usuariosOnline.get(idUsuarioDesconectado).getEstado().equals("DESCONECTADO") ) {
									
									//Quitar
									usuariosOnline.remove(id);
									
									accionRealizada = "Quitar";
									
									//Enviar a todos actualizacion
									simp.convertAndSend("/topic/ActualizarListaUsuarios", usuario);
									
									System.out.println("Accion realizada: " + accionRealizada);
								}
								//Detener timer
								cancel();	
							}
							contador++;
						}
					}, 0, 5000);
				}
			}
		}
		
		//Si hay actualizacion...
		else if ( estado.contains("ACTUALIZAR") ) {
			
			//Actualizar
			accionRealizada = estado;
			
			//Enviar actualizacion a todos
			simp.convertAndSend("/topic/ActualizarListaUsuarios", usuario);
			
			//Volver a conectar 
			usuario.setEstado("CONECTADO");
			usuariosOnline.replace(id, usuario);	
			
			//Obtener usuariosOnline
			simp.convertAndSend("/user/" + id + "/queue/RecivirListaUsuarios", usuariosOnline);
		}
		
		System.out.println("Accion realizada: " + accionRealizada);
		System.out.println("-------------------------------------------------------" );
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

	
	
	
	//Clases internas
	
	private static class UsuarioOnline {
		
		private Long id;
		private String estado;
		private String nombre;
		private String nombreImagen;
		private Long horaDesconexion;
		
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public String getEstado() {
			return estado;
		}
		public void setEstado(String estado) {
			this.estado = estado;
		}
		public String getNombre() {
			return nombre;
		}
		public void setNombre(String nombre) {
			this.nombre = nombre;
		}
		public String getNombreImagen() {
			return nombreImagen;
		}
		public void setNombreImagen(String nombreImagen) {
			this.nombreImagen = nombreImagen;
		}
		public Long getHoraDesconexion() {
			return horaDesconexion;
		}
		public void setHoraDesconexion(Long horaDesconexion) {
			this.horaDesconexion = horaDesconexion;
		}
		
		
		
	}
	
	
	
	//Variables e instancias

	@Autowired
	private SimpMessagingTemplate simp;

	@Autowired
	private Conversacion_Repositorio conversacionRepo;

	@Autowired
	private Mensaje_Repositorio mensajeRepo;

	@Autowired
	private Usuario_Repositorio usuarioRepo;

	private Map<Long, UsuarioOnline> usuariosOnline = new HashMap<>();
	
	private String accionRealizada;



}
