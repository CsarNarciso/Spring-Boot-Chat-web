package com.cesar.ChatWeb.validation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = Validador_NombreNoDisponible.class)
public @interface NombreNoDisponible {

	public String message() default "Este nombre de usuario ya esta en uso";
	
	Class<?>[] groups() default {};
	
	Class <? extends Payload>[] payload() default {};
	
}
