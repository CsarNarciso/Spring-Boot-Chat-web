package com.cesar.ChatWeb.validation;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery.FetchableFluentQuery;

import com.cesar.ChatWeb.entity.Usuario;
import com.cesar.ChatWeb.repository.Usuario_Repositorio;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class Validador_EmailNoDisponible implements ConstraintValidator<EmailNoDisponible, String> {

	
	@Override
	public boolean isValid(String email, ConstraintValidatorContext context) {

		Usuario u = userRepo.buscarPorNombre_Email(email);
		
		return u == null ? true : false;
	}
	
	@Autowired
	private Usuario_Repositorio userRepo;

}
