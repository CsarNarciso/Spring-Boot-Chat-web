package com.cesar.ChatWeb.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;

import com.cesar.ChatWeb.entity.Usuario;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Aspect
@Component
@Order(2)
public class Aspecto_AutenticacionAutomatica {

	@Before("execution(* com.cesar.ChatWeb.controller.Controlador_Paginas.damePagina_Index_desdeRegistro(..))")
	public void autenticacionAutomatica(JoinPoint interceptor) {
		
		Object[] parametros = interceptor.getArgs();
		Usuario usuario = (Usuario) parametros[0];
		HttpServletRequest request = (HttpServletRequest) parametros[2];
		HttpServletResponse response = (HttpServletResponse) parametros[3];


		Authentication authentication = new UsernamePasswordAuthenticationToken(
			      usuario.getNombre(),
			      usuario.getContraseña()
			    );
		
		SecurityContextHolderStrategy securityContextHolderStrategy = SecurityContextHolder
		        .getContextHolderStrategy();
	    SecurityContext context = securityContextHolderStrategy.createEmptyContext();
	    context.setAuthentication(authentication);
	    securityContextHolderStrategy.setContext(context);
	    securityContextRepository.saveContext(context, request, response);
		
	}
	
	@Autowired
	private SecurityContextRepository securityContextRepository;
	
}
