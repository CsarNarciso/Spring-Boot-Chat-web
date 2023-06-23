package com.cesar.ChatWeb.validation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = Validador_EmailNoDisponible.class)
public @interface EmailNoDisponible {

	public String message() default "Este email ya esta siendo utilizado por otra cuenta";
	
	Class<?>[] groups() default {};
	
	Class <? extends Payload>[] payload() default {};
	
}
