 package com.cesar.ChatWeb.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cesar.ChatWeb.entity.Usuario;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@Controller
public class Controlador_Paginas {



	@RequestMapping("/login")
	public String dameLogin() {
        return "Login";
	}
	


	@RequestMapping("/login/formularioRegistro")
	public String damePagina_Registro(Model modelo){

		modelo.addAttribute("usuario", new Usuario());

		return "Pagina_Registro";
	}
	
	
	
	
	
	@RequestMapping("/index")
	public String dameIndex_desdeLogin(Model modelo){
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Object principal = auth.getPrincipal();
		
		String nombreUsuario = ((UserDetails) principal).getUsername();

		modelo.addAttribute("nombreUsuario", nombreUsuario);
		
		return "Pagina_Chat";
	}
	
	
	
	
	@PostMapping("login/formularioRegistro/validar")
	public String damePagina_Index_desdeRegistro(
			@Valid @ModelAttribute("usuario") Usuario usuario, 
			BindingResult resultadoValidacion,
			Model modelo,
			HttpServletRequest request,
			HttpServletResponse response) {

		
			if (resultadoValidacion.hasErrors()){
				System.out.println("Validacion de datos erronea. Usuario no guardado en BBDD.");
				return "Pagina_Registro";
			}
			
			System.out.println("Acceso exitoso!");
			modelo.addAttribute("nombreUsuario", usuario.getNombre());
			return "Pagina_Chat";
		
			
	}

	


	
}
