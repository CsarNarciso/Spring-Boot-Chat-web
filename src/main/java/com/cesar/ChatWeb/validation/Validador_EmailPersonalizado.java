package com.cesar.ChatWeb.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class Validador_EmailPersonalizado implements ConstraintValidator<EmailPersonalizado, String> {

	
	@Override
	public boolean isValid(String emailIntroducido, ConstraintValidatorContext context) {
		
		return (emailIntroducido.matches("^[A-Za-z0-9]+@[A-Za-z]+\\.[A-Za-z]{2,3}$"));
		
	}

	
}
