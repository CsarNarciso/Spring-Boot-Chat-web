package com.cesar.ChatWeb.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.web.multipart.MultipartFile;

import com.cesar.ChatWeb.entity.Usuario;
import com.cesar.ChatWeb.repository.Conversacion_Repositorio;
import com.cesar.ChatWeb.repository.Usuario_Repositorio;
import com.cesar.Methods.ActualizarDatosUsuario;

@Aspect
@Component
@Order(1)
public class Aspecto_AlmacenamientoUsuarioBBDD {

	@Before("execution(* com.cesar.ChatWeb.controller.Controlador_Paginas.damePagina_Index_desdeRegistro(..))")
	public void guardarUsuarioBBDD(JoinPoint interceptor) {
		
		Object[] parametros = interceptor.getArgs();
		
		usuario = (Usuario) parametros[0];
		BindingResult resultadoValidacion = (BindingResult) parametros[1];
		metadatosImagen = (MultipartFile) parametros[6];
		
		
		if(resultadoValidacion.hasErrors()==false) {
			
			usuario.setContraseña(passwordEncoder.encode(usuario.getContraseña()));

			usuarioRepo.save(usuario);
			System.out.println("Subiendo usuario " + usuario.getNombre() + " a BBDD...");
			
			
			Usuario usuarioGuardado = usuarioRepo.findByNombreOrEmail(usuario.getNombre());
			Long idUsuario = usuarioGuardado.getId();
			
			ActualizarDatosUsuario actualizarDatosUsuario = new ActualizarDatosUsuario(usuarioRepo, conversacionRepo);
			actualizarDatosUsuario.guardarImagenPerfil(metadatosImagen, idUsuario);
			
		}
		
	}
	
	
	
	
	
	
	
	
	
	@Autowired 
	private PasswordEncoder passwordEncoder;
	@Autowired
	private Usuario_Repositorio usuarioRepo;
	@Autowired
	private Conversacion_Repositorio conversacionRepo;
	
	private Usuario usuario;
	private MultipartFile metadatosImagen;
	
}
