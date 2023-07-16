package com.cesar.ChatWeb.entity;

import java.util.ArrayList;
import java.util.List;

import com.cesar.ChatWeb.validation.EmailNoDisponible;
import com.cesar.ChatWeb.validation.EmailPersonalizado;
import com.cesar.ChatWeb.validation.NombreNoDisponible;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "usuarios")
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Nombre necesario")
//	@NombreNoDisponible
	private String nombre;

	@EmailPersonalizado(message = "Introduce un email correcto")
//	@EmailNoDisponible
	private String email;
	
	private String nombreImagen;

	@NotBlank(message = "Contraseña necesaria")
	private String contraseña;
	
	
	
	
	
	
	
	public Usuario() {}
	
	
	public Usuario(Long id, String nombre, String nombreImagen) {
		this.id = id;
		this.nombre = nombre;
		this.nombreImagen = nombreImagen;
	}
	
	


	public Usuario(Long id, String nombre) {
		this.id = id;
		this.nombre = nombre;
	}

	
	
	
	
	
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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
	
	public String getNombreImagen() {
		return nombreImagen;
	}

	public void setNombreImagen(String nombreImagen) {
		this.nombreImagen = nombreImagen;
	}

	public String getContraseña() {
		return contraseña;
	}

	public void setContraseña(String contraseña) {
		this.contraseña = contraseña;
	}
	

}
