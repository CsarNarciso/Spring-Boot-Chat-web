package com.cesar.ChatWeb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cesar.ChatWeb.entity.Usuario;

import jakarta.transaction.Transactional;

@Repository
public interface Usuario_Repositorio extends JpaRepository<Usuario, Long>{
	
	
	
	@Query("SELECT u FROM Usuario u WHERE u.nombre = :nombre_email OR u.email = :nombre_email")
	Usuario buscarPorNombre_Email(@Param("nombre_email") String nombre_email);
	
	Usuario findByNombre(String nombre);
	
	Usuario findByEmail(String email1);
	
	@Query("SELECT u FROM Usuario u WHERE u.id = :id")
	Usuario findByID(@Param("id") Long id);
	
	@Transactional
	@Modifying
	@Query("UPDATE Usuario u SET u.nombre = :nuevoNombre WHERE u.id = :id")
	void updateNombre(@Param("nuevoNombre") String nuevoNombre, @Param("id") Long id);
	
	@Transactional
	@Modifying
	@Query("UPDATE Usuario u SET u.nombreImagen = :nuevoNombreImagen WHERE u.id = :id")
	void updateNombreImagen(@Param("nuevoNombreImagen") String nuevoNombreImagen, @Param("id") Long id);
	
	
	
	
}
