package com.cesar.ChatWeb.validation;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;

public class Usuario_Validador {


	@NotBlank(message = "Nombre necesario")
	private String nombre;

	@EmailPersonalizado(message = "Introduce un email correcto")
	private String email;

	@NotBlank(message = "Contraseña necesaria")
	private String contraseña;

	private MultipartFile metadatosImagen;



	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getContraseña() {
		return contraseña;
	}

	public void setContraseña(String contraseña) {
		this.contraseña = contraseña;
	}

	public MultipartFile getMetadatosImagen() {
		return metadatosImagen;
	}

	public void setMetadatosImagen(MultipartFile metadatosImagen) {
		this.metadatosImagen = metadatosImagen;
	}


}
