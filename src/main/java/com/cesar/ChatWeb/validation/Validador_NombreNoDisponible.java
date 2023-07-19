package com.cesar.ChatWeb.validation;

import org.springframework.beans.factory.annotation.Autowired;

import com.cesar.ChatWeb.entity.Usuario;
import com.cesar.ChatWeb.repository.Usuario_Repositorio;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class Validador_NombreNoDisponible implements ConstraintValidator<NombreNoDisponible, String> {

	
	@Override
	public boolean isValid(String nombre, ConstraintValidatorContext context) {
		
		Usuario u = userRepo.buscarPorNombre_Email(nombre);
		
		return u == null ? true : false;
		
	}
	
	
	
	
	@Autowired
	private Usuario_Repositorio userRepo;
	
}
