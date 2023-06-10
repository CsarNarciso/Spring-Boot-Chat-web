package com.cesar.ChatWeb.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cesar.ChatWeb.entity.Mensaje;

public interface Mensaje_Repositorio extends JpaRepository<Mensaje, Long> {

	public Mensaje findByRemitenteAndDestinatario(String remitente, String destinatario);
	
}
