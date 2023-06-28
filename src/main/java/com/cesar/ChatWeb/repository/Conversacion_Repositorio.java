package com.cesar.ChatWeb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cesar.ChatWeb.entity.Conversacion;

public interface Conversacion_Repositorio extends JpaRepository<Conversacion, Long> {

	@Query("SELECT c FROM Conversacion c WHERE c.id_remitente = :remitente AND c.id_destinatario = :destinatario")
	Conversacion findByUserIDs(@Param("remitente") Long id_remitente, @Param("destinatario") Long id_destinatario);
	
	@Query("SELECT c FROM Conversacion c WHERE c.id_remitente = :remitente")
	List<Conversacion> findAllByUserID(@Param("remitente") Long id_usuario);
	
	@Modifying
	@Query("UPDATE Conversacion c SET c.nombre = :nombreNuevo WHERE c.id_destinatario = :id_usuario")
	void updateNameByUserID(@Param("id_usuario") Long id_usuario, @Param("nombreNuevo") String nombreNuevo);
	
	@Modifying
	@Query("DELETE FROM Conversacion c WHERE c.id_remitente = :id_usuario")
	void deleteAllByUserId(@Param("id_usuario") Long id_usuario);
	
}
