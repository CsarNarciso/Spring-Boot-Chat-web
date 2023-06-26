package com.cesar.ChatWeb.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="conversaciones")
public class Conversacion {
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private Long id_remitente;
	private Long id_destinatario;
	private String nombre;
	private String nombreImagen;
	private int mensajesNuevos;
	
	
	
	public Conversacion() {
		super();
	}
	
	
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getId_remitente() {
		return id_remitente;
	}
	public void setId_remitente(Long id_remitente) {
		this.id_remitente = id_remitente;
	}
	public Long getId_destinatario() {
		return id_destinatario;
	}
	public void setId_destinatario(Long id_destinatario) {
		this.id_destinatario = id_destinatario;
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
	public int getMensajesNuevos() {
		return mensajesNuevos;
	}
	public void setMensajesNuevos(int mensajesNuevos) {
		this.mensajesNuevos = mensajesNuevos;
	}
	
	
	
	
	
}
