package com.cesar.ChatWeb.validation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = Validador_EmailPersonalizado.class)
public @interface EmailPersonalizado {
	
	public String message() default "Email invalido";
	
	Class<?>[] groups() default {};
	
	Class <? extends Payload>[] payload() default {};
	
}
