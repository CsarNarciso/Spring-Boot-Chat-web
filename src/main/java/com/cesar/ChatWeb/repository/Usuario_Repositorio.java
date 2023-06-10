package com.cesar.ChatWeb.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cesar.ChatWeb.entity.Usuario;

@Repository
public interface Usuario_Repositorio extends JpaRepository<Usuario, Long>{
	
	@Query("SELECT u FROM Usuario u WHERE u.nombre = :nombre_email OR u.email = :nombre_email")
	public Usuario findByNombreOrEmail(@Param("nombre_email") String nombre_email);
	
//	public Usuario findByNombre(String nombre);
	
	
}
