package com.cesar.ChatWeb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cesar.ChatWeb.entity.Mensaje;

public interface Mensaje_Repositorio extends JpaRepository<Mensaje, Long> {

	@Query("SELECT m FROM Mensaje m WHERE (m.id_remitente = :remitente OR m.id_remitente = :destinatario) AND (m.id_destinatario = :destinatario OR m.id_destinatario = :remitente)")
	List<Mensaje> findAllByIDs(@Param("remitente") Long id_remitente, @Param("destinatario") Long id_destinatario);
	
}
