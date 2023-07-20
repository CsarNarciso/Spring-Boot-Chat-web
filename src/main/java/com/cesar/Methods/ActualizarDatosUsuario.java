package com.cesar.Methods;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.cesar.ChatWeb.repository.Conversacion_Repositorio;
import com.cesar.ChatWeb.repository.Usuario_Repositorio;

@Component
public class ActualizarDatosUsuario {
	
	public ActualizarDatosUsuario(Usuario_Repositorio userRepo, Conversacion_Repositorio conversacionRepo) {
		this.userRepo = userRepo;
		this.conversacionRepo = conversacionRepo;
	}

	
	public String guardarImagenPerfil(MultipartFile metadatosImagen, Long idUsuario) {
			
			String nombreImagen = "SinImagen.jpg";
			String extension = null;
		
			if(!metadatosImagen.isEmpty()) {
	
				
				String tipoExtension = metadatosImagen.getContentType();
				
				if( tipoExtension.equals("image/jpeg") ) {
					extension = ".jpg";
				}
				else if ( tipoExtension.equals("image/png") ) {
					extension = ".png";
				}
				
				if ( extension != null ) {
				
					String rutaImagen = "C:\\Users\\cesar\\Desktop\\Programacion\\SPRING\\Practica\\ChatWeb\\src\\main\\resources\\static\\ImagenesDePerfil" + idUsuario;
					
					File imagen = new File(rutaImagen);
					
					if (imagen.exists()) {
						
						System.out.println("Remplazando anterior imagen...");
						imagen.delete();
						
					}
					
					try { 
						metadatosImagen.transferTo(imagen);
						System.out.println("Imagen de perfil almacenada en servidor");
						nombreImagen = idUsuario + extension;
					}
					catch(Exception e) { e.printStackTrace(); }
					
				}
					
				
			}
				
			userRepo.updateNombreImagen(nombreImagen, idUsuario);
			
			conversacionRepo.updateNombreImagenByUserID(idUsuario, nombreImagen);
			
			return nombreImagen;
			
		}
	
	@Autowired
	private Usuario_Repositorio userRepo;

	@Autowired
	private Conversacion_Repositorio conversacionRepo;
	
}
