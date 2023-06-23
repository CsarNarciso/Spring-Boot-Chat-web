package com.cesar.ChatWeb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cesar.ChatWeb.entity.Mensaje;

public interface Mensaje_Repositorio extends JpaRepository<Mensaje, Long> {

	@Query("SELECT m FROM Mensaje m WHERE m.id_remitente = :remitente AND m.id_destinatario = :destinatario")
	Mensaje findByRemitenteAndDestinatario(@Param("remitente") String remitente, @Param("destinatario") String destinatario);
	
}
