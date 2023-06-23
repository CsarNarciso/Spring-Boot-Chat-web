package com.cesar.Methods;

import java.io.File;

import org.springframework.web.multipart.MultipartFile;

public class ActualizarDatosUsuario {

	public static void guardarImagenPerfil(MultipartFile metadatosImagen, Long idUsuario) {
			
			if(!metadatosImagen.isEmpty()) {
	
				String rutaImagen = "\\resources\\static\\ImagenesDePerfil\\" + idUsuario;
				
				File imagen = new File(rutaImagen);
				
				
				if (imagen.exists()) {
	
					imagen.delete();
					System.out.println("Remplazando anterior imagen...");
				}
	
				
				try { 
					metadatosImagen.transferTo(imagen);
				}
				catch(Exception e) { e.printStackTrace(); }
				
				System.out.println("Imagen de perfil almacenada en servidor");
				
				
			}
			
		}
	
}
