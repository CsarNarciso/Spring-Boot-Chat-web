package com.cesar.Methods;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import com.cesar.ChatWeb.repository.Usuario_Repositorio;

public class ActualizarDatosUsuario {

	
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
				
					String rutaImagen = "\\resources\\static\\ImagenesDePerfil\\" + idUsuario;
					
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
			
			return nombreImagen;
			
		}
			
				
			

	@Autowired
	private Usuario_Repositorio userRepo;
	
}
