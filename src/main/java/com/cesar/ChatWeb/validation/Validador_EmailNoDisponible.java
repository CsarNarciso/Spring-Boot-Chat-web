package com.cesar.ChatWeb.validation;

import org.springframework.beans.factory.annotation.Autowired;

import com.cesar.ChatWeb.entity.Usuario;
import com.cesar.ChatWeb.repository.Usuario_Repositorio;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class Validador_EmailNoDisponible implements ConstraintValidator<EmailNoDisponible, String> {

	
	
	@Override
	public boolean isValid(String email, ConstraintValidatorContext context) {

		Usuario u = userRepo.findByNombreOrEmail(email);
		
		return u == null ? true : false;
	}
	
	
	
	@Autowired
	private Usuario_Repositorio userRepo;

}
