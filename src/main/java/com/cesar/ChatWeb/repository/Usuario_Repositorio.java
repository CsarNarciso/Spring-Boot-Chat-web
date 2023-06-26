package com.cesar.ChatWeb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cesar.ChatWeb.entity.Usuario;

@Repository
public interface Usuario_Repositorio extends JpaRepository<Usuario, Long>{
	
	@Query("SELECT u FROM Usuario u WHERE u.nombre = :nombre_email OR u.email = :nombre_email")
	Usuario findByNombreOrEmail(@Param("nombre_email") String nombre_email);
	
	@Query("SELECT u FROM Usuario u WHERE u.id = :id")
	Usuario findByID(@Param("id") Long id);
	
	@Query("UPDATE Usuario u SET u.nombreImagen = :nombre WHERE u.id = :id")
	void updateNombreImagen(@Param("nombre") String nombre, @Param("id") Long id);
	
	
}
