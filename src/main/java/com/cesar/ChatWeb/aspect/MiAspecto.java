package com.cesar.ChatWeb.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;

import com.cesar.ChatWeb.entity.Usuario;
import com.cesar.ChatWeb.repository.Usuario_Repositorio;

@Aspect
@Component
@Order(1)
public class MiAspecto {

	@Before("execution(* com.cesar.ChatWeb.controller.Controlador_Paginas.damePagina_Index_desdeRegistro(..))")
	public void almacenamientoUsuarioBBDD(JoinPoint interceptor) {
		
		Object[] parametros = interceptor.getArgs();
		BindingResult resultadoValidacion = (BindingResult) parametros[1];
		Usuario usuario = (Usuario) parametros[0];
		
		if(resultadoValidacion.hasErrors()==false) {
			usuario.setContraseña(passwordEncoder.encode(usuario.getContraseña()));
			bbdd_Usuarios.save(usuario);
			System.out.println("Subiendo usuario " + usuario.getNombre() + " a BBDD...");

		}
		
	}
	
	
	@Autowired 
	private PasswordEncoder passwordEncoder;
	@Autowired
	private Usuario_Repositorio bbdd_Usuarios;
	
}
