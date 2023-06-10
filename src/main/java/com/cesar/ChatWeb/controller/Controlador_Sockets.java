package com.cesar.ChatWeb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.cesar.ChatWeb.entity.Mensaje;
import com.cesar.ChatWeb.repository.Mensaje_Repositorio;

@Controller
public class Controlador_Sockets {

	
//	@Autowired
//	private SimpMessagingTemplate simp;
//	@Autowired
//	private Mensaje_Repositorio mensajeRepo;
//	
//	@MessageMapping("/mensajePrivado/user/{destinatario}")
//	public void enviarMensaje(@DestinationVariable String destinatario, Mensaje mensaje) {
//
//		//se manda a llamar a metodo para verificar existencia de conversacion
//		//En memoria cache se verifica si ya existe una conversacion entre el remitente y el destinatario del mensaje
//			//no
//				//se crea la conversacion
//		//Se verifica si ya existe una conversacion entre el destinatario y el remitente
//			//no
//				//se crea la conversacion
//
//		//teniendo certeza de que las conversaciones estan ya creadas
//			//se agrega el mensaje a la memoria cache 
//			mensajeRepo.save(mensaje);
//			//se envia el nuevo mensaje al cliente para verificar si tiene o no la conversacion abierta
//			String destinoMensaje = "/user/" + destinatario + "/queue/conversacion";
//			simp.convertAndSend(destinoMensaje, mensaje);
//		
//	}

	
	
}
